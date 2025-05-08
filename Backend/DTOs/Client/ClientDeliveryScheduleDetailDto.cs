// filepath: c:\Users\Durga Vara Prasad\Desktop\MOW\Backend\DTOs\Client\ClientDeliveryScheduleDetailDto.cs
using System;
using System.ComponentModel.DataAnnotations; // For Range

namespace MOWScheduler.DTOs.Client
{
    public class ClientDeliveryScheduleDetailDto
    {
        public int Id { get; set; } // Only needed for Read/Update
        public DayOfWeek DayOfWeek { get; set; }
        public int MealTypeId { get; set; }
        public MealTypeDto? MealType { get; set; } // Include for Read
        [Range(1, 10)]
        public int Quantity { get; set; }
    }
}
