// filepath: c:\Users\Durga Vara Prasad\Desktop\MOW\Backend\DTOs\Client\ClientDeliveryScheduleDto.cs
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace MOWScheduler.DTOs.Client
{
    public class ClientDeliveryScheduleDto
    {
        public int Id { get; set; } // Only needed for Read/Update
        [Required]
        public string RecurrencePattern { get; set; } = "Weekly";
        [Required]
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public bool IsActive { get; set; } = true;
        [Required]
        public List<ClientDeliveryScheduleDetailDto> ScheduleDetails { get; set; } = new List<ClientDeliveryScheduleDetailDto>();
    }
}
