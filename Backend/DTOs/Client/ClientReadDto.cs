// filepath: c:\Users\Durga Vara Prasad\Desktop\MOW\Backend\DTOs\Client\ClientReadDto.cs
using System;
using System.Collections.Generic;

namespace MOWScheduler.DTOs.Client
{
    // DTO for reading client data, including related entities
    public class ClientReadDto
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public DateTime? DateOfBirth { get; set; }
        public string? Gender { get; set; }
        public string? PhoneNumber { get; set; }
        public string Address { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string State { get; set; } = string.Empty;
        public string ZipCode { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public DateTime RegistrationDate { get; set; }
        public string? EmergencyContact { get; set; }
        public string? Notes { get; set; }
        public int? RouteId { get; set; }
        public string? RouteName { get; set; } // Include route name for display

        public List<DietaryRestrictionDto> DietaryRestrictions { get; set; } = new List<DietaryRestrictionDto>();
        public List<EligibilityCriterionDto> EligibilityCriteria { get; set; } = new List<EligibilityCriterionDto>();
        public List<ServiceAuthorizationDto> ServiceAuthorizations { get; set; } = new List<ServiceAuthorizationDto>();
        public List<CaseNoteDto> CaseNotes { get; set; } = new List<CaseNoteDto>();
        public List<ClientDeliveryScheduleDto> DeliverySchedules { get; set; } = new List<ClientDeliveryScheduleDto>();
    }
}
