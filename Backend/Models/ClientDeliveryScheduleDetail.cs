using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MOWScheduler.Models
{
    /// <summary>
    /// Represents the details of a specific day within a client's delivery schedule.
    /// </summary>
    public class ClientDeliveryScheduleDetail
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int ClientDeliveryScheduleId { get; set; } // Foreign Key

        [ForeignKey("ClientDeliveryScheduleId")]
        public ClientDeliverySchedule? ClientDeliverySchedule { get; set; } // Navigation property

        [Required]
        public DayOfWeek DayOfWeek { get; set; } // e.g., Monday, Tuesday

        [Required]
        public int MealTypeId { get; set; } // Foreign Key

        [ForeignKey("MealTypeId")]
        public MealType? MealType { get; set; } // Navigation property

        [Required]
        [Range(1, 10)] // Example range, adjust as needed
        public int Quantity { get; set; }
    }
}
