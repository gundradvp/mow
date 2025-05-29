using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MOWScheduler.Models.Inventory
{
    /// <summary>
    /// Represents a transaction affecting inventory quantities.
    /// </summary>
    public class InventoryTransaction
    {
        /// <summary>
        /// Gets or sets the unique identifier for the inventory transaction.
        /// </summary>
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();        /// <summary>
        /// Gets or sets the inventory item ID related to this transaction.
        /// </summary>
        public Guid ItemId { get; set; }

        /// <summary>
        /// Gets or sets the type of transaction (e.g., receipt, consumption, adjustment).
        /// </summary>
        [Required]
        [StringLength(20)]
        public string TransactionType { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the quantity affected by this transaction.
        /// Positive for additions, negative for removals.
        /// </summary>
        public decimal Quantity { get; set; }

        /// <summary>
        /// Gets or sets when the transaction occurred.
        /// </summary>
        public DateTime TransactionDate { get; set; } = DateTime.Now;

        /// <summary>
        /// Gets or sets the purchase order ID if this transaction is related to a purchase.
        /// </summary>
        public Guid? PurchaseOrderId { get; set; }

        /// <summary>
        /// Gets or sets the meal preparation ID if this transaction is related to meal prep.
        /// </summary>
        public Guid? MealPreparationId { get; set; }

        /// <summary>
        /// Gets or sets the user ID who performed this transaction.
        /// </summary>
        public Guid UserId { get; set; }

        /// <summary>
        /// Gets or sets notes about this transaction.
        /// </summary>
        public string? Notes { get; set; }

        /// <summary>
        /// Gets or sets when the transaction was created in the system.
        /// </summary>
        public DateTime CreatedAt { get; set; } = DateTime.Now;        /// <summary>
        /// Navigation property for the inventory item.
        /// </summary>
        [ForeignKey("ItemId")]
        public virtual InventoryItem? Item { get; set; }

        // Navigation property for User would be added here
    }
}
