// filepath: c:\Users\Durga Vara Prasad\Desktop\MOW\Backend\Models\ClientEligibilityCriteria.cs
using System.ComponentModel.DataAnnotations;

namespace MOWScheduler.Models
{
    /// <summary>
    /// Represents the join table between Client and EligibilityCriterion.
    /// </summary>
    public class ClientEligibilityCriteria
    {
        [Key]
        public int Id { get; set; }

        public int ClientId { get; set; }
        public Client? Client { get; set; }

        public int EligibilityCriterionId { get; set; }
        public EligibilityCriterion? EligibilityCriterion { get; set; }
    }
}
