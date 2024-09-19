using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using SignalRDemo.Models;

namespace SignalRDemo.HubConfig;

public partial class ConnectionHub
{
    public async Task GetOnlineUsers()
    {
        var userId = await GetUserId();

        var onlineUsers = await context.Connections
            .Where(c => c.UserId != userId)
            .Select(c => new UserSignalrDto(c.UserId,
                context.Users.Where(p => p.Id == c.UserId)
                .Select(p => p.Name ?? "Unknown").SingleOrDefault() ?? "Unknown", c.SignalrId))
            .ToListAsync();

        await Clients.Caller.SendAsync("GetOnlineUsers_Response", onlineUsers);
    }
}