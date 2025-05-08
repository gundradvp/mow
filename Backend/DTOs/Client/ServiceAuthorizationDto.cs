// filepath: c:\Users\Durga Vara Prasad\Desktop\MOW\Backend\DTOs\Client\ServiceAuthorizationDto.cs
using System;

namespace MOWScheduler.DTOs.Client
{
    public class ServiceAuthorizationDto
    {
        public int Id { get; set; }
        public string AuthorizationProvider { get; set; } = string.Empty;
        public string? AuthorizationNumber { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string? AuthorizedServices { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
