using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MOWScheduler.Models
{
    /// <summary>
    /// Represents a schedule in the system.
    /// </summary>
    public class Schedule
    {
        /// <summary>
        /// Gets or sets the unique identifier for the schedule.
        /// </summary>
        [Key]
        public int Id { get; set; }

        /// <summary>
        /// Gets or sets the date of the schedule.
        /// </summary>
        [Required]
        public DateTime ScheduledDate { get; set; }

        /// <summary>
        /// Gets or sets the type of shift (e.g., Morning, Afternoon).
        /// </summary>
        public string ShiftType { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the foreign key for the associated volunteer.
        /// </summary>
        [Required]
        public int VolunteerId { get; set; }

        /// <summary>
        /// Gets or sets the associated volunteer.
        /// </summary>
        public Volunteer? Volunteer { get; set; }

        /// <summary>
        /// Gets or sets the foreign key for the associated delivery route.
        /// </summary>
        [Required]
        public int RouteId { get; set; }

        /// <summary>
        /// Gets or sets the associated delivery route.
        /// </summary>
        public DeliveryRoute? Route { get; set; }

        /// <summary>
        /// Gets or sets the status of the schedule (e.g., Scheduled, Confirmed, Completed, Canceled).
        /// </summary>
        public string Status { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the creation timestamp of the schedule.
        /// </summary>
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        /// <summary>
        /// Gets or sets the last updated timestamp of the schedule.
        /// </summary>
        public DateTime? UpdatedAt { get; set; }

        /// <summary>
        /// Gets or sets additional notes for the schedule.
        /// </summary>
        public string? Notes { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether a reminder has been sent.
        /// </summary>
        public bool ReminderSent { get; set; }
    }
}