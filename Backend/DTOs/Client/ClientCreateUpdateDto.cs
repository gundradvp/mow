// filepath: c:\Users\Durga Vara Prasad\Desktop\MOW\Backend\DTOs\Client\ClientCreateUpdateDto.cs
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace MOWScheduler.DTOs.Client
{
    // Combined DTO for creating and updating clients
    public class ClientCreateUpdateDto
    {
        [Required]
        public string FirstName { get; set; } = string.Empty;
        [Required]
        public string LastName { get; set; } = string.Empty;
        public DateTime? DateOfBirth { get; set; }
        public string? Gender { get; set; }
        public string? PhoneNumber { get; set; }
        [Required]
        public string Address { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string State { get; set; } = string.Empty;
        public string ZipCode { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;
        public string? EmergencyContactName { get; set; }
        public string? EmergencyContactPhone { get; set; }
        public string? Notes { get; set; }
        public int? RouteId { get; set; }

        // IDs of related entities to link
        public List<int> DietaryRestrictionIds { get; set; } = new List<int>();
        public List<int> EligibilityCriteriaIds { get; set; } = new List<int>();

        // Full objects for related entities that might be created/updated along with the client
        // Adjust based on whether you want to create/update these inline or manage them separately
        public List<ServiceAuthorizationDto> ServiceAuthorizations { get; set; } = new List<ServiceAuthorizationDto>();
        public List<ClientDeliveryScheduleDto> DeliverySchedules { get; set; } = new List<ClientDeliveryScheduleDto>();
        // CaseNotes are typically added via a separate endpoint, not usually during client create/update
    }
}
