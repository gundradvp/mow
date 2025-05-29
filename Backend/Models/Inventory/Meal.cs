using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace MOWScheduler.Models.Inventory
{
    /// <summary>
    /// Represents a meal in the system.
    /// </summary>
    public class Meal
    {
        /// <summary>
        /// Gets or sets the unique identifier for the meal.
        /// </summary>
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        /// <summary>
        /// Gets or sets the name of the meal.
        /// </summary>
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the description of the meal.
        /// </summary>
        public string? Description { get; set; }

        /// <summary>
        /// Gets or sets the type of meal (e.g., Regular, Vegetarian, Diabetic).
        /// </summary>
        [Required]
        [StringLength(20)]
        public string MealType { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the calorie count for this meal.
        /// </summary>
        public int? Calories { get; set; }

        /// <summary>
        /// Gets or sets whether the meal is active and available for use.
        /// </summary>
        public bool IsActive { get; set; } = true;

        /// <summary>
        /// Gets or sets when the meal was created.
        /// </summary>
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        /// <summary>
        /// Gets or sets when the meal was last updated.
        /// </summary>
        public DateTime UpdatedAt { get; set; } = DateTime.Now;

        /// <summary>
        /// Navigation property for ingredients in this meal.
        /// </summary>
        public virtual ICollection<MealIngredient> Ingredients { get; set; } = new List<MealIngredient>();
    }
}
