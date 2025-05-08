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
    public class VolunteersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public VolunteersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Volunteers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Volunteer>>> GetVolunteers()
        {
            return await _context.Volunteers.ToListAsync();
        }

        // GET: api/Volunteers/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Volunteer>> GetVolunteer(int id)
        {
            var volunteer = await _context.Volunteers
                .Include(v => v.Schedules)
                .ThenInclude(s => s.Route)
                .FirstOrDefaultAsync(v => v.Id == id);

            if (volunteer == null)
            {
                return NotFound();
            }

            return Ok(volunteer);
        }

        // POST: api/Volunteers
        [HttpPost]
        public async Task<ActionResult<Volunteer>> CreateVolunteer(Volunteer volunteer)
        {
            // Check if the provided UserId exists in the Users table
            var userExists = await _context.Users.AnyAsync(u => u.Id == volunteer.UserId);
            if (!userExists)
            {
                // Return a BadRequest if the user does not exist
                ModelState.AddModelError(nameof(volunteer.UserId), $"User with ID {volunteer.UserId} does not exist.");
                return BadRequest(ModelState);
            }

            _context.Volunteers.Add(volunteer);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetVolunteer), new { id = volunteer.Id }, volunteer);
        }

        // PUT: api/Volunteers/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateVolunteer(int id, Volunteer volunteer)
        {
            if (id != volunteer.Id)
            {
                return BadRequest();
            }

            _context.Entry(volunteer).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!VolunteerExists(id))
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

        // DELETE: api/Volunteers/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteVolunteer(int id)
        {
            var volunteer = await _context.Volunteers.FindAsync(id);
            if (volunteer == null)
            {
                return NotFound();
            }

            // Instead of deleting, mark as inactive
            volunteer.IsActive = false;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // GET: api/Volunteers/available
        [HttpGet("available")]
        public async Task<ActionResult<IEnumerable<Volunteer>>> GetAvailableVolunteers([FromQuery] string date, [FromQuery] string shiftType)
        {
            var requestDate = DateTime.Parse(date);
            
            // Get all volunteers
            var allVolunteers = await _context.Volunteers
                .Where(v => v.IsActive)
                .ToListAsync();

            // Get volunteers who already have a schedule for this date and shift
            var scheduledVolunteerIds = await _context.Schedules
                .Where(s => s.ScheduledDate.Date == requestDate.Date && s.ShiftType == shiftType)
                .Select(s => s.VolunteerId)
                .ToListAsync();

            // Return only available volunteers
            var availableVolunteers = allVolunteers
                .Where(v => !scheduledVolunteerIds.Contains(v.Id))
                .ToList();

            return availableVolunteers;
        }

        // GET: api/Volunteers/count
        [HttpGet("count")]
        public async Task<ActionResult<object>> GetVolunteersCount()
        {
            var count = await _context.Volunteers.CountAsync(v => v.IsActive);
            return Ok(new { count });
        }
        
        // GET: api/Volunteers/user/{userId}
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<Volunteer>> GetVolunteerByUserId(int userId)
        {
            var volunteer = await _context.Volunteers.FirstOrDefaultAsync(v => v.UserId == userId);
            
            if (volunteer == null)
            {
                return NotFound();
            }
            
            return volunteer;
        }

        // POST: api/Volunteers/{id}/assign-shift
        [HttpPost("{id}/assign-shift")]
        public async Task<IActionResult> AssignShiftToVolunteer(int id, [FromBody] int shiftId)
        {
            var volunteer = await _context.Volunteers.Include(v => v.AssignedShifts).FirstOrDefaultAsync(v => v.Id == id);
            if (volunteer == null)
            {
                return NotFound();
            }

            var shift = await _context.Shifts.FindAsync(shiftId);
            if (shift == null)
            {
                return NotFound();
            }

            volunteer.AssignedShifts.Add(shift);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // PUT: api/Volunteers/{id}/update-availability
        [HttpPut("{id}/update-availability")]
        public async Task<IActionResult> UpdateVolunteerAvailability(int id, [FromBody] string availability)
        {
            var volunteer = await _context.Volunteers.FindAsync(id);
            if (volunteer == null)
            {
                return NotFound();
            }

            volunteer.Availability = availability;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool VolunteerExists(int id)
        {
            return _context.Volunteers.Any(e => e.Id == id);
        }
    }
}