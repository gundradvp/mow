// filepath: c:\Users\Durga Vara Prasad\Desktop\MOW\Backend\Models\CaseNote.cs
using System.ComponentModel.DataAnnotations;

namespace MOWScheduler.Models
{
    /// <summary>
    /// Represents a case note for a client (HIPAA-compliant).
    /// </summary>
    public class CaseNote
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int ClientId { get; set; }
        public Client? Client { get; set; }

        [Required]
        public int UserId { get; set; } // Staff/Volunteer who created the note
        public User? User { get; set; }

        [Required]
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;

        [Required]
        public string NoteContent { get; set; } = string.Empty;

        // Add fields for audit history if needed (e.g., LastEditedByUserId, LastEditedTimestamp)
    }
}
