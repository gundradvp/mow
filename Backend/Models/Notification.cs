using System.ComponentModel.DataAnnotations;

namespace MOWScheduler.Models
{
    public class Notification
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        public int UserId { get; set; }
        
        [Required]
        public string Title { get; set; } = string.Empty;
        
        [Required]
        public string Message { get; set; } = string.Empty;
        
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        
        public bool IsRead { get; set; } = false;
        
        public string Type { get; set; } = string.Empty; // Email, SMS, InApp
        
        public string Status { get; set; } = string.Empty; // Sent, Failed, Pending
        
        public DateTime? SentAt { get; set; }
        
        // Reference ID to related entity (like schedule ID, volunteer ID, etc.)
        public int? ReferenceId { get; set; }
        
        public string? ReferenceType { get; set; } // Schedule, Volunteer, etc.
    }
}