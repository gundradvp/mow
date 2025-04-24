using System.ComponentModel.DataAnnotations;

namespace MOWScheduler.Models
{
    public class Schedule
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        public DateTime ScheduledDate { get; set; }
        
        public string ShiftType { get; set; } = string.Empty; // Morning, Afternoon, etc.
        
        [Required]
        public int VolunteerId { get; set; }
        public Volunteer? Volunteer { get; set; }
        
        [Required]
        public int RouteId { get; set; }
        public DeliveryRoute? Route { get; set; }
        
        public string Status { get; set; } = string.Empty; // Scheduled, Confirmed, Completed, Canceled
        
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        
        public DateTime? UpdatedAt { get; set; }
        
        public string? Notes { get; set; }
        
        public bool ReminderSent { get; set; }
    }
}