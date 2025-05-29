using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MOWScheduler.Models.Inventory
{
    /// <summary>
    /// Represents a category for inventory items.
    /// </summary>
    public class Category
    {
        /// <summary>
        /// Gets or sets the unique identifier for the category.
        /// </summary>
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        /// <summary>
        /// Gets or sets the name of the category.
        /// </summary>
        [Required]
        [StringLength(50)]
        public string Name { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the description of the category.
        /// </summary>
        public string? Description { get; set; }

        /// <summary>
        /// Gets or sets the parent category ID, if this is a subcategory.
        /// </summary>
        public Guid? ParentCategoryId { get; set; }

        /// <summary>
        /// Gets or sets whether the category is active.
        /// </summary>
        public bool IsActive { get; set; } = true;

        /// <summary>
        /// Gets or sets when the category was created.
        /// </summary>
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        /// <summary>
        /// Gets or sets when the category was last updated.
        /// </summary>
        public DateTime UpdatedAt { get; set; } = DateTime.Now;

        /// <summary>
        /// Navigation property for the parent category.
        /// </summary>
        [ForeignKey("ParentCategoryId")]
        public virtual Category? ParentCategory { get; set; }

        /// <summary>
        /// Navigation property for child categories.
        /// </summary>
        public virtual List<Category> ChildCategories { get; set; } = new List<Category>();

        /// <summary>
        /// Navigation property for inventory items in this category.
        /// </summary>
        public virtual List<InventoryItem> Items { get; set; } = new List<InventoryItem>();
    }
}
