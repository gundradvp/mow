using MOWScheduler.Models;
using System;
using System.Linq;

namespace MOWScheduler.Data
{
    public static class DbSeeder
    {
        public static void Initialize(ApplicationDbContext context)
        {
            // Make sure the database is created
            context.Database.EnsureCreated();

            // Check if there's already data
            if (context.Users.Any())
            {
                return; // Database has been seeded already
            }

            // Add admin user
            var adminUser = new User
            {
                Username = "admin",
                Email = "admin@example.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!"),
                FirstName = "Admin",
                LastName = "User",
                PhoneNumber = "555-123-4567",
                Role = "Admin",
                CreatedAt = DateTime.Now
            };
            
            // Add volunteer user
            var volunteerUser = new User
            {
                Username = "volunteer",
                Email = "volunteer@example.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Volunteer123!"),
                FirstName = "Test",
                LastName = "Volunteer",
                PhoneNumber = "555-234-5678",
                Role = "Volunteer",
                CreatedAt = DateTime.Now
            };
            
            // Save users to the database first
            context.Users.AddRange(adminUser, volunteerUser);
            context.SaveChanges();
            
            // Add test clients
            var client1 = new Client
            {
                FirstName = "John",
                LastName = "Doe",
                Address = "123 Main St",
                PhoneNumber = "555-111-2222",
                EmergencyContact = "555-333-4444",
                DietaryRestrictions = "None",
                IsActive = true,
                Notes = "No stairs access"
            };
            
            var client2 = new Client
            {
                FirstName = "Jane",
                LastName = "Smith",
                Address = "456 Oak Ave",
                PhoneNumber = "555-555-6666",
                EmergencyContact = "555-777-8888",
                DietaryRestrictions = "Low sodium",
                IsActive = true,
                Notes = "Dog on property"
            };
            
            // Save clients to database
            context.Clients.AddRange(client1, client2);
            context.SaveChanges();
            
            // Add test routes
            var route1 = new DeliveryRoute
            {
                Name = "Downtown Route",
                Description = "Downtown area covering Main St and Oak Ave",
                EstimatedDuration = 60
            };
            
            var route2 = new DeliveryRoute
            {
                Name = "North Route",
                Description = "Northern neighborhoods including Pine St and Cedar Rd",
                EstimatedDuration = 75
            };

            // Save routes to database
            context.DeliveryRoutes.AddRange(route1, route2);
            context.SaveChanges();
            
            // Add volunteer record
            var volunteer = new Volunteer
            {
                UserId = volunteerUser.Id,
                AvailableDays = "Monday,Wednesday,Friday",
                IsActive = true,
                StartDate = DateTime.Now.AddDays(-30),
                Notes = "Has own vehicle"
            };
            
            // Save volunteer to database
            context.Volunteers.Add(volunteer);
            context.SaveChanges();
            
            // Now that we have the volunteer ID, create a schedule
            var schedule = new Schedule
            {
                VolunteerId = volunteer.Id,
                RouteId = route1.Id,
                ScheduledDate = DateTime.Now.Date.AddDays(1),
                Status = "Scheduled",
                Notes = "First delivery"
            };
            
            // Save schedule to database
            context.Schedules.Add(schedule);
            context.SaveChanges();
            
            // Add some notifications
            var notification = new Notification
            {
                UserId = volunteerUser.Id,
                Title = "Schedule Assignment",
                Message = "You have been assigned to the Downtown Route tomorrow.",
                Type = "InApp",
                Status = "Sent",
                CreatedAt = DateTime.Now,
                SentAt = DateTime.Now,
                ReferenceId = schedule.Id,
                ReferenceType = "Schedule"
            };
            
            context.Notifications.Add(notification);
            context.SaveChanges();
        }
    }
}