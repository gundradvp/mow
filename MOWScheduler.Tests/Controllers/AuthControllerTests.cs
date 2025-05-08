using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MOWScheduler.Controllers;
using MOWScheduler.Data;
using MOWScheduler.Models;
using System;
using System.Threading.Tasks;
using Xunit;

namespace MOWScheduler.Tests.Controllers
{
    /// <summary>
    /// Unit tests for the AuthController.
    /// </summary>
    public class AuthControllerTests
    {
        /// <summary>
        /// Creates an in-memory database context for testing purposes.
        /// </summary>
        /// <returns>A new instance of ApplicationDbContext.</returns>
        private ApplicationDbContext GetDbContext()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            return new ApplicationDbContext(options);
        }

        /// <summary>
        /// Tests the Register method with a valid user.
        /// </summary>
        [Fact]
        public async Task Register_ValidUser_ReturnsSuccessMessage()
        {
            // Arrange
            var context = GetDbContext();
            var controller = new AuthController(context, null);
            var registerDto = new RegisterDto
            {
                Username = "testuser",
                Email = "testuser@example.com",
                Password = "Test123!",
                FirstName = "Test",
                LastName = "User"
            };

            // Act
            var result = await controller.Register(registerDto);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal("Registration successful", ((dynamic)okResult.Value).message);
        }

        /// <summary>
        /// Tests the Login method with valid credentials.
        /// </summary>
        [Fact]
        public async Task Login_ValidCredentials_ReturnsToken()
        {
            // Arrange
            var context = GetDbContext();
            var controller = new AuthController(context, null);
            var user = new User
            {
                Username = "testuser",
                Email = "testuser@example.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Test123!"),
                Role = "Volunteer"
            };
            context.Users.Add(user);
            await context.SaveChangesAsync();

            var loginDto = new LoginDto
            {
                Username = "testuser",
                Password = "Test123!"
            };

            // Act
            var result = await controller.Login(loginDto);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.NotNull(((dynamic)okResult.Value).token);
        }
    }
}