using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MOWScheduler.Models
{
    public class Volunteer
    {
        [Key]
        public int Id { get; set; }
        
        // Foreign key for User
        public int UserId { get; set; }
        
        [ForeignKey("UserId")]
        public User? User { get; set; }
        
        // Available days (comma separated string like "Monday,Wednesday,Friday")
        public string AvailableDays { get; set; } = string.Empty;
        
        public bool IsActive { get; set; } = true;
        
        public DateTime StartDate { get; set; } = DateTime.Now;
        
        public string Notes { get; set; } = string.Empty;
        
        // Navigation properties
        public ICollection<Schedule> Schedules { get; set; } = new List<Schedule>();
    }
}