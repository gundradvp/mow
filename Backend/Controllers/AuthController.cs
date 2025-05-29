using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using MOWScheduler.Data;
using MOWScheduler.Models;
using MOWScheduler.DTOs.Volunteer;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace MOWScheduler.Controllers
{
    /// <summary>
    /// Controller for handling authentication-related operations.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        /// <summary>
        /// Initializes a new instance of the <see cref="AuthController"/> class.
        /// </summary>
        /// <param name="context">The database context.</param>
        /// <param name="configuration">The application configuration.</param>
        public AuthController(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        /// <summary>
        /// Registers a new user.
        /// </summary>
        /// <param name="registerDto">The registration details.</param>
        /// <returns>An action result indicating the outcome of the registration.</returns>
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto registerDto)
        {
            try
            {
                if (await _context.Users.AnyAsync(u => u.Username == registerDto.Username))
                    return BadRequest("Username already exists");

                if (await _context.Users.AnyAsync(u => u.Email == registerDto.Email))
                    return BadRequest("Email already exists");

                // Generate password hash with salt
                string passwordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password);

                var user = new User
                {
                    Username = registerDto.Username,
                    Email = registerDto.Email,
                    PasswordHash = passwordHash,
                    FirstName = registerDto.FirstName,
                    LastName = registerDto.LastName,
                    PhoneNumber = registerDto.PhoneNumber,
                    Role = "Volunteer", // Default role for registration
                    CreatedAt = DateTime.Now
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Registration successful" });
            }
            catch (Exception ex)
            {
                // Log the exception
                Console.WriteLine($"Registration error: {ex.Message}");
                return StatusCode(500, "An error occurred during registration. Please try again.");
            }
        }

        /// <summary>
        /// Registers a new volunteer with detailed information.
        /// </summary>
        /// <param name="registrationDto">The volunteer registration details.</param>
        /// <returns>An action result indicating the outcome of the registration.</returns>
        [HttpPost("register-volunteer")]
        public async Task<IActionResult> RegisterVolunteer(VolunteerRegistrationDTO registrationDto)
        {
            try
            {
                if (await _context.Users.AnyAsync(u => u.Username == registrationDto.Username))
                    return BadRequest("Username already exists");

                if (await _context.Users.AnyAsync(u => u.Email == registrationDto.Email))
                    return BadRequest("Email already exists");

                using (var transaction = await _context.Database.BeginTransactionAsync())
                {
                    try
                    {
                        // Generate password hash with salt
                        string passwordHash = BCrypt.Net.BCrypt.HashPassword(registrationDto.Password);                        // Create user entity
                        var user = new User
                        {
                            Username = registrationDto.Username,
                            Email = registrationDto.Email,
                            PasswordHash = passwordHash,
                            FirstName = registrationDto.FirstName,
                            LastName = registrationDto.LastName,
                            PhoneNumber = registrationDto.PhoneNumber,
                            Role = "Volunteer", // Specific role for volunteers
                            CreatedAt = DateTime.Now,
                            IsActive = true,
                            IsStaff = false, // Volunteers are not staff members
                            OperationalRoles = registrationDto.OperationalRoles
                        };

                        // Add and save user to get the ID
                        _context.Users.Add(user);
                        await _context.SaveChangesAsync();

                        // Create volunteer entity with detailed information
                        var volunteer = new Volunteer
                        {
                            UserId = user.Id,
                            Address = registrationDto.Address,
                            City = registrationDto.City,
                            State = registrationDto.State,
                            ZipCode = registrationDto.ZipCode,
                            Availability = registrationDto.Availability,
                            HasDriverLicense = registrationDto.HasDriverLicense,
                            IsWillingToDrive = registrationDto.IsWillingToDrive,
                            CanLift20Pounds = registrationDto.CanLift20Pounds,
                            BackgroundCheckConsent = registrationDto.BackgroundCheckConsent,
                            EmergencyContactName = registrationDto.EmergencyContactName,
                            EmergencyContactPhone = registrationDto.EmergencyContactPhone,
                            EmergencyContactRelationship = registrationDto.EmergencyContactRelationship,
                            Skills = registrationDto.Skills,
                            Preferences = registrationDto.Preferences,
                            IsActive = true,
                            StartDate = DateTime.Now
                        };

                        _context.Volunteers.Add(volunteer);
                        await _context.SaveChangesAsync();

                        await transaction.CommitAsync();

                        // Create a notification for admin about new volunteer registration
                        var adminUsers = await _context.Users.Where(u => u.Role == "Admin").ToListAsync();
                        foreach (var admin in adminUsers)
                        {
                            _context.Notifications.Add(new Notification
                            {
                                UserId = admin.Id,
                                Title = "New Volunteer Registration",
                                Message = $"New volunteer {user.FirstName} {user.LastName} has registered and needs approval.",
                                Type = "InApp",
                                Status = "Unread",
                                CreatedAt = DateTime.Now,
                                ReferenceId = volunteer.Id,
                                ReferenceType = "Volunteer"
                            });
                        }
                        await _context.SaveChangesAsync();

                        return Ok(new { message = "Volunteer registration successful" });
                    }
                    catch (Exception ex)
                    {
                        await transaction.RollbackAsync();
                        throw new Exception("Transaction failed", ex);
                    }
                }
            }
            catch (Exception ex)
            {
                // Log the exception
                Console.WriteLine($"Volunteer registration error: {ex.Message}");
                return StatusCode(500, "An error occurred during registration. Please try again.");
            }
        }

        /// <summary>
        /// Authenticates a user and returns a token.
        /// </summary>
        /// <param name="loginDto">The login details.</param>
        /// <returns>An action result containing the authentication token.</returns>
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto loginDto)
        {
            try
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == loginDto.Username);

                if (user == null)
                    return Unauthorized("Invalid username or password");

                // Verify password with BCrypt
                if (!BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
                    return Unauthorized("Invalid username or password");

                // Update last login time
                user.LastLogin = DateTime.Now;
                await _context.SaveChangesAsync();

                var token = GenerateJwtToken(user);
                
                return Ok(new
                {
                    token,
                    userId = user.Id,
                    username = user.Username,
                    role = user.Role
                });
            }
            catch (Exception ex)
            {
                // Log the exception
                Console.WriteLine($"Login error: {ex.Message}");
                return StatusCode(500, "An error occurred during login. Please try again.");
            }
        }

        /// <summary>
        /// Generates a JWT token for the authenticated user.
        /// </summary>
        /// <param name="user">The authenticated user.</param>
        /// <returns>A JWT token string.</returns>
        private string GenerateJwtToken(User user)
        {            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Username),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.Role, user.Role),
                new Claim("id", user.Id.ToString()),
                new Claim("isStaff", user.IsStaff.ToString().ToLower()),
                new Claim("operationalRoles", user.OperationalRoles ?? string.Empty)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"] ?? ""));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expires = DateTime.Now.AddHours(8);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: expires,
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }

    /// <summary>
    /// Data transfer object for user registration.
    /// </summary>
    public class RegisterDto
    {
        /// <summary>
        /// Gets or sets the username.
        /// </summary>
        public string Username { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the email address.
        /// </summary>
        public string Email { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the password.
        /// </summary>
        public string Password { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the first name.
        /// </summary>
        public string FirstName { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the last name.
        /// </summary>
        public string LastName { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the phone number.
        /// </summary>
        public string? PhoneNumber { get; set; }
    }

    /// <summary>
    /// Data transfer object for user login.
    /// </summary>
    public class LoginDto
    {
        /// <summary>
        /// Gets or sets the username.
        /// </summary>
        public string Username { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the password.
        /// </summary>
        public string Password { get; set; } = string.Empty;
    }
}