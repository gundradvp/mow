using System.ComponentModel.DataAnnotations;

namespace MOWScheduler.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Username { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;
        
        public string FirstName { get; set; } = string.Empty;
        
        public string LastName { get; set; } = string.Empty;
        
        public string? PhoneNumber { get; set; }

        [Required]
        public string Role { get; set; } = string.Empty; // Admin, Coordinator, Volunteer

        public DateTime CreatedAt { get; set; } = DateTime.Now;
        
        public DateTime? LastLogin { get; set; }
    }
}