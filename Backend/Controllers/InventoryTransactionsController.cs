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
    /// Controller for managing inventory transactions.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    [RequireOperationalRole("InventoryManager,KitchenManager,KitchenVolunteer")]
    public class InventoryTransactionsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        /// <summary>
        /// Initializes a new instance of the <see cref="InventoryTransactionsController"/> class.
        /// </summary>
        /// <param name="context">The database context.</param>
        public InventoryTransactionsController(ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Gets all inventory transactions, optionally filtered by date range.
        /// </summary>
        /// <param name="startDate">Optional start date filter.</param>
        /// <param name="endDate">Optional end date filter.</param>
        /// <returns>A collection of inventory transactions.</returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<InventoryTransaction>>> GetInventoryTransactions(
            [FromQuery] DateTime? startDate = null, 
            [FromQuery] DateTime? endDate = null)
        {
            IQueryable<InventoryTransaction> query = _context.InventoryTransactions
                .Include(t => t.Item);

            if (startDate.HasValue)
            {
                query = query.Where(t => t.TransactionDate >= startDate.Value);
            }

            if (endDate.HasValue)
            {
                query = query.Where(t => t.TransactionDate <= endDate.Value);
            }

            return await query.OrderByDescending(t => t.TransactionDate).ToListAsync();
        }

        /// <summary>
        /// Gets all transactions for a specific inventory item.
        /// </summary>
        /// <param name="itemId">The ID of the inventory item.</param>
        /// <returns>A collection of transactions for the specified item.</returns>
        [HttpGet("item/{itemId}")]
        public async Task<ActionResult<IEnumerable<InventoryTransaction>>> GetTransactionsByItem(Guid itemId)
        {
            var item = await _context.InventoryItems.FindAsync(itemId);
            if (item == null)
            {
                return NotFound("Inventory item not found");
            }

            return await _context.InventoryTransactions
                .Where(t => t.ItemId == itemId)
                .OrderByDescending(t => t.TransactionDate)
                .ToListAsync();
        }

        /// <summary>
        /// Gets a specific inventory transaction by ID.
        /// </summary>
        /// <param name="id">The ID of the transaction to retrieve.</param>
        /// <returns>The requested inventory transaction.</returns>
        [HttpGet("{id}")]
        public async Task<ActionResult<InventoryTransaction>> GetInventoryTransaction(Guid id)
        {
            var inventoryTransaction = await _context.InventoryTransactions
                .Include(t => t.Item)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (inventoryTransaction == null)
            {
                return NotFound();
            }

            return inventoryTransaction;
        }

        /// <summary>
        /// Gets transactions by type.
        /// </summary>
        /// <param name="transactionType">The type of transaction (Receipt, Consumption, Adjustment, etc).</param>
        /// <returns>A collection of transactions of the specified type.</returns>
        [HttpGet("type/{transactionType}")]
        public async Task<ActionResult<IEnumerable<InventoryTransaction>>> GetTransactionsByType(string transactionType)
        {
            return await _context.InventoryTransactions
                .Include(t => t.Item)
                .Where(t => t.TransactionType.ToLower() == transactionType.ToLower())
                .OrderByDescending(t => t.TransactionDate)
                .ToListAsync();
        }

        /// <summary>
        /// Creates a new inventory transaction.
        /// </summary>
        /// <param name="transaction">The transaction to create.</param>
        /// <returns>The created transaction.</returns>
        [HttpPost]
        public async Task<ActionResult<InventoryTransaction>> CreateInventoryTransaction(InventoryTransaction transaction)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Set creation time
            transaction.CreatedAt = DateTime.Now;

            // Get the inventory item
            var item = await _context.InventoryItems.FindAsync(transaction.ItemId);
            if (item == null)
            {
                return BadRequest("Invalid inventory item ID");
            }

            // Update the inventory item quantity
            item.CurrentQuantity += transaction.Quantity;
            item.UpdatedAt = DateTime.Now;

            // Ensure quantity isn't negative
            if (item.CurrentQuantity < 0)
            {
                return BadRequest("Transaction would result in negative inventory");
            }

            // Add the transaction
            _context.InventoryTransactions.Add(transaction);
            
            // Save changes
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetInventoryTransaction), new { id = transaction.Id }, transaction);
        }        /// <summary>
        /// Gets transaction statistics.
        /// </summary>
        /// <param name="days">Number of days to include in statistics (default 30).</param>
        /// <returns>Transaction statistics grouped by type.</returns>
        [HttpGet("statistics")]
        [RequireOperationalRole("InventoryManager,KitchenManager")] // More restricted access
        public async Task<ActionResult<object>> GetTransactionStatistics(int days = 30)
        {
            var startDate = DateTime.Now.AddDays(-days);
            
            var transactions = await _context.InventoryTransactions
                .Include(t => t.Item)
                .Where(t => t.TransactionDate >= startDate)
                .ToListAsync();
            
            var statistics = transactions
                .GroupBy(t => t.TransactionType)
                .Select(g => new
                {
                    TransactionType = g.Key,
                    Count = g.Count(),
                    TotalQuantity = Math.Abs(g.Sum(t => t.Quantity)),
                    AverageQuantity = Math.Abs(g.Average(t => t.Quantity))
                })
                .ToList();
                
            // Get top users by transaction count (only available to managers)
            var topUsers = transactions
                .Where(t => t.UserId != Guid.Empty)
                .GroupBy(t => t.UserId)
                .Select(g => new 
                {
                    UserId = g.Key,
                    TransactionCount = g.Count(),
                    TotalQuantity = g.Sum(t => Math.Abs(t.Quantity))
                })
                .OrderByDescending(u => u.TransactionCount)
                .Take(5)
                .ToList();
                
            return Ok(new
            {
                TotalTransactions = transactions.Count,
                StartDate = startDate,
                EndDate = DateTime.Now,
                Statistics = statistics,
                TopUsers = topUsers,
                CategoryBreakdown = transactions
                    .Where(t => t.Item != null)
                    .GroupBy(t => t.Item.CategoryId)
                    .Select(g => new
                    {
                        CategoryId = g.Key,
                        TransactionCount = g.Count(),
                        TotalQuantity = g.Sum(t => Math.Abs(t.Quantity))
                    })
                    .OrderByDescending(c => c.TransactionCount)
                    .Take(10)
                    .ToList()
            });
        }
    }
}
