using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace MOWScheduler.DTOs.Volunteer
{
    /// <summary>
    /// Data transfer object for volunteer registration.
    /// </summary>
    public class VolunteerRegistrationDTO
    {
        // Account Information
        [Required]
        [StringLength(50, MinimumLength = 3)]
        public string Username { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        [StringLength(100, MinimumLength = 6)]
        public string Password { get; set; } = string.Empty;
        
        /// <summary>
        /// Gets or sets the operational roles for this volunteer (comma-separated).
        /// Examples: "Driver", "KitchenVolunteer", "Packer"
        /// </summary>
        public string OperationalRoles { get; set; } = string.Empty;

        // Personal Information
        [Required]
        [StringLength(100)]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string LastName { get; set; } = string.Empty;

        [Required]
        [Phone]
        [StringLength(20)]
        public string PhoneNumber { get; set; } = string.Empty;

        [Required]
        [StringLength(255)]
        public string Address { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string City { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string State { get; set; } = string.Empty;

        [Required]
        [StringLength(20)]
        public string ZipCode { get; set; } = string.Empty;

        // Volunteer Information
        [Required]
        [StringLength(500)]
        public string Availability { get; set; } = string.Empty;

        [Required]
        [StringLength(500)]
        public string Skills { get; set; } = string.Empty;

        [StringLength(500)]
        public string Preferences { get; set; } = string.Empty;

        public bool HasDriverLicense { get; set; } = false;

        public bool IsWillingToDrive { get; set; } = false;

        public bool CanLift20Pounds { get; set; } = false;

        [Required]
        public bool BackgroundCheckConsent { get; set; } = false;

        // Emergency Contact
        [Required]
        [StringLength(100)]
        public string EmergencyContactName { get; set; } = string.Empty;

        [Required]
        [Phone]
        [StringLength(20)]
        public string EmergencyContactPhone { get; set; } = string.Empty;

        [StringLength(100)]
        public string EmergencyContactRelationship { get; set; } = string.Empty;
    }
}