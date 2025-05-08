using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MOWScheduler.Models
{
    /// <summary>
    /// Represents a volunteer in the system.
    /// </summary>
    public class Volunteer
    {
        /// <summary>
        /// Gets or sets the unique identifier for the volunteer.
        /// </summary>
        [Key]
        public int Id { get; set; }

        /// <summary>
        /// Gets or sets the foreign key for the associated user.
        /// </summary>
        [Required]
        public int UserId { get; set; }

        /// <summary>
        /// Gets or sets the associated user.
        /// </summary>
        [ForeignKey("UserId")]
        public User? User { get; set; }

        /// <summary>
        /// Gets or sets the first name of the volunteer.
        /// </summary>
        [Required]
        [StringLength(100)]
        public string FirstName { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the last name of the volunteer.
        /// </summary>
        [Required]
        [StringLength(100)]
        public string LastName { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the email of the volunteer.
        /// </summary>
        [Required]
        [EmailAddress]
        [StringLength(255)]
        public string Email { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the phone number of the volunteer.
        /// </summary>
        [Phone]
        [StringLength(20)]
        public string? PhoneNumber { get; set; }

        /// <summary>
        /// Gets or sets the address of the volunteer.
        /// </summary>
        [StringLength(255)]
        public string? Address { get; set; }

        /// <summary>
        /// Gets or sets the city of the volunteer.
        /// </summary>
        [StringLength(100)]
        public string? City { get; set; }

        /// <summary>
        /// Gets or sets the state of the volunteer.
        /// </summary>
        [StringLength(50)]
        public string? State { get; set; }

        /// <summary>
        /// Gets or sets the zip code of the volunteer.
        /// </summary>
        [StringLength(20)]
        public string? ZipCode { get; set; }

        /// <summary>
        /// Gets or sets the emergency contact name for the volunteer.
        /// </summary>
        [StringLength(100)]
        public string? EmergencyContactName { get; set; }

        /// <summary>
        /// Gets or sets the emergency contact phone number for the volunteer.
        /// </summary>
        [Phone]
        [StringLength(20)]
        public string? EmergencyContactPhone { get; set; }
        
        /// <summary>
        /// Gets or sets the emergency contact relationship to the volunteer.
        /// </summary>
        [StringLength(100)]
        public string? EmergencyContactRelationship { get; set; }

        /// <summary>
        /// Gets or sets the available days for the volunteer (e.g., "Monday,Wednesday,Friday").
        /// </summary>
        public string AvailableDays { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets a value indicating whether the volunteer is active.
        /// </summary>
        public bool IsActive { get; set; } = true;

        /// <summary>
        /// Gets or sets the start date of the volunteer's service.
        /// </summary>
        public DateTime StartDate { get; set; } = DateTime.Now;

        /// <summary>
        /// Gets or sets additional notes about the volunteer.
        /// </summary>
        public string Notes { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the collection of schedules associated with the volunteer.
        /// </summary>
        public ICollection<Schedule> Schedules { get; set; } = new List<Schedule>();

        /// <summary>
        /// Gets or sets the availability of the volunteer (e.g., Weekdays, Weekends).
        /// </summary>
        [StringLength(500)]
        public string Availability { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the skills of the volunteer (e.g., Driving, Cooking).
        /// </summary>
        [StringLength(500)]
        public string Skills { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the preferences for the volunteer.
        /// </summary>
        [StringLength(500)]
        public string Preferences { get; set; } = string.Empty;
        
        /// <summary>
        /// Gets or sets a value indicating whether the volunteer has a driver's license.
        /// </summary>
        public bool HasDriverLicense { get; set; } = false;
        
        /// <summary>
        /// Gets or sets a value indicating whether the volunteer is willing to drive.
        /// </summary>
        public bool IsWillingToDrive { get; set; } = false;
        
        /// <summary>
        /// Gets or sets a value indicating whether the volunteer can lift 20 pounds.
        /// </summary>
        public bool CanLift20Pounds { get; set; } = false;
        
        /// <summary>
        /// Gets or sets a value indicating whether the volunteer has consented to a background check.
        /// </summary>
        public bool BackgroundCheckConsent { get; set; } = false;
        
        /// <summary>
        /// Gets or sets a value indicating whether the volunteer has completed a background check.
        /// </summary>
        public bool HasCompletedBackgroundCheck { get; set; } = false;
        
        /// <summary>
        /// Gets or sets the date the background check was completed.
        /// </summary>
        public DateTime? BackgroundCheckDate { get; set; }

        /// <summary>
        /// Gets or sets the collection of shifts assigned to the volunteer.
        /// </summary>
        public ICollection<Shift> AssignedShifts { get; set; } = new List<Shift>();
    }

    /// <summary>
    /// Represents a shift in the system.
    /// </summary>
    public class Shift
    {
        /// <summary>
        /// Gets or sets the unique identifier for the shift.
        /// </summary>
        [Key]
        public int Id { get; set; }

        /// <summary>
        /// Gets or sets the name of the shift (e.g., Morning, Afternoon, Evening).
        /// </summary>
        public string Name { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the start time of the shift.
        /// </summary>
        public DateTime StartTime { get; set; }

        /// <summary>
        /// Gets or sets the end time of the shift.
        /// </summary>
        public DateTime EndTime { get; set; }

        /// <summary>
        /// Gets or sets the collection of volunteers assigned to the shift.
        /// </summary>
        public ICollection<Volunteer> AssignedVolunteers { get; set; } = new List<Volunteer>();
    }
}