using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using SignalRDemo.Data;
using SignalRDemo.Models;

namespace SignalRDemo.HubConfig
{
    public partial class CustomHub : Hub
    {
        private readonly AppDbContext context;

        public CustomHub(AppDbContext context) { this.context = context; }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var personId = context.Connections
                .Where(c => c.SignalrId == Context.ConnectionId)
                .Select(c => c.PersonId).SingleOrDefault();

            if (personId != 0)
            {
                var connections = context.Connections.Where(p => p.PersonId == personId).ToList();
                context.Connections.RemoveRange(connections);
                await context.SaveChangesAsync();

                await Clients.Others.SendAsync("personOff", personId);
            }

            await base.OnDisconnectedAsync(exception);
        }

        public async Task AuthMe(PersonAuthDto dto)
        {
            var person = await context.Person
                .SingleOrDefaultAsync(p => p.Username == dto.Username && p.Password == dto.Password);

            if (person == null)
            {
                await Clients.Caller.SendAsync("authorizationFail", Context.ConnectionId);
            }

            else await Login(person);
        }

        public async Task ReAuthMe(int personId)
        {
            var person = await context.Person.Where(p => p.Id == personId).SingleOrDefaultAsync();

            if (person == null)
            {
                await Clients.Caller.SendAsync("authorizationFail", Context.ConnectionId);
            }

            else await Login(person);

        }

        private async Task Login(Person person)
        {
            var signalrId = Context.ConnectionId;
            var connection = new Connections(person.Id, signalrId, DateTime.UtcNow);
            await context.Connections.AddAsync(connection);
            await context.SaveChangesAsync();

            var personDto = new PersonSignalrDto(person.Id, person.Name, signalrId);
            await Clients.Caller.SendAsync("authorizationSuccess", personDto);
            await Clients.Others.SendAsync("personOn", personDto);
        }

        public async Task Logout(int personId)
        {
            var connections = context.Connections.Where(p => p.PersonId == personId).ToList();
            context.Connections.RemoveRange(connections);
            await context.SaveChangesAsync();

            await Clients.Caller.SendAsync("logoutResponse");
            await Clients.Others.SendAsync("personOff", personId);
        }
    }
}
