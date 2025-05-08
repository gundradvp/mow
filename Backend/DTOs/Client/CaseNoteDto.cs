// filepath: c:\Users\Durga Vara Prasad\Desktop\MOW\Backend\DTOs\Client\CaseNoteDto.cs
using System;

namespace MOWScheduler.DTOs.Client
{
    public class CaseNoteDto
    {
        public int Id { get; set; }
        public int UserId { get; set; } // Consider adding UserName for display
        public DateTime Timestamp { get; set; }
        public string NoteContent { get; set; } = string.Empty;
    }
}
