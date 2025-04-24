using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MOWScheduler.Data;
using MOWScheduler.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MOWScheduler.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class SchedulesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SchedulesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Schedules
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Schedule>>> GetSchedules()
        {
            return await _context.Schedules
                .Include(s => s.Volunteer)
                .Include(s => s.Route)
                .ToListAsync();
        }

        // GET: api/Schedules/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Schedule>> GetSchedule(int id)
        {
            var schedule = await _context.Schedules
                .Include(s => s.Volunteer)
                .Include(s => s.Route)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (schedule == null)
            {
                return NotFound();
            }

            return schedule;
        }

        // GET: api/Schedules/bydate/2023-04-24
        [HttpGet("bydate/{date}")]
        public async Task<ActionResult<IEnumerable<Schedule>>> GetSchedulesByDate(string date)
        {
            DateTime parsedDate;
            if (!DateTime.TryParse(date, out parsedDate))
            {
                return BadRequest("Invalid date format");
            }

            return await _context.Schedules
                .Include(s => s.Volunteer)
                .Include(s => s.Route)
                .Where(s => s.ScheduledDate.Date == parsedDate.Date)
                .ToListAsync();
        }

        // GET: api/Schedules/volunteer/5
        [HttpGet("volunteer/{id}")]
        public async Task<ActionResult<IEnumerable<Schedule>>> GetSchedulesByVolunteer(int id)
        {
            return await _context.Schedules
                .Include(s => s.Route)
                .Where(s => s.VolunteerId == id)
                .ToListAsync();
        }

        // POST: api/Schedules
        [HttpPost]
        [Authorize(Roles = "Admin,Coordinator")]
        public async Task<ActionResult<Schedule>> CreateSchedule(Schedule schedule)
        {
            // Check if the volunteer is already scheduled for this date and shift
            var existingSchedule = await _context.Schedules
                .FirstOrDefaultAsync(s => 
                    s.VolunteerId == schedule.VolunteerId && 
                    s.ScheduledDate.Date == schedule.ScheduledDate.Date && 
                    s.ShiftType == schedule.ShiftType);

            if (existingSchedule != null)
            {
                return BadRequest("Volunteer is already scheduled for this date and shift");
            }

            schedule.CreatedAt = DateTime.Now;
            _context.Schedules.Add(schedule);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetSchedule), new { id = schedule.Id }, schedule);
        }

        // PUT: api/Schedules/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Coordinator")]
        public async Task<IActionResult> UpdateSchedule(int id, Schedule schedule)
        {
            if (id != schedule.Id)
            {
                return BadRequest();
            }

            schedule.UpdatedAt = DateTime.Now;
            _context.Entry(schedule).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ScheduleExists(id))
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

        // DELETE: api/Schedules/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin,Coordinator")]
        public async Task<IActionResult> DeleteSchedule(int id)
        {
            var schedule = await _context.Schedules.FindAsync(id);
            if (schedule == null)
            {
                return NotFound();
            }

            _context.Schedules.Remove(schedule);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // PUT: api/Schedules/5/status
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] StatusUpdateDto statusUpdate)
        {
            var schedule = await _context.Schedules.FindAsync(id);
            if (schedule == null)
            {
                return NotFound();
            }

            schedule.Status = statusUpdate.Status;
            schedule.UpdatedAt = DateTime.Now;
            
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // GET: api/Schedules/count
        [HttpGet("count")]
        public async Task<ActionResult<object>> GetSchedulesCount()
        {
            var count = await _context.Schedules.CountAsync();
            return Ok(new { count });
        }

        // GET: api/Schedules/upcoming
        [HttpGet("upcoming")]
        public async Task<ActionResult<object>> GetUpcomingSchedules([FromQuery] string date)
        {
            var parsedDate = DateTime.Parse(date);
            
            var count = await _context.Schedules
                .CountAsync(s => s.ScheduledDate >= parsedDate && s.Status != "Completed" && s.Status != "Cancelled");
                
            return Ok(new { count });
        }

        // GET: api/Schedules/completed
        [HttpGet("completed")]
        public async Task<ActionResult<object>> GetCompletedSchedules([FromQuery] string date)
        {
            var parsedDate = DateTime.Parse(date);
            
            var count = await _context.Schedules
                .CountAsync(s => s.ScheduledDate <= parsedDate && s.Status == "Completed");
                
            return Ok(new { count });
        }
        
        // GET: api/Schedules/volunteer/{id}/count
        [HttpGet("volunteer/{id}/count")]
        public async Task<ActionResult<object>> GetVolunteerScheduleCount(int id)
        {
            var count = await _context.Schedules
                .CountAsync(s => s.VolunteerId == id);
                
            return Ok(new { count });
        }
        
        // GET: api/Schedules/volunteer/{id}/upcoming
        [HttpGet("volunteer/{id}/upcoming")]
        public async Task<ActionResult<object>> GetVolunteerUpcomingSchedules(int id, [FromQuery] string date)
        {
            var parsedDate = DateTime.Parse(date);
            
            var count = await _context.Schedules
                .CountAsync(s => s.VolunteerId == id && 
                             s.ScheduledDate >= parsedDate && 
                             s.Status != "Completed" && 
                             s.Status != "Cancelled");
                
            return Ok(new { count });
        }
        
        // GET: api/Schedules/volunteer/{id}/completed
        [HttpGet("volunteer/{id}/completed")]
        public async Task<ActionResult<object>> GetVolunteerCompletedSchedules(int id)
        {
            var count = await _context.Schedules
                .CountAsync(s => s.VolunteerId == id && s.Status == "Completed");
                
            return Ok(new { count });
        }
        
        // GET: api/Schedules/volunteer/{id}/next
        [HttpGet("volunteer/{id}/next")]
        public async Task<ActionResult<Schedule>> GetVolunteerNextSchedule(int id)
        {
            var today = DateTime.Now.Date;
            
            var nextSchedule = await _context.Schedules
                .Where(s => s.VolunteerId == id && 
                       s.ScheduledDate >= today && 
                       s.Status != "Cancelled")
                .OrderBy(s => s.ScheduledDate)
                .FirstOrDefaultAsync();
                
            if (nextSchedule == null)
            {
                return NotFound(new { message = "No upcoming scheduled deliveries" });
            }
            
            return nextSchedule;
        }

        private bool ScheduleExists(int id)
        {
            return _context.Schedules.Any(e => e.Id == id);
        }
    }

    public class StatusUpdateDto
    {
        public string Status { get; set; } = string.Empty;
    }
}