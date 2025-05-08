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
    public class SchedulesControllerTests
    {
        private ApplicationDbContext GetDbContext()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            var context = new ApplicationDbContext(options);
            return context;
        }

        [Fact]
        public async Task GetSchedulesByDate_ValidDate_ReturnsSchedules()
        {
            // Arrange
            var context = GetDbContext();
            var controller = new SchedulesController(context);
            var testDate = new DateTime(2025, 4, 24);

            var schedule = new Schedule
            {
                ScheduledDate = testDate,
                VolunteerId = 1,
                RouteId = 1,
                Volunteer = new Volunteer { Id = 1, UserId = 1 },
                Route = new DeliveryRoute { Id = 1, Name = "Test Route" }
            };

            context.Schedules.Add(schedule);
            await context.SaveChangesAsync();

            // Act
            var result = await controller.GetSchedulesByDate("2025-04-24");

            // Assert
            var actionResult = Assert.IsType<ActionResult<IEnumerable<Schedule>>>(result);
            var schedules = Assert.IsAssignableFrom<IEnumerable<Schedule>>(actionResult.Value);
            Assert.Single(schedules);
            Assert.Equal(testDate.Date, schedules.First().ScheduledDate.Date);
        }

        [Fact]
        public async Task GetSchedulesByDate_InvalidDateFormat_ReturnsBadRequest()
        {
            // Arrange
            var context = GetDbContext();
            var controller = new SchedulesController(context);

            // Act
            var result = await controller.GetSchedulesByDate("invalid-date");

            // Assert
            Assert.IsType<BadRequestObjectResult>(result.Result);
        }

        [Fact]
        public async Task GetSchedulesByDate_NoSchedules_ReturnsEmptyList()
        {
            // Arrange
            var context = GetDbContext();
            var controller = new SchedulesController(context);

            // Act
            var result = await controller.GetSchedulesByDate("2025-04-24");

            // Assert
            var actionResult = Assert.IsType<ActionResult<IEnumerable<Schedule>>>(result);
            var schedules = Assert.IsAssignableFrom<IEnumerable<Schedule>>(actionResult.Value);
            Assert.Empty(schedules);
        }

        [Fact]
        public async Task GetSchedulesByDate_IncludesRelatedData()
        {
            // Arrange
            var context = GetDbContext();
            var controller = new SchedulesController(context);
            var testDate = new DateTime(2025, 4, 24);

            var volunteer = new Volunteer { Id = 1, UserId = 1 };
            var route = new DeliveryRoute { Id = 1, Name = "Test Route" };

            var schedule = new Schedule
            {
                ScheduledDate = testDate,
                VolunteerId = 1,
                RouteId = 1,
                Volunteer = volunteer,
                Route = route
            };

            context.Schedules.Add(schedule);
            await context.SaveChangesAsync();

            // Act
            var result = await controller.GetSchedulesByDate("2025-04-24");

            // Assert
            var actionResult = Assert.IsType<ActionResult<IEnumerable<Schedule>>>(result);
            var schedules = Assert.IsAssignableFrom<IEnumerable<Schedule>>(actionResult.Value);
            var returnedSchedule = schedules.First();

            Assert.NotNull(returnedSchedule.Volunteer);
            Assert.NotNull(returnedSchedule.Route);
            Assert.Equal("Test Route", returnedSchedule.Route.Name);
        }
    }
}