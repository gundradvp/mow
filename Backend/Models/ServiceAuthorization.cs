// filepath: c:\Users\Durga Vara Prasad\Desktop\MOW\Backend\Models\ServiceAuthorization.cs
using System;
using System.ComponentModel.DataAnnotations;

namespace MOWScheduler.Models
{
    /// <summary>
    /// Represents a service authorization for a client.
    /// </summary>
    public class ServiceAuthorization
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int ClientId { get; set; }
        public Client? Client { get; set; }

        [Required]
        public string AuthorizationProvider { get; set; } = string.Empty; // e.g., Insurance, AAA4

        public string? AuthorizationNumber { get; set; }

        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }

        public string? AuthorizedServices { get; set; } // Description of services

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
