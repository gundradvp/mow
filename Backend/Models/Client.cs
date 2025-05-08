using System;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

namespace MOWScheduler.Models
{
    /// <summary>
    /// Represents a client in the system.
    /// </summary>
    public class Client
    {
        /// <summary>
        /// Gets or sets the unique identifier for the client.
        /// </summary>
        [Key]
        public int Id { get; set; }

        /// <summary>
        /// Gets or sets the first name of the client.
        /// </summary>
        [Required]
        public string FirstName { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the last name of the client.
        /// </summary>
        [Required]
        public string LastName { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the date of birth of the client.
        /// </summary>
        public DateTime? DateOfBirth { get; set; }

        /// <summary>
        /// Gets or sets the gender of the client.
        /// </summary>
        public string? Gender { get; set; }

        /// <summary>
        /// Gets or sets the phone number of the client.
        /// </summary>
        public string? PhoneNumber { get; set; }

        /// <summary>
        /// Gets or sets the address of the client.
        /// </summary>
        [Required]
        public string Address { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the city of the client.
        /// </summary>
        public string City { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the state of the client.
        /// </summary>
        public string State { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the zip code of the client.
        /// </summary>
        public string ZipCode { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets a value indicating whether the client is active.
        /// </summary>
        public bool IsActive { get; set; } = true;

        /// <summary>
        /// Gets or sets the registration date of the client.
        /// </summary>
        public DateTime RegistrationDate { get; set; } = DateTime.Now;

        /// <summary>
        /// Gets or sets the emergency contact information for the client.
        /// </summary>
        public string? EmergencyContact { get; set; }

        /// <summary>
        /// Gets or sets additional notes about the client.
        /// </summary>
        public string? Notes { get; set; }

        /// <summary>
        /// Gets or sets the collection of dietary restrictions for the client.
        /// </summary>
        public ICollection<ClientDietaryRestriction> ClientDietaryRestrictions { get; set; } = new List<ClientDietaryRestriction>();

        /// <summary>
        /// Gets or sets the collection of eligibility criteria met by the client.
        /// </summary>
        public ICollection<ClientEligibilityCriteria> ClientEligibilityCriteria { get; set; } = new List<ClientEligibilityCriteria>();

        /// <summary>
        /// Gets or sets the collection of service authorizations for the client.
        /// </summary>
        public ICollection<ServiceAuthorization> ServiceAuthorizations { get; set; } = new List<ServiceAuthorization>();

        /// <summary>
        /// Gets or sets the collection of case notes for the client.
        /// </summary>
        public ICollection<CaseNote> CaseNotes { get; set; } = new List<CaseNote>();

        /// <summary>
        /// Gets or sets the collection of delivery schedules for the client.
        /// </summary>
        public ICollection<ClientDeliverySchedule> ClientDeliverySchedules { get; set; } = new List<ClientDeliverySchedule>();

        /// <summary>
        /// Gets or sets the foreign key for the associated delivery route.
        /// </summary>
        public int? RouteId { get; set; }

        /// <summary>
        /// Gets or sets the associated delivery route.
        /// </summary>
        public DeliveryRoute? Route { get; set; }
    }
}