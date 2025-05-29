using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MOWScheduler.Models.Inventory
{
    /// <summary>
    /// Represents an ingredient used in a meal recipe.
    /// </summary>
    public class MealIngredient
    {
        /// <summary>
        /// Gets or sets the unique identifier for the meal ingredient.
        /// </summary>
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        /// <summary>
        /// Gets or sets the meal ID this ingredient is part of.
        /// </summary>
        public Guid MealId { get; set; }        /// <summary>
        /// Gets or sets the inventory item ID for this ingredient.
        /// </summary>
        public Guid ItemId { get; set; }

        /// <summary>
        /// Gets or sets the quantity of this ingredient needed per meal.
        /// </summary>
        public decimal Quantity { get; set; }

        /// <summary>
        /// Gets or sets notes about this ingredient.
        /// </summary>
        public string? Notes { get; set; }

        /// <summary>
        /// Gets or sets when this meal-ingredient relationship was created.
        /// </summary>
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        /// <summary>
        /// Gets or sets when this meal-ingredient relationship was last updated.
        /// </summary>
        public DateTime UpdatedAt { get; set; } = DateTime.Now;        /// <summary>
        /// Navigation property for the meal.
        /// </summary>
        [ForeignKey("MealId")]
        public virtual Meal? Meal { get; set; }        /// <summary>
        /// Navigation property for the inventory item.
        /// </summary>
        [ForeignKey("ItemId")]
        public virtual InventoryItem? Item { get; set; }
    }
}
