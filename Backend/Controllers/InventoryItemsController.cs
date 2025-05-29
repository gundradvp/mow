using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using MOWScheduler.Data;
using MOWScheduler.Helpers;
using MOWScheduler.Models.Inventory;

namespace MOWScheduler.Controllers
{
    /// <summary>
    /// Controller for managing inventory items.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    [RequireOperationalRole("InventoryManager,KitchenManager")]
    public class InventoryItemsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        /// <summary>
        /// Initializes a new instance of the <see cref="InventoryItemsController"/> class.
        /// </summary>
        /// <param name="context">The database context.</param>
        public InventoryItemsController(ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Gets all inventory items.
        /// </summary>
        /// <returns>A collection of inventory items.</returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<InventoryItem>>> GetInventoryItems()
        {
            return await _context.InventoryItems.Include(i => i.Category).ToListAsync();
        }

        /// <summary>
        /// Gets a specific inventory item by ID.
        /// </summary>
        /// <param name="id">The ID of the inventory item to retrieve.</param>
        /// <returns>The requested inventory item.</returns>
        [HttpGet("{id}")]
        public async Task<ActionResult<InventoryItem>> GetInventoryItem(Guid id)
        {
            var inventoryItem = await _context.InventoryItems
                .Include(i => i.Category)
                .FirstOrDefaultAsync(i => i.Id == id);

            if (inventoryItem == null)
            {
                return NotFound();
            }

            return inventoryItem;
        }

        /// <summary>
        /// Updates a specific inventory item.
        /// </summary>
        /// <param name="id">The ID of the inventory item to update.</param>
        /// <param name="inventoryItem">The updated inventory item data.</param>
        /// <returns>No content if successful.</returns>
        [HttpPut("{id}")]
        public async Task<IActionResult> PutInventoryItem(Guid id, InventoryItem inventoryItem)
        {
            if (id != inventoryItem.Id)
            {
                return BadRequest();
            }

            _context.Entry(inventoryItem).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!InventoryItemExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }        /// <summary>
        /// Creates a new inventory item.
        /// </summary>
        /// <param name="inventoryItem">The inventory item to create.</param>
        /// <returns>The created inventory item.</returns>
        [HttpPost]
        [RequireOperationalRole("InventoryManager")] // Restrict creation to InventoryManager only
        public async Task<ActionResult<InventoryItem>> PostInventoryItem(InventoryItem inventoryItem)
        {
            _context.InventoryItems.Add(inventoryItem);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetInventoryItem", new { id = inventoryItem.Id }, inventoryItem);
        }        /// <summary>
        /// Deletes a specific inventory item.
        /// </summary>
        /// <param name="id">The ID of the inventory item to delete.</param>
        /// <returns>No content if successful.</returns>
        [HttpDelete("{id}")]
        [RequireOperationalRole("InventoryManager")] // Restrict deletion to InventoryManager only
        public async Task<IActionResult> DeleteInventoryItem(Guid id)
        {
            var inventoryItem = await _context.InventoryItems.FindAsync(id);
            if (inventoryItem == null)
            {
                return NotFound();
            }

            _context.InventoryItems.Remove(inventoryItem);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        /// <summary>
        /// Gets items that are below their reorder threshold.
        /// </summary>
        /// <returns>A list of items that need to be reordered.</returns>
        [HttpGet("reorder-needed")]
        public async Task<ActionResult<IEnumerable<InventoryItem>>> GetReorderNeededItems()
        {
            return await _context.InventoryItems
                .Include(i => i.Category)
                .Where(i => i.IsActive && i.CurrentQuantity <= i.ReorderThreshold)
                .ToListAsync();
        }

        /// <summary>
        /// Updates the quantity of an inventory item.
        /// </summary>
        /// <param name="id">The ID of the inventory item.</param>
        /// <param name="quantity">The quantity to add (positive) or remove (negative).</param>
        /// <returns>The updated inventory item.</returns>
        [HttpPut("{id}/adjust-quantity")]
        public async Task<ActionResult<InventoryItem>> AdjustQuantity(Guid id, [FromBody] decimal quantity)
        {
            var inventoryItem = await _context.InventoryItems.FindAsync(id);
            if (inventoryItem == null)
            {
                return NotFound();
            }

            inventoryItem.CurrentQuantity += quantity;
            
            // Ensure we don't go negative
            if (inventoryItem.CurrentQuantity < 0)
            {
                return BadRequest("Cannot reduce quantity below zero");
            }

            inventoryItem.UpdatedAt = DateTime.Now;
              // Get authenticated user ID from claims
            var userIdClaim = User.FindFirst("id");
            Guid userId = userIdClaim != null && Guid.TryParse(userIdClaim.Value, out Guid parsedId)
                ? parsedId
                : Guid.Empty;

            // Create a transaction record
            var transaction = new InventoryTransaction
            {
                ItemId = id,
                TransactionType = quantity > 0 ? "Receipt" : "Consumption",
                Quantity = quantity,
                TransactionDate = DateTime.Now,
                UserId = userId,
                Notes = "Quantity adjustment via API"
            };
            
            _context.InventoryTransactions.Add(transaction);
            await _context.SaveChangesAsync();

            return inventoryItem;
        }

        private bool InventoryItemExists(Guid id)
        {
            return _context.InventoryItems.Any(e => e.Id == id);
        }
    }
}
