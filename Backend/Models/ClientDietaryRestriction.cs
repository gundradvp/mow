// filepath: c:\Users\Durga Vara Prasad\Desktop\MOW\Backend\Models\ClientDietaryRestriction.cs
using System.ComponentModel.DataAnnotations;

namespace MOWScheduler.Models
{
    /// <summary>
    /// Represents the join table between Client and DietaryRestriction.
    /// </summary>
    public class ClientDietaryRestriction
    {
        [Key]
        public int Id { get; set; }

        public int ClientId { get; set; }
        public Client? Client { get; set; }

        public int DietaryRestrictionId { get; set; }
        public DietaryRestriction? DietaryRestriction { get; set; }
    }
}
