using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

namespace MOWScheduler.Models
{
    public class EligibilityCriterion
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string CriteriaName { get; set; } = string.Empty;

        public string? Description { get; set; }

        /// <summary>
        /// Gets or sets the collection of client associations.
        /// </summary>
        public ICollection<ClientEligibilityCriteria> ClientEligibilityCriteria { get; set; } = new List<ClientEligibilityCriteria>();
    }
}