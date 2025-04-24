using System.ComponentModel.DataAnnotations;

namespace MOWScheduler.Models
{
    public class Client
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        public string FirstName { get; set; } = string.Empty;
        
        [Required]
        public string LastName { get; set; } = string.Empty;
        
        public string? PhoneNumber { get; set; }
        
        [Required]
        public string Address { get; set; } = string.Empty;
        
        public string City { get; set; } = string.Empty;
        
        public string State { get; set; } = string.Empty;
        
        public string ZipCode { get; set; } = string.Empty;
        
        public bool IsActive { get; set; } = true;
        
        public DateTime RegistrationDate { get; set; } = DateTime.Now;
        
        public string? EmergencyContact { get; set; }
        
        public string? DietaryRestrictions { get; set; }
        
        public string? Notes { get; set; }
        
        // Navigation property
        public int? RouteId { get; set; }
        public DeliveryRoute? Route { get; set; }
    }
}