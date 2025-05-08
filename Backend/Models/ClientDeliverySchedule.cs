// filepath: c:\Users\Durga Vara Prasad\Desktop\MOW\Backend\Models\ClientDeliverySchedule.cs
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using System;

namespace MOWScheduler.Models
{
    /// <summary>
    /// Represents the overall delivery schedule pattern for a client.
    /// </summary>
    public class ClientDeliverySchedule
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int ClientId { get; set; }
        public Client? Client { get; set; }

        // Example: "Weekly", "Bi-Weekly", "Monthly", "Custom"
        public string RecurrencePattern { get; set; } = "Weekly";

        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }

        public bool IsActive { get; set; } = true;

        // Collection of specific day/meal details
        public ICollection<ClientDeliveryScheduleDetail> ScheduleDetails { get; set; } = new List<ClientDeliveryScheduleDetail>();

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}
