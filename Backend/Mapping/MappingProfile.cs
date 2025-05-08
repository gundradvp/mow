using AutoMapper;
using MOWScheduler.DTOs.Client; // Add relevant DTO namespaces as needed
using MOWScheduler.Models; // Add relevant Model namespaces as needed
using System.Linq; // Required for Select

namespace MOWScheduler.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Client Mappings
            CreateMap<Client, ClientReadDto>()
                .ForMember(dest => dest.RouteName, opt => opt.MapFrom(src => src.Route != null ? src.Route.Name : null))
                .ForMember(dest => dest.DietaryRestrictions, opt => opt.MapFrom(src => src.ClientDietaryRestrictions.Select(cdr => cdr.DietaryRestriction)))
                .ForMember(dest => dest.EligibilityCriteria, opt => opt.MapFrom(src => src.ClientEligibilityCriteria.Select(cec => cec.EligibilityCriterion)))
                .ForMember(dest => dest.ServiceAuthorizations, opt => opt.MapFrom(src => src.ServiceAuthorizations))
                .ForMember(dest => dest.CaseNotes, opt => opt.MapFrom(src => src.CaseNotes))
                .ForMember(dest => dest.DeliverySchedules, opt => opt.MapFrom(src => src.ClientDeliverySchedules));

            CreateMap<ClientCreateUpdateDto, Client>()
                .ForMember(dest => dest.ClientDietaryRestrictions, opt => opt.Ignore()) // Handled manually in controller
                .ForMember(dest => dest.ClientEligibilityCriteria, opt => opt.Ignore()) // Handled manually in controller
                .ForMember(dest => dest.ServiceAuthorizations, opt => opt.MapFrom(src => src.ServiceAuthorizations)) // Map nested DTOs
                .ForMember(dest => dest.ClientDeliverySchedules, opt => opt.MapFrom(src => src.DeliverySchedules)) // Map nested DTOs
                .ForMember(dest => dest.EmergencyContact, opt => opt.MapFrom(src => 
                    !string.IsNullOrWhiteSpace(src.EmergencyContactName) && !string.IsNullOrWhiteSpace(src.EmergencyContactPhone) 
                        ? $"Name: {src.EmergencyContactName}, Phone: {src.EmergencyContactPhone}" 
                        : !string.IsNullOrWhiteSpace(src.EmergencyContactName) 
                            ? $"Name: {src.EmergencyContactName}" 
                            : !string.IsNullOrWhiteSpace(src.EmergencyContactPhone) 
                                ? $"Phone: {src.EmergencyContactPhone}" 
                                : null)); // Combine name and phone

            // Dietary Restriction Mappings
            CreateMap<DietaryRestriction, DietaryRestrictionDto>();
            CreateMap<DietaryRestrictionDto, DietaryRestriction>(); // If needed

            // Eligibility Criteria Mappings
            CreateMap<EligibilityCriterion, EligibilityCriterionDto>();
            CreateMap<EligibilityCriterionDto, EligibilityCriterion>(); // If needed

            // Service Authorization Mappings
            CreateMap<ServiceAuthorization, ServiceAuthorizationDto>().ReverseMap(); // Maps both ways

            // Case Note Mappings
            CreateMap<CaseNote, CaseNoteDto>().ReverseMap(); // Maps both ways

            // Delivery Schedule Mappings
            CreateMap<ClientDeliverySchedule, ClientDeliveryScheduleDto>().ReverseMap();
            CreateMap<ClientDeliveryScheduleDetail, ClientDeliveryScheduleDetailDto>().ReverseMap();

            // Meal Type Mappings
            CreateMap<MealType, MealTypeDto>().ReverseMap();

            // Add other mappings as needed for Volunteers, Routes, etc.
        }
    }
}
