using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MOWScheduler.Controllers;
using MOWScheduler.Data;
using MOWScheduler.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace MOWScheduler.Tests.Controllers
{
    public class VolunteersControllerTests
    {
        private ApplicationDbContext GetDbContext()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            return new ApplicationDbContext(options);
        }

        [Fact]
        public async Task GetVolunteers_ReturnsAllVolunteers()
        {
            // Arrange
            var context = GetDbContext();
            var controller = new VolunteersController(context);
            context.Volunteers.Add(new Volunteer { UserId = 1, IsActive = true });
            context.Volunteers.Add(new Volunteer { UserId = 2, IsActive = false });
            await context.SaveChangesAsync();

            // Act
            var result = await controller.GetVolunteers();

            // Assert
            var actionResult = Assert.IsType<ActionResult<IEnumerable<Volunteer>>>(result);
            var volunteers = Assert.IsAssignableFrom<IEnumerable<Volunteer>>(actionResult.Value);
            Assert.Equal(2, volunteers.Count());
        }

        [Fact]
        public async Task GetVolunteer_ValidId_ReturnsVolunteer()
        {
            // Arrange
            var context = GetDbContext();
            var controller = new VolunteersController(context);
            var volunteer = new Volunteer { UserId = 1, IsActive = true };
            context.Volunteers.Add(volunteer);
            await context.SaveChangesAsync();

            // Act
            var result = await controller.GetVolunteer(volunteer.Id);

            // Assert
            var actionResult = Assert.IsType<ActionResult<Volunteer>>(result);
            Assert.Equal(volunteer.Id, actionResult.Value.Id);
        }

        [Fact]
        public async Task AssignShiftToVolunteer_ValidIds_AssignsShift()
        {
            // Arrange
            var context = GetDbContext();
            var controller = new VolunteersController(context);

            var volunteer = new Volunteer { UserId = 1, IsActive = true };
            var shift = new Shift { Name = "Morning", StartTime = DateTime.Now, EndTime = DateTime.Now.AddHours(4) };

            context.Volunteers.Add(volunteer);
            context.Shifts.Add(shift);
            await context.SaveChangesAsync();

            // Act
            var result = await controller.AssignShiftToVolunteer(volunteer.Id, shift.Id);

            // Assert
            Assert.IsType<NoContentResult>(result);
            var updatedVolunteer = await context.Volunteers.Include(v => v.AssignedShifts).FirstOrDefaultAsync(v => v.Id == volunteer.Id);
            Assert.Contains(shift, updatedVolunteer.AssignedShifts);
        }

        [Fact]
        public async Task UpdateVolunteerAvailability_ValidId_UpdatesAvailability()
        {
            // Arrange
            var context = GetDbContext();
            var controller = new VolunteersController(context);

            var volunteer = new Volunteer { UserId = 1, IsActive = true, Availability = "Weekdays" };
            context.Volunteers.Add(volunteer);
            await context.SaveChangesAsync();

            var newAvailability = "Weekends";

            // Act
            var result = await controller.UpdateVolunteerAvailability(volunteer.Id, newAvailability);

            // Assert
            Assert.IsType<NoContentResult>(result);
            var updatedVolunteer = await context.Volunteers.FindAsync(volunteer.Id);
            Assert.Equal(newAvailability, updatedVolunteer.Availability);
        }
    }
}