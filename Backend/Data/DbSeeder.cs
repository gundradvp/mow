using MOWScheduler.Models;
using MOWScheduler.Models.Inventory;
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
                context.Database.EnsureCreated();                // Ensure admin user exists (even if other users exist)
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
                        IsStaff = true,
                        OperationalRoles = "InventoryManager,RoutePlanner,ClientCoordinator,VolunteerCoordinator",
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
                }                // Add volunteer users with different operational roles
                var kitchenVolunteer = new User
                {
                    Username = "kitchen",
                    Email = "kitchen@example.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Volunteer123!"),
                    FirstName = "Kitchen",
                    LastName = "Volunteer",
                    PhoneNumber = "555-234-5678",
                    Role = "Volunteer",
                    IsStaff = false,
                    OperationalRoles = "KitchenVolunteer",
                    CreatedAt = DateTime.Now
                };
                
                var driverVolunteer = new User
                {
                    Username = "driver",
                    Email = "driver@example.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Volunteer123!"),
                    FirstName = "Driver",
                    LastName = "Volunteer",
                    PhoneNumber = "555-876-5432",
                    Role = "Volunteer",
                    IsStaff = false,
                    OperationalRoles = "Driver",
                    CreatedAt = DateTime.Now
                };
                
                var inventoryVolunteer = new User
                {
                    Username = "inventory",
                    Email = "inventory@example.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Volunteer123!"),
                    FirstName = "Inventory",
                    LastName = "Manager",
                    PhoneNumber = "555-987-6543",
                    Role = "Volunteer",
                    IsStaff = false,
                    OperationalRoles = "InventoryManager,KitchenVolunteer",
                    CreatedAt = DateTime.Now
                };

                // Save volunteer users to the database
                context.Users.AddRange(kitchenVolunteer, driverVolunteer, inventoryVolunteer);
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
                context.SaveChanges();                // Add volunteer records
                var kitchenVolunteerRecord = new Volunteer
                {
                    UserId = kitchenVolunteer.Id,
                    AvailableDays = "Monday,Wednesday,Friday",
                    IsActive = true,
                    StartDate = DateTime.Now.AddDays(-30),
                    Notes = "Kitchen helper"
                };
                
                var driverVolunteerRecord = new Volunteer
                {
                    UserId = driverVolunteer.Id,
                    AvailableDays = "Tuesday,Thursday",
                    IsActive = true,
                    StartDate = DateTime.Now.AddDays(-15),
                    Notes = "Has own vehicle"
                };                // Save volunteers to database
                context.Volunteers.AddRange(kitchenVolunteerRecord, driverVolunteerRecord);
                context.SaveChanges();                // Now that we have the volunteer IDs, create schedules
                var schedule = new Schedule
                {
                    VolunteerId = driverVolunteerRecord.Id,
                    RouteId = route1.Id,
                    ScheduledDate = DateTime.Now.Date.AddDays(1),
                    Status = "Scheduled",
                    Notes = "First delivery"
                };
                
                var schedule2 = new Schedule
                {
                    VolunteerId = kitchenVolunteerRecord.Id,
                    RouteId = route2.Id,
                    ScheduledDate = DateTime.Now.Date.AddDays(2),
                    Status = "Scheduled",
                    Notes = "Kitchen duty"
                };
                
                // Add inventory categories
                var dairyCategory = new Category
                {
                    Name = "Dairy",
                    Description = "Milk, cheese, and other dairy products",
                    IsActive = true
                };
                
                var produceCategory = new Category
                {
                    Name = "Produce",
                    Description = "Fresh fruits and vegetables",
                    IsActive = true
                };
                
                var meatCategory = new Category
                {
                    Name = "Meat",
                    Description = "Fresh meat products",
                    IsActive = true
                };
                
                var dryGoodsCategory = new Category
                {
                    Name = "Dry Goods",
                    Description = "Non-perishable food items",
                    IsActive = true
                };
                
                context.Categories.AddRange(dairyCategory, produceCategory, meatCategory, dryGoodsCategory);
                context.SaveChanges();
                  // Add inventory items
                var inventoryItems = new List<InventoryItem>
                {
                    new InventoryItem
                    {
                        Name = "Whole Milk",
                        Description = "Gallon of whole milk",
                        SKU = "DAIRY-001",
                        CategoryId = dairyCategory.Id,
                        UnitOfMeasure = "Gallon",
                        CurrentQuantity = 20,
                        ReorderThreshold = 10,
                        ReorderQuantity = 15,
                        UnitCost = 3.99M,
                        IsPerishable = true,
                        ShelfLifeDays = 14,
                        IsActive = true
                    },
                    new InventoryItem
                    {
                        Name = "Carrots",
                        Description = "5lb bag of carrots",
                        SKU = "PROD-001",
                        CategoryId = produceCategory.Id,
                        UnitOfMeasure = "Bag",
                        CurrentQuantity = 15,
                        ReorderThreshold = 5,
                        ReorderQuantity = 10,
                        UnitCost = 2.99M,
                        IsPerishable = true,
                        ShelfLifeDays = 21,
                        IsActive = true
                    },
                    new InventoryItem
                    {
                        Name = "Ground Beef",
                        Description = "1lb package of ground beef",
                        SKU = "MEAT-001",
                        CategoryId = meatCategory.Id,
                        UnitOfMeasure = "Pound",
                        CurrentQuantity = 30,
                        ReorderThreshold = 15,
                        ReorderQuantity = 20,
                        UnitCost = 4.99M,
                        IsPerishable = true,
                        ShelfLifeDays = 7,
                        IsActive = true
                    },
                    new InventoryItem
                    {
                        Name = "Rice",
                        Description = "10lb bag of white rice",
                        SKU = "DRY-001",
                        CategoryId = dryGoodsCategory.Id,
                        UnitOfMeasure = "Bag",
                        CurrentQuantity = 25,
                        ReorderThreshold = 10,
                        ReorderQuantity = 15,
                        UnitCost = 8.99M,
                        IsPerishable = false,
                        IsActive = true
                    }
                };
                  context.InventoryItems.AddRange(inventoryItems);
                context.SaveChanges();
                  // Add example inventory transactions
                var transactions = new List<InventoryTransaction>
                {
                    new InventoryTransaction
                    {
                        ItemId = inventoryItems[0].Id, // Milk
                        TransactionType = "Receipt",
                        Quantity = 20,
                        TransactionDate = DateTime.Now.AddDays(-5),
                        UserId = Guid.NewGuid(), // Use a new Guid since User.Id is int and not compatible
                        Notes = "Initial inventory receipt",
                        CreatedAt = DateTime.Now.AddDays(-5)
                    },
                    new InventoryTransaction
                    {
                        ItemId = inventoryItems[0].Id, // Milk
                        TransactionType = "Consumption",
                        Quantity = -5,
                        TransactionDate = DateTime.Now.AddDays(-2),
                        UserId = Guid.NewGuid(), // Use a new Guid since User.Id is int and not compatible
                        Notes = "Used for meal preparation by kitchen volunteer",
                        CreatedAt = DateTime.Now.AddDays(-2)
                    },
                    new InventoryTransaction
                    {
                        ItemId = inventoryItems[1].Id, // Carrots
                        TransactionType = "Receipt",
                        Quantity = 15,
                        TransactionDate = DateTime.Now.AddDays(-7),
                        UserId = Guid.NewGuid(), // Use a new Guid since User.Id is int and not compatible
                        Notes = "Weekly delivery by inventory volunteer",
                        CreatedAt = DateTime.Now.AddDays(-7)
                    },
                    new InventoryTransaction
                    {
                        ItemId = inventoryItems[2].Id, // Ground Beef
                        TransactionType = "Receipt",
                        Quantity = 30,
                        TransactionDate = DateTime.Now.AddDays(-3),
                        UserId = Guid.NewGuid(), // Use a new Guid since User.Id is int and not compatible
                        Notes = "Delivery from supplier by inventory volunteer",
                        CreatedAt = DateTime.Now.AddDays(-3)
                    },
                    new InventoryTransaction
                    {
                        ItemId = inventoryItems[3].Id, // Rice
                        TransactionType = "Receipt",
                        Quantity = 25,
                        TransactionDate = DateTime.Now.AddDays(-10),
                        UserId = Guid.NewGuid(), // Use a new Guid since User.Id is int and not compatible
                        Notes = "Monthly bulk order by inventory volunteer",
                        CreatedAt = DateTime.Now.AddDays(-10)
                    }
                };
                
                context.InventoryTransactions.AddRange(transactions);
                context.SaveChanges();// Save schedules to database
                context.Schedules.AddRange(schedule, schedule2);
                context.SaveChanges();

                // Add some notifications
                var notification1 = new Notification
                {
                    UserId = driverVolunteer.Id,
                    Title = "Schedule Assignment",
                    Message = "You have been assigned to the Downtown Route tomorrow.",
                    Type = "InApp",
                    Status = "Sent",
                    CreatedAt = DateTime.Now,
                    SentAt = DateTime.Now,
                    ReferenceId = schedule.Id,
                    ReferenceType = "Schedule"
                };
                
                var notification2 = new Notification
                {
                    UserId = kitchenVolunteer.Id,
                    Title = "Schedule Assignment",
                    Message = "You have been assigned to Kitchen duty in two days.",
                    Type = "InApp",
                    Status = "Sent",
                    CreatedAt = DateTime.Now,
                    SentAt = DateTime.Now,
                    ReferenceId = schedule2.Id,
                    ReferenceType = "Schedule"
                };                context.Notifications.AddRange(notification1, notification2);
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