using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace MOWScheduler.Models.DbScaffold;

public partial class MowschedulerDbContext : DbContext
{
    public MowschedulerDbContext()
    {
    }

    public MowschedulerDbContext(DbContextOptions<MowschedulerDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Volunteer> Volunteers { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=localhost;Database=MOWSchedulerDB;Trusted_Connection=True;TrustServerCertificate=True;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Volunteer>(entity =>
        {
            entity.HasIndex(e => e.UserId, "IX_Volunteers_UserId");

            entity.Property(e => e.Address).HasMaxLength(255);
            entity.Property(e => e.Availability).HasMaxLength(500);
            entity.Property(e => e.City).HasMaxLength(100);
            entity.Property(e => e.Email)
                .HasMaxLength(255)
                .HasDefaultValue("");
            entity.Property(e => e.EmergencyContactName).HasMaxLength(100);
            entity.Property(e => e.EmergencyContactPhone).HasMaxLength(20);
            entity.Property(e => e.EmergencyContactRelationship).HasMaxLength(100);
            entity.Property(e => e.FirstName)
                .HasMaxLength(100)
                .HasDefaultValue("");
            entity.Property(e => e.LastName)
                .HasMaxLength(100)
                .HasDefaultValue("");
            entity.Property(e => e.PhoneNumber).HasMaxLength(20);
            entity.Property(e => e.Preferences)
                .HasMaxLength(500)
                .HasDefaultValue("");
            entity.Property(e => e.Skills).HasMaxLength(500);
            entity.Property(e => e.State).HasMaxLength(50);
            entity.Property(e => e.ZipCode).HasMaxLength(20);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
