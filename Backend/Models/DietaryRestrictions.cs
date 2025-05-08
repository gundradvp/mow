using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

namespace MOWScheduler.Models
{
    public class DietaryRestriction
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string RestrictionName { get; set; } = string.Empty;

        public string? Description { get; set; }

        /// <summary>
        /// Gets or sets the collection of client associations.
        /// </summary>
        public ICollection<ClientDietaryRestriction> ClientDietaryRestrictions { get; set; } = new List<ClientDietaryRestriction>();
    }
}