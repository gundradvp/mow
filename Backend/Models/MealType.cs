// filepath: c:\Users\Durga Vara Prasad\Desktop\MOW\Backend\Models\MealType.cs
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

namespace MOWScheduler.Models
{
    /// <summary>
    /// Represents a type of meal offered (e.g., Regular, Vegetarian).
    /// </summary>
    public class MealType
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty;

        public string? Description { get; set; }

        // Navigation property for scheduled deliveries
        public ICollection<ClientDeliveryScheduleDetail> ScheduleDetails { get; set; } = new List<ClientDeliveryScheduleDetail>();
    }
}
