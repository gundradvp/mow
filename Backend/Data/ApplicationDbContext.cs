using Microsoft.EntityFrameworkCore;
using MOWScheduler.Models;

namespace MOWScheduler.Data
{
    /// <summary>
    /// Represents the database context for the application.
    /// </summary>
    public class ApplicationDbContext : DbContext
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="ApplicationDbContext"/> class.
        /// </summary>
        /// <param name="options">The options to configure the database context.</param>
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        /// <summary>
        /// Gets or sets the Users table.
        /// </summary>
        public DbSet<User> Users { get; set; }

        /// <summary>
        /// Gets or sets the Volunteers table.
        /// </summary>
        public DbSet<Volunteer> Volunteers { get; set; }

        /// <summary>
        /// Gets or sets the Clients table.
        /// </summary>
        public DbSet<Client> Clients { get; set; }

        /// <summary>
        /// Gets or sets the DeliveryRoutes table.
        /// </summary>
        public DbSet<DeliveryRoute> DeliveryRoutes { get; set; }

        /// <summary>
        /// Gets or sets the Schedules table.
        /// </summary>
        public DbSet<Schedule> Schedules { get; set; }

        /// <summary>
        /// Gets or sets the Notifications table.
        /// </summary>
        public DbSet<Notification> Notifications { get; set; }

        /// <summary>
        /// Gets or sets the Shifts table.
        /// </summary>
        public DbSet<Shift> Shifts { get; set; }

        /// <summary>
        /// Gets or sets the DietaryRestrictions table.
        /// </summary>
        public DbSet<DietaryRestriction> DietaryRestrictions { get; set; }

        /// <summary>
        /// Gets or sets the EligibilityCriteria table.
        /// </summary>
        public DbSet<EligibilityCriterion> EligibilityCriteria { get; set; }

        /// <summary>
        /// Gets or sets the ClientDietaryRestrictions table.
        /// </summary>
        public DbSet<ClientDietaryRestriction> ClientDietaryRestrictions { get; set; }

        /// <summary>
        /// Gets or sets the ClientEligibilityCriteria table.
        /// </summary>
        public DbSet<ClientEligibilityCriteria> ClientEligibilityCriteria { get; set; }

        /// <summary>
        /// Gets or sets the ServiceAuthorizations table.
        /// </summary>
        public DbSet<ServiceAuthorization> ServiceAuthorizations { get; set; }

        /// <summary>
        /// Gets or sets the CaseNotes table.
        /// </summary>
        public DbSet<CaseNote> CaseNotes { get; set; }

        /// <summary>
        /// Gets or sets the MealTypes table.
        /// </summary>
        public DbSet<MealType> MealTypes { get; set; }

        /// <summary>
        /// Gets or sets the ClientDeliverySchedules table.
        /// </summary>
        public DbSet<ClientDeliverySchedule> ClientDeliverySchedules { get; set; }

        /// <summary>
        /// Gets or sets the ClientDeliveryScheduleDetails table.
        /// </summary>
        public DbSet<ClientDeliveryScheduleDetail> ClientDeliveryScheduleDetails { get; set; }

        /// <summary>
        /// Configures the model relationships and constraints.
        /// </summary>
        /// <param name="modelBuilder">The model builder to configure the entities.</param>
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure relationships and constraints
            modelBuilder.Entity<Schedule>()
                .HasOne(s => s.Volunteer)
                .WithMany(v => v.Schedules)
                .HasForeignKey(s => s.VolunteerId);

            modelBuilder.Entity<Schedule>()
                .HasOne(s => s.Route)
                .WithMany(r => r.Schedules)
                .HasForeignKey(s => s.RouteId);

            // Configure many-to-many relationship between Volunteer and Shift
            modelBuilder.Entity<Volunteer>()
                .HasMany(v => v.AssignedShifts)
                .WithMany(s => s.AssignedVolunteers)
                .UsingEntity(j => j.ToTable("VolunteerShifts"));

            // Configure relationships for Client Management

            // Client <-> DietaryRestriction (Many-to-Many)
            modelBuilder.Entity<ClientDietaryRestriction>()
                .HasKey(cdr => new { cdr.ClientId, cdr.DietaryRestrictionId });

            modelBuilder.Entity<ClientDietaryRestriction>()
                .HasOne(cdr => cdr.Client)
                .WithMany(c => c.ClientDietaryRestrictions)
                .HasForeignKey(cdr => cdr.ClientId);

            modelBuilder.Entity<ClientDietaryRestriction>()
                .HasOne(cdr => cdr.DietaryRestriction)
                .WithMany(dr => dr.ClientDietaryRestrictions)
                .HasForeignKey(cdr => cdr.DietaryRestrictionId);

            // Client <-> EligibilityCriterion (Many-to-Many)
            modelBuilder.Entity<ClientEligibilityCriteria>()
                .HasKey(cec => new { cec.ClientId, cec.EligibilityCriterionId });

            modelBuilder.Entity<ClientEligibilityCriteria>()
                .HasOne(cec => cec.Client)
                .WithMany(c => c.ClientEligibilityCriteria)
                .HasForeignKey(cec => cec.ClientId);

            modelBuilder.Entity<ClientEligibilityCriteria>()
                .HasOne(cec => cec.EligibilityCriterion)
                .WithMany(ec => ec.ClientEligibilityCriteria)
                .HasForeignKey(cec => cec.EligibilityCriterionId);

            // Client -> ServiceAuthorization (One-to-Many)
            modelBuilder.Entity<ServiceAuthorization>()
                .HasOne(sa => sa.Client)
                .WithMany(c => c.ServiceAuthorizations)
                .HasForeignKey(sa => sa.ClientId);

            // Client -> CaseNote (One-to-Many)
            modelBuilder.Entity<CaseNote>()
                .HasOne(cn => cn.Client)
                .WithMany(c => c.CaseNotes)
                .HasForeignKey(cn => cn.ClientId)
                .OnDelete(DeleteBehavior.Cascade); // Cascade delete notes if client is deleted

            // User -> CaseNote (One-to-Many)
            modelBuilder.Entity<CaseNote>()
                .HasOne(cn => cn.User)
                .WithMany() // Assuming User doesn't need a collection of CaseNotes
                .HasForeignKey(cn => cn.UserId)
                .OnDelete(DeleteBehavior.Restrict); // Prevent deleting user if they have notes

            // Client -> ClientDeliverySchedule (One-to-Many)
            modelBuilder.Entity<ClientDeliverySchedule>()
                .HasOne(cds => cds.Client)
                .WithMany(c => c.ClientDeliverySchedules) // Correct: Link to the collection in Client model
                .HasForeignKey(cds => cds.ClientId);

            // ClientDeliverySchedule -> ClientDeliveryScheduleDetail (One-to-Many)
            modelBuilder.Entity<ClientDeliveryScheduleDetail>()
                .HasOne(cdsd => cdsd.ClientDeliverySchedule)
                .WithMany(cds => cds.ScheduleDetails)
                .HasForeignKey(cdsd => cdsd.ClientDeliveryScheduleId);

            // MealType -> ClientDeliveryScheduleDetail (One-to-Many)
            modelBuilder.Entity<ClientDeliveryScheduleDetail>()
                .HasOne(cdsd => cdsd.MealType)
                .WithMany(mt => mt.ScheduleDetails)
                .HasForeignKey(cdsd => cdsd.MealTypeId);

            // Client -> DeliveryRoute (One-to-Many, Optional)
            modelBuilder.Entity<Client>()
                .HasOne(c => c.Route)
                .WithMany() // Assuming Route doesn't need direct collection of Clients yet
                .HasForeignKey(c => c.RouteId)
                .IsRequired(false); // RouteId is nullable
        }
    }
}