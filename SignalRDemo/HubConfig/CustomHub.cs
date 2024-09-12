using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using SignalRDemo.Data;
using SignalRDemo.Models;

namespace SignalRDemo.HubConfig
{
    public class CustomHub : Hub
    {
        private readonly AppDbContext context;

        public CustomHub(AppDbContext context) { this.context = context; }

        public async Task AuthMe(PersonAuthDto dto)
        {
            string signalrId = Context.ConnectionId;
            Person? person = await context.Person
                .Where(p => p.Username == dto.Username && p.Password == dto.Password)
                .SingleOrDefaultAsync();

            if (person != null)
            {
                Connections connection = new Connections(person.Id, signalrId, DateTime.UtcNow);

                await context.Connections.AddAsync(connection);
                await context.SaveChangesAsync();

                await Clients.Caller.SendAsync("authorizationSuccess", new PersonRespDto(person.Id, person.Name, person.Username));
            }

            else
            {
                await Clients.Caller.SendAsync("authorizationFail", signalrId);
            }
        }

        public async Task ReAuthMe(int personId)
        {
            string signalrId = Context.ConnectionId;
            Person? person = await context.Person.Where(p => p.Id == personId).SingleOrDefaultAsync();

            if (person != null)
            {
                Connections connection = new Connections(person.Id, signalrId, DateTime.UtcNow);

                await context.Connections.AddAsync(connection);
                await context.SaveChangesAsync();

                await Clients.Caller.SendAsync("authorizationSuccess", new { person.Id, person.Name });
            }

            else
            {
                await Clients.Caller.SendAsync("authorizationFail", signalrId);
            }
        }
    }
}
