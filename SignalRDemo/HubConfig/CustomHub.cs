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

        public async Task authMe(PersonDto personDto)
        {
            string signalrId = Context.ConnectionId;
            Person? person = await context.Person
                .Where(p => p.Username == personDto.Username && p.Password == personDto.Password)
                .SingleOrDefaultAsync();

            if (person != null)
            {
                Console.WriteLine("\n" + person.Name + " logged in" + "\nSignalrId: " + signalrId);

                Connections currentUser = new Connections
                {
                    PersonId = person.Id,
                    SignalrId = signalrId,
                    TimeStamp = DateTime.UtcNow
                };

                await context.Connections.AddAsync(currentUser);
                await context.SaveChangesAsync();

                await Clients.Caller.SendAsync("authMeResponseSuccess", new PersonDto(person.Name, person.Password));
            }

            else
            {
                await Clients.Caller.SendAsync("authMeResponseFail", signalrId);
            }
        }
    }
}
