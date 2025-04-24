using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using MOWScheduler.Data;
using MOWScheduler.Models;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace MOWScheduler.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

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

        private string GenerateJwtToken(User user)
        {
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Username),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.Role, user.Role),
                new Claim("id", user.Id.ToString())
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

    public class RegisterDto
    {
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; }
    }

    public class LoginDto
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}