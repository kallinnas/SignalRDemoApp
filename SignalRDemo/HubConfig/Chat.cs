using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using SignalRDemo.Models;

namespace SignalRDemo.HubConfig;

public partial class CustomHub
{
    public async Task getOnlinePersons()
    {
        var personId = context.Connections
            .Where(c => c.SignalrId == Context.ConnectionId)
            .Select(c => c.PersonId)
            .SingleOrDefault();

        if (personId != 0)
        {
            var onlinePersons = await context.Connections
                .Where(c => c.PersonId != personId)
                .Select(c => new PersonSignalrDto(c.PersonId,
                    context.Person.Where(p => p.Id == c.PersonId)
                    .Select(p => p.Name ?? "Unknown").SingleOrDefault() ?? "Unknown", c.SignalrId))
                .ToListAsync();

            await Clients.Caller.SendAsync("getOnlinePersonsResponse", onlinePersons);
        }
    }
}