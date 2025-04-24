using Microsoft.EntityFrameworkCore;
using MOWScheduler.Models;

namespace MOWScheduler.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Volunteer> Volunteers { get; set; }
        public DbSet<Client> Clients { get; set; }
        public DbSet<DeliveryRoute> DeliveryRoutes { get; set; }
        public DbSet<Schedule> Schedules { get; set; }
        public DbSet<Notification> Notifications { get; set; }

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
        }
    }
}