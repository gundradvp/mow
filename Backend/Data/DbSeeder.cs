using MOWScheduler.Models;
using System;
using System.Linq;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace MOWScheduler.Data
{
    public static class DbSeeder
    {
        public static void Initialize(ApplicationDbContext context)
        {
            try
            {
                // Make sure the database is created
                context.Database.EnsureCreated();

                // Ensure admin user exists (even if other users exist)
                if (!context.Users.Any(u => u.Username == "admin" && u.Role == "Admin"))
                {
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
                    context.Users.Add(adminUser);
                    context.SaveChanges();
                    Console.WriteLine("Admin user created successfully.");
                }

                // Check if there's already data for other entities
                if (context.Users.Count() > 1)
                {
                    return; // Rest of database has been seeded already
                }

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

                // Save volunteer user to the database
                context.Users.Add(volunteerUser);
                context.SaveChanges();

                // Add Dietary Restrictions
                var drNone = new DietaryRestriction { RestrictionName = "None", Description = "No specific restrictions." };
                var drLowSodium = new DietaryRestriction { RestrictionName = "Low Sodium", Description = "Reduced sodium intake required." };
                var drVegetarian = new DietaryRestriction { RestrictionName = "Vegetarian", Description = "No meat products." };
                context.DietaryRestrictions.AddRange(drNone, drLowSodium, drVegetarian);
                context.SaveChanges();

                // Add Eligibility Criteria (Example)
                var ecAge = new EligibilityCriterion { CriteriaName = "Age 60+", Description = "Client is 60 years of age or older." };
                var ecDisability = new EligibilityCriterion { CriteriaName = "Disability", Description = "Client has a qualifying disability." };
                context.EligibilityCriteria.AddRange(ecAge, ecDisability);
                context.SaveChanges();

                // Add Meal Types (Example)
                var mtRegular = new MealType { Name = "Regular", Description = "Standard meal offering." };
                var mtVegetarian = new MealType { Name = "Vegetarian", Description = "Vegetarian meal offering." };
                context.MealTypes.AddRange(mtRegular, mtVegetarian);
                context.SaveChanges();

                // Add test clients
                var client1 = new Client
                {
                    FirstName = "John",
                    LastName = "Doe",
                    Address = "123 Main St",
                    City = "Woodland",
                    State = "CA",
                    ZipCode = "95695",
                    PhoneNumber = "555-111-2222",
                    EmergencyContact = "555-333-4444",
                    IsActive = true,
                    Notes = "No stairs access",
                    DateOfBirth = new DateTime(1950, 5, 15),
                    Gender = "Male"
                };

                var client2 = new Client
                {
                    FirstName = "Jane",
                    LastName = "Smith",
                    Address = "456 Oak Ave",
                    City = "Davis",
                    State = "CA",
                    ZipCode = "95616",
                    PhoneNumber = "555-555-6666",
                    EmergencyContact = "555-777-8888",
                    IsActive = true,
                    Notes = "Dog on property",
                    DateOfBirth = new DateTime(1945, 10, 20),
                    Gender = "Female"
                };

                // Save clients to database
                context.Clients.AddRange(client1, client2);
                context.SaveChanges();

                // Link Clients to Dietary Restrictions
                var cdr1 = new ClientDietaryRestriction { ClientId = client1.Id, DietaryRestrictionId = drNone.Id };
                var cdr2 = new ClientDietaryRestriction { ClientId = client2.Id, DietaryRestrictionId = drLowSodium.Id };
                context.ClientDietaryRestrictions.AddRange(cdr1, cdr2);

                // Link Clients to Eligibility Criteria (Example)
                var cec1 = new ClientEligibilityCriteria { ClientId = client1.Id, EligibilityCriterionId = ecAge.Id };
                var cec2 = new ClientEligibilityCriteria { ClientId = client2.Id, EligibilityCriterionId = ecAge.Id };
                var cec3 = new ClientEligibilityCriteria { ClientId = client2.Id, EligibilityCriterionId = ecDisability.Id };
                context.ClientEligibilityCriteria.AddRange(cec1, cec2, cec3);

                // Add Service Authorizations (Example)
                var sa1 = new ServiceAuthorization { ClientId = client1.Id, AuthorizationProvider = "AAA4", StartDate = DateTime.UtcNow.AddMonths(-1), EndDate = DateTime.UtcNow.AddMonths(11), AuthorizedServices = "Home Delivered Meals" };
                var sa2 = new ServiceAuthorization { ClientId = client2.Id, AuthorizationProvider = "Insurance X", StartDate = DateTime.UtcNow.AddDays(-10), EndDate = DateTime.UtcNow.AddMonths(5), AuthorizedServices = "Home Delivered Meals, MTM" };
                context.ServiceAuthorizations.AddRange(sa1, sa2);

                // Add Case Notes (Example)
                var cn1 = new CaseNote { ClientId = client1.Id, UserId = context.Users.First(u => u.Username == "admin").Id, Timestamp = DateTime.UtcNow.AddDays(-5), NoteContent = "Initial intake completed." };
                var cn2 = new CaseNote { ClientId = client2.Id, UserId = context.Users.First(u => u.Username == "admin").Id, Timestamp = DateTime.UtcNow.AddDays(-3), NoteContent = "Client confirmed low sodium need." };
                context.CaseNotes.AddRange(cn1, cn2);

                // Add Client Delivery Schedules (Example)
                var cds1 = new ClientDeliverySchedule
                {
                    ClientId = client1.Id,
                    RecurrencePattern = "Weekly",
                    StartDate = DateTime.UtcNow.Date,
                    IsActive = true,
                    ScheduleDetails = new List<ClientDeliveryScheduleDetail>
                    {
                        new ClientDeliveryScheduleDetail { DayOfWeek = DayOfWeek.Monday, MealTypeId = mtRegular.Id, Quantity = 1 },
                        new ClientDeliveryScheduleDetail { DayOfWeek = DayOfWeek.Wednesday, MealTypeId = mtRegular.Id, Quantity = 1 },
                        new ClientDeliveryScheduleDetail { DayOfWeek = DayOfWeek.Friday, MealTypeId = mtRegular.Id, Quantity = 1 }
                    }
                };
                var cds2 = new ClientDeliverySchedule
                {
                    ClientId = client2.Id,
                    RecurrencePattern = "Weekly",
                    StartDate = DateTime.UtcNow.Date,
                    IsActive = true,
                    ScheduleDetails = new List<ClientDeliveryScheduleDetail>
                    {
                        new ClientDeliveryScheduleDetail { DayOfWeek = DayOfWeek.Tuesday, MealTypeId = mtRegular.Id, Quantity = 2 },
                        new ClientDeliveryScheduleDetail { DayOfWeek = DayOfWeek.Thursday, MealTypeId = mtVegetarian.Id, Quantity = 1 }
                    }
                };
                context.ClientDeliverySchedules.AddRange(cds1, cds2);

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

                // Assign clients to routes (Example)
                client1.RouteId = route1.Id;
                client2.RouteId = route1.Id;
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
            catch (Exception ex)
            {
                Console.WriteLine($"Database seeding error: {ex.Message}");
                Console.WriteLine(ex.StackTrace);
                // Re-throw the exception to let Program.cs handle it
                throw;
            }
        }
    }
}