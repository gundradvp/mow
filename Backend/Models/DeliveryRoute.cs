using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

namespace MOWScheduler.Models
{
    /// <summary>
    /// Represents a delivery route in the system.
    /// </summary>
    public class DeliveryRoute
    {
        /// <summary>
        /// Gets or sets the unique identifier for the delivery route.
        /// </summary>
        [Key]
        public int Id { get; set; }

        /// <summary>
        /// Gets or sets the name of the delivery route.
        /// </summary>
        [Required]
        public string Name { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the description of the delivery route.
        /// </summary>
        public string Description { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the geographic area covered by the delivery route.
        /// </summary>
        public string Area { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the estimated duration of the delivery route in minutes.
        /// </summary>
        public int EstimatedDuration { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether the delivery route is active.
        /// </summary>
        public bool IsActive { get; set; } = true;

        /// <summary>
        /// Gets or sets the collection of clients associated with the delivery route.
        /// </summary>
        public ICollection<Client> Clients { get; set; } = new List<Client>();

        /// <summary>
        /// Gets or sets the collection of schedules associated with the delivery route.
        /// </summary>
        public ICollection<Schedule> Schedules { get; set; } = new List<Schedule>();
    }
}