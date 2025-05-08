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
    public class DeliveryRoutesControllerTests
    {
        private ApplicationDbContext GetDbContext()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            return new ApplicationDbContext(options);
        }

        [Fact]
        public async Task GetRoutes_ReturnsActiveRoutes()
        {
            // Arrange
            var context = GetDbContext();
            var controller = new DeliveryRoutesController(context);
            context.DeliveryRoutes.Add(new DeliveryRoute { Name = "Route 1", IsActive = true });
            context.DeliveryRoutes.Add(new DeliveryRoute { Name = "Route 2", IsActive = false });
            await context.SaveChangesAsync();

            // Act
            var result = await controller.GetRoutes();

            // Assert
            var actionResult = Assert.IsType<ActionResult<IEnumerable<DeliveryRoute>>>(result);
            var routes = Assert.IsAssignableFrom<IEnumerable<DeliveryRoute>>(actionResult.Value);
            Assert.Single(routes);
        }

        [Fact]
        public async Task GetRoute_ValidId_ReturnsRoute()
        {
            // Arrange
            var context = GetDbContext();
            var controller = new DeliveryRoutesController(context);
            var route = new DeliveryRoute { Name = "Route 1", IsActive = true };
            context.DeliveryRoutes.Add(route);
            await context.SaveChangesAsync();

            // Act
            var result = await controller.GetRoute(route.Id);

            // Assert
            var actionResult = Assert.IsType<ActionResult<DeliveryRoute>>(result);
            Assert.Equal(route.Id, actionResult.Value.Id);
        }
    }
}