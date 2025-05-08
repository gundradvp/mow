using System.ComponentModel.DataAnnotations;

namespace MOWScheduler.Models
{
    /// <summary>
    /// Represents a notification in the system.
    /// </summary>
    public class Notification
    {
        /// <summary>
        /// Gets or sets the unique identifier for the notification.
        /// </summary>
        [Key]
        public int Id { get; set; }

        /// <summary>
        /// Gets or sets the foreign key for the associated user.
        /// </summary>
        [Required]
        public int UserId { get; set; }

        /// <summary>
        /// Gets or sets the title of the notification.
        /// </summary>
        [Required]
        public string Title { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the message content of the notification.
        /// </summary>
        [Required]
        public string Message { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the date and time when the notification was created.
        /// </summary>
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        /// <summary>
        /// Gets or sets a value indicating whether the notification has been read.
        /// </summary>
        public bool IsRead { get; set; } = false;

        /// <summary>
        /// Gets or sets the type of the notification (e.g., Email, SMS, InApp).
        /// </summary>
        public string Type { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the status of the notification (e.g., Sent, Failed, Pending).
        /// </summary>
        public string Status { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the date and time when the notification was sent.
        /// </summary>
        public DateTime? SentAt { get; set; }

        /// <summary>
        /// Gets or sets the reference ID to a related entity (e.g., schedule ID, volunteer ID).
        /// </summary>
        public int? ReferenceId { get; set; }

        /// <summary>
        /// Gets or sets the type of the related entity (e.g., Schedule, Volunteer).
        /// </summary>
        public string? ReferenceType { get; set; }
    }
}