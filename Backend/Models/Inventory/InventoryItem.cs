using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MOWScheduler.Models.Inventory
{    /// <summary>
    /// Represents an inventory item in the system.
    /// </summary>
    public class InventoryItem
    {
        /// <summary>
        /// Gets or sets the unique identifier for the inventory item.
        /// </summary>
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        /// <summary>
        /// Gets or sets the category ID of the item.
        /// </summary>
        public Guid CategoryId { get; set; }

        /// <summary>
        /// Gets or sets the name of the item.
        /// </summary>
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the description of the item.
        /// </summary>
        public string? Description { get; set; }

        /// <summary>
        /// Gets or sets the SKU (Stock Keeping Unit) of the item.
        /// </summary>
        [StringLength(50)]
        public string? SKU { get; set; }

        /// <summary>
        /// Gets or sets the barcode of the item.
        /// </summary>
        [StringLength(50)]
        public string? Barcode { get; set; }

        /// <summary>
        /// Gets or sets the units of measure for the item (e.g., kg, lb, each).
        /// </summary>
        [StringLength(20)]
        public string UnitOfMeasure { get; set; } = "each";

        /// <summary>
        /// Gets or sets the current quantity of the item in inventory.
        /// </summary>
        public decimal CurrentQuantity { get; set; } = 0;

        /// <summary>
        /// Gets or sets the minimum quantity threshold for reordering.
        /// </summary>
        public decimal ReorderThreshold { get; set; } = 0;

        /// <summary>
        /// Gets or sets the standard reorder quantity.
        /// </summary>
        public decimal ReorderQuantity { get; set; } = 0;

        /// <summary>
        /// Gets or sets the cost per unit.
        /// </summary>
        public decimal UnitCost { get; set; } = 0;

        /// <summary>
        /// Gets or sets whether the item is perishable.
        /// </summary>
        public bool IsPerishable { get; set; } = false;

        /// <summary>
        /// Gets or sets the shelf life in days (for perishable items).
        /// </summary>
        public int? ShelfLifeDays { get; set; }

        /// <summary>
        /// Gets or sets whether the item is active.
        /// </summary>
        public bool IsActive { get; set; } = true;

        /// <summary>
        /// Gets or sets when the item was created.
        /// </summary>
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        /// <summary>
        /// Gets or sets when the item was last updated.
        /// </summary>
        public DateTime UpdatedAt { get; set; } = DateTime.Now;        /// <summary>
        /// Navigation property for the category.
        /// </summary>
        [ForeignKey("CategoryId")]
        public virtual Category? Category { get; set; }

        /// <summary>
        /// Navigation property for inventory transactions.
        /// </summary>
        public virtual ICollection<InventoryTransaction> Transactions { get; set; } = new List<InventoryTransaction>();

        /// <summary>
        /// Navigation property for meal ingredients that use this item.
        /// </summary>
        public virtual ICollection<MealIngredient> MealIngredients { get; set; } = new List<MealIngredient>();
    }
}
