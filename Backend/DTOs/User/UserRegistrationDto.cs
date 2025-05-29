using System;
using System.ComponentModel.DataAnnotations;

namespace MOWScheduler.DTOs.User
{
    /// <summary>
    /// Data transfer object for user registration.
    /// </summary>
    public class UserRegistrationDto
    {
        /// <summary>
        /// Gets or sets the username.
        /// </summary>
        [Required(ErrorMessage = "Username is required.")]
        [StringLength(100, MinimumLength = 3, ErrorMessage = "Username must be between 3 and 100 characters.")]
        public string Username { get; set; } = string.Empty;
        
        /// <summary>
        /// Gets or sets the email address.
        /// </summary>
        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress(ErrorMessage = "Invalid email address.")]
        public string Email { get; set; } = string.Empty;
        
        /// <summary>
        /// Gets or sets the password.
        /// </summary>
        [Required(ErrorMessage = "Password is required.")]
        [StringLength(100, MinimumLength = 6, ErrorMessage = "Password must be at least 6 characters.")]
        public string Password { get; set; } = string.Empty;
        
        /// <summary>
        /// Gets or sets the first name.
        /// </summary>
        [Required(ErrorMessage = "First name is required.")]
        public string FirstName { get; set; } = string.Empty;
        
        /// <summary>
        /// Gets or sets the last name.
        /// </summary>
        [Required(ErrorMessage = "Last name is required.")]
        public string LastName { get; set; } = string.Empty;
        
        /// <summary>
        /// Gets or sets the phone number.
        /// </summary>
        public string? PhoneNumber { get; set; }
        
        /// <summary>
        /// Gets or sets the role.
        /// </summary>
        [Required(ErrorMessage = "Role is required.")]
        public string Role { get; set; } = string.Empty;
        
        /// <summary>
        /// Gets or sets the operational roles (comma-separated).
        /// </summary>
        public string OperationalRoles { get; set; } = string.Empty;
        
        /// <summary>
        /// Gets or sets whether the user is a staff member.
        /// </summary>
        public bool IsStaff { get; set; } = false;
    }
    
    /// <summary>
    /// Data transfer object for staff registration (extends UserRegistrationDto).
    /// </summary>
    public class StaffRegistrationDto : UserRegistrationDto
    {
        /// <summary>
        /// Gets or sets the employee ID.
        /// </summary>
        public string EmployeeId { get; set; } = string.Empty;
        
        /// <summary>
        /// Gets or sets the department.
        /// </summary>
        public string Department { get; set; } = string.Empty;
        
        /// <summary>
        /// Gets or sets the position/title.
        /// </summary>
        public string Position { get; set; } = string.Empty;
        
        /// <summary>
        /// Gets or sets the hire date.
        /// </summary>
        public DateTime HireDate { get; set; } = DateTime.Now;
        
        public StaffRegistrationDto()
        {
            IsStaff = true;
        }
    }
}
