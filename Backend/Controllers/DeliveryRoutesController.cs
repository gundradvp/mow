using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MOWScheduler.Data;
using MOWScheduler.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MOWScheduler.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class DeliveryRoutesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DeliveryRoutesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/DeliveryRoutes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DeliveryRoute>>> GetRoutes()
        {
            return await _context.DeliveryRoutes
                .Where(r => r.IsActive)
                .ToListAsync();
        }

        // GET: api/DeliveryRoutes/details
        [HttpGet("details")]
        public async Task<ActionResult<IEnumerable<object>>> GetRoutesWithDetails()
        {
            var routes = await _context.DeliveryRoutes
                .Select(r => new 
                {
                    r.Id,
                    r.Name,
                    r.Description,
                    r.EstimatedDuration, // Fixed: Changed from EstimatedDurationMinutes to EstimatedDuration
                    r.IsActive,
                    ClientCount = r.Clients.Count(c => c.IsActive)
                })
                .ToListAsync();

            return Ok(routes);
        }

        // GET: api/DeliveryRoutes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<DeliveryRoute>> GetRoute(int id)
        {
            var route = await _context.DeliveryRoutes
                .Include(r => r.Clients)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (route == null)
            {
                return NotFound();
            }

            return route;
        }

        // GET: api/DeliveryRoutes/5/clientcount
        [HttpGet("{id}/clientcount")]
        public async Task<ActionResult<object>> GetRouteClientCount(int id)
        {
            var count = await _context.Clients
                .CountAsync(c => c.RouteId == id && c.IsActive); // Fixed: Changed from DeliveryRouteId to RouteId
            
            return Ok(new { count });
        }

        // GET: api/DeliveryRoutes/count
        [HttpGet("count")]
        public async Task<ActionResult<object>> GetRoutesCount()
        {
            var count = await _context.DeliveryRoutes.CountAsync(r => r.IsActive);
            return Ok(new { count });
        }

        // POST: api/DeliveryRoutes
        [HttpPost]
        [Authorize(Roles = "Admin,Coordinator")]
        public async Task<ActionResult<DeliveryRoute>> CreateRoute(DeliveryRoute route)
        {
            _context.DeliveryRoutes.Add(route);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetRoute), new { id = route.Id }, route);
        }

        // PUT: api/DeliveryRoutes/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Coordinator")]
        public async Task<IActionResult> UpdateRoute(int id, DeliveryRoute route)
        {
            if (id != route.Id)
            {
                return BadRequest();
            }

            _context.Entry(route).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RouteExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/DeliveryRoutes/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteRoute(int id)
        {
            var route = await _context.DeliveryRoutes.FindAsync(id);
            if (route == null)
            {
                return NotFound();
            }

            // Instead of deleting, mark as inactive
            route.IsActive = false;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool RouteExists(int id)
        {
            return _context.DeliveryRoutes.Any(e => e.Id == id);
        }
    }
}