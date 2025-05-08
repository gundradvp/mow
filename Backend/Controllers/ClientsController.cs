using System;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MOWScheduler.Data;
using MOWScheduler.DTOs.Client;
using MOWScheduler.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MOWScheduler.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ClientsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public ClientsController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/Clients
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ClientReadDto>>> GetClients()
        {
            return await _context.Clients
                .Where(c => c.IsActive)
                .ProjectTo<ClientReadDto>(_mapper.ConfigurationProvider)
                .ToListAsync();
        }

        // GET: api/Clients/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ClientReadDto>> GetClient(int id)
        {
            var client = await _context.Clients
                .Include(c => c.ClientDietaryRestrictions).ThenInclude(cdr => cdr.DietaryRestriction)
                .Include(c => c.ClientEligibilityCriteria).ThenInclude(cec => cec.EligibilityCriterion)
                .Include(c => c.ServiceAuthorizations)
                .Include(c => c.CaseNotes)
                .Include(c => c.Route)
                .Include(c => c.ClientDeliverySchedules).ThenInclude(cds => cds.ScheduleDetails).ThenInclude(cdsd => cdsd.MealType)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (client == null)
            {
                return NotFound();
            }

            var clientDto = _mapper.Map<ClientReadDto>(client);
            return Ok(clientDto);
        }

        // GET: api/Clients/count
        [HttpGet("count")]
        public async Task<ActionResult<object>> GetClientsCount()
        {
            var count = await _context.Clients.CountAsync(c => c.IsActive);
            return Ok(new { count });
        }

        // POST: api/Clients
        [HttpPost]
        [Authorize(Roles = "Admin,Coordinator")]
        public async Task<ActionResult<ClientReadDto>> CreateClient(ClientCreateUpdateDto clientDto)
        {
            var client = _mapper.Map<Client>(clientDto);
            client.RegistrationDate = DateTime.UtcNow;

            await UpdateClientDietaryRestrictions(client, clientDto.DietaryRestrictionIds);
            await UpdateClientEligibilityCriteria(client, clientDto.EligibilityCriteriaIds);

            client.ServiceAuthorizations = _mapper.Map<List<ServiceAuthorization>>(clientDto.ServiceAuthorizations);
            client.ClientDeliverySchedules = _mapper.Map<List<ClientDeliverySchedule>>(clientDto.DeliverySchedules);

            _context.Clients.Add(client);
            await _context.SaveChangesAsync();

            var createdClientResult = await GetClient(client.Id);
            if (createdClientResult.Result is NotFoundResult)
            {
                return Problem("Failed to retrieve created client.");
            }

            var createdDto = (createdClientResult.Result as OkObjectResult)?.Value as ClientReadDto;
            if (createdDto == null)
            {
                return Problem("Failed to map created client to DTO.");
            }

            return CreatedAtAction(nameof(GetClient), new { id = client.Id }, createdDto);
        }

        // PUT: api/Clients/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Coordinator")]
        public async Task<IActionResult> UpdateClient(int id, ClientCreateUpdateDto clientDto)
        {
            var existingClient = await _context.Clients
                .Include(c => c.ClientDietaryRestrictions)
                .Include(c => c.ClientEligibilityCriteria)
                .Include(c => c.ServiceAuthorizations)
                .Include(c => c.ClientDeliverySchedules).ThenInclude(cds => cds.ScheduleDetails)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (existingClient == null)
            {
                return NotFound();
            }

            _mapper.Map(clientDto, existingClient);

            await UpdateClientDietaryRestrictions(existingClient, clientDto.DietaryRestrictionIds);
            await UpdateClientEligibilityCriteria(existingClient, clientDto.EligibilityCriteriaIds);
            await UpdateServiceAuthorizations(existingClient, clientDto.ServiceAuthorizations);
            await UpdateDeliverySchedules(existingClient, clientDto.DeliverySchedules);

            _context.Entry(existingClient).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ClientExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Clients/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteClient(int id)
        {
            var client = await _context.Clients.FindAsync(id);
            if (client == null)
            {
                return NotFound();
            }

            client.IsActive = false;
            _context.Entry(client).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ClientExists(int id)
        {
            return _context.Clients.Any(e => e.Id == id);
        }

        private async Task UpdateClientDietaryRestrictions(Client client, List<int> restrictionIds)
        {
            // Identify restrictions to remove
            var restrictionsToRemove = client.ClientDietaryRestrictions
                                             .Where(cdr => !restrictionIds.Contains(cdr.DietaryRestrictionId))
                                             .ToList(); // Materialize the list to avoid issues during removal

            // Remove them from the collection
            foreach (var restrictionToRemove in restrictionsToRemove)
            {
                client.ClientDietaryRestrictions.Remove(restrictionToRemove);
                // If using EF Core, you might need to explicitly mark them for deletion if they are tracked entities
                // _context.Entry(restrictionToRemove).State = EntityState.Deleted; // Or _context.Remove(restrictionToRemove);
            }

            var existingRestrictionIds = client.ClientDietaryRestrictions.Select(cdr => cdr.DietaryRestrictionId).ToList();
            var newIdsToAdd = restrictionIds.Except(existingRestrictionIds).ToList();

            foreach (var idToAdd in newIdsToAdd)
            {
                if (await _context.DietaryRestrictions.AnyAsync(dr => dr.Id == idToAdd))
                {
                    client.ClientDietaryRestrictions.Add(new ClientDietaryRestriction { ClientId = client.Id, DietaryRestrictionId = idToAdd });
                }
            }
        }

        private async Task UpdateClientEligibilityCriteria(Client client, List<int> criteriaIds)
        {
            // Identify criteria to remove
            var criteriaToRemove = client.ClientEligibilityCriteria
                                         .Where(cec => !criteriaIds.Contains(cec.EligibilityCriterionId))
                                         .ToList(); // Materialize the list

            // Remove them from the collection
            foreach (var criterionToRemove in criteriaToRemove)
            {
                client.ClientEligibilityCriteria.Remove(criterionToRemove);
                // If using EF Core, you might need to explicitly mark them for deletion if they are tracked entities
                // _context.Entry(criterionToRemove).State = EntityState.Deleted; // Or _context.Remove(criterionToRemove);
            }

            var existingCriteriaIds = client.ClientEligibilityCriteria.Select(cec => cec.EligibilityCriterionId).ToList();
            var newIdsToAdd = criteriaIds.Except(existingCriteriaIds).ToList();

            foreach (var idToAdd in newIdsToAdd)
            {
                if (await _context.EligibilityCriteria.AnyAsync(ec => ec.Id == idToAdd))
                {
                    client.ClientEligibilityCriteria.Add(new ClientEligibilityCriteria { ClientId = client.Id, EligibilityCriterionId = idToAdd });
                }
            }
        }

        private async Task UpdateServiceAuthorizations(Client client, List<ServiceAuthorizationDto> authorizationDtos)
        {
            _context.ServiceAuthorizations.RemoveRange(client.ServiceAuthorizations);
            client.ServiceAuthorizations = _mapper.Map<List<ServiceAuthorization>>(authorizationDtos);

            foreach (var auth in client.ServiceAuthorizations)
            {
                auth.ClientId = client.Id;
            }

            await Task.CompletedTask;
        }

        private async Task UpdateDeliverySchedules(Client client, List<ClientDeliveryScheduleDto> scheduleDtos)
        {
            var existingSchedules = client.ClientDeliverySchedules.ToList();
            foreach (var schedule in existingSchedules)
            {
                _context.ClientDeliveryScheduleDetails.RemoveRange(schedule.ScheduleDetails);
            }
            _context.ClientDeliverySchedules.RemoveRange(existingSchedules);

            client.ClientDeliverySchedules = _mapper.Map<List<ClientDeliverySchedule>>(scheduleDtos);

            foreach (var schedule in client.ClientDeliverySchedules)
            {
                schedule.ClientId = client.Id;
            }

            await Task.CompletedTask;
        }
    }
}