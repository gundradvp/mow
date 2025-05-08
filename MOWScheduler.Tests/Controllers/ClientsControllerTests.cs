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
    public class ClientsControllerTests
    {
        private ApplicationDbContext GetDbContext()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            return new ApplicationDbContext(options);
        }

        [Fact]
        public async Task GetClients_ReturnsActiveClients()
        {
            // Arrange
            var context = GetDbContext();
            var controller = new ClientsController(context);
            context.Clients.Add(new Client { FirstName = "John", LastName = "Doe", IsActive = true });
            context.Clients.Add(new Client { FirstName = "Jane", LastName = "Smith", IsActive = false });
            await context.SaveChangesAsync();

            // Act
            var result = await controller.GetClients();

            // Assert
            var actionResult = Assert.IsType<ActionResult<IEnumerable<Client>>>(result);
            var clients = Assert.IsAssignableFrom<IEnumerable<Client>>(actionResult.Value);
            Assert.Single(clients);
        }

        [Fact]
        public async Task GetClient_ValidId_ReturnsClient()
        {
            // Arrange
            var context = GetDbContext();
            var controller = new ClientsController(context);
            var client = new Client { FirstName = "John", LastName = "Doe", IsActive = true };
            context.Clients.Add(client);
            await context.SaveChangesAsync();

            // Act
            var result = await controller.GetClient(client.Id);

            // Assert
            var actionResult = Assert.IsType<ActionResult<Client>>(result);
            Assert.Equal(client.Id, actionResult.Value.Id);
        }
    }
}