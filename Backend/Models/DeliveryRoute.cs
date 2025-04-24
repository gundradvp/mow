using System.ComponentModel.DataAnnotations;

namespace MOWScheduler.Models
{
    public class DeliveryRoute
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        public string Name { get; set; } = string.Empty;
        
        public string Description { get; set; } = string.Empty;
        
        public string Area { get; set; } = string.Empty; // Geographic area covered
        
        public int EstimatedDuration { get; set; } // In minutes
        
        public bool IsActive { get; set; } = true;
        
        // Navigation properties
        public ICollection<Client> Clients { get; set; } = new List<Client>();
        public ICollection<Schedule> Schedules { get; set; } = new List<Schedule>();
    }
}