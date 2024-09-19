using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using SignalRDemo.Data;
using SignalRDemo.Models;
using SignalRDemo.Services;

namespace SignalRDemo.HubConfig;

public partial class ConnectionHub : Hub
{
    private readonly AppDbContext context;
    private readonly JwtService _jwtService;
    public ConnectionHub(AppDbContext context, JwtService jwtService)
    {
        this.context = context;
        _jwtService = jwtService;
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        try
        {
            var userId = await GetUserId();

            var connections = await context.Connections.Where(conn => conn.UserId == userId).ToListAsync();

            context.Connections.RemoveRange(connections);
            await context.SaveChangesAsync();

            await Clients.Others.SendAsync("User_Offline", userId);

            await base.OnDisconnectedAsync(exception);
        }

        catch (Exception ex)
        {
            Console.WriteLine(ex);
        }
    }

    public async Task Authentification(UserAuthDto dto)
    {
        try
        {
            var user = await context.Users.SingleOrDefaultAsync(p => p.Email == dto.Email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            {
                await Clients.Caller.SendAsync("Authentification_Fail", Context.ConnectionId);
            }

            else await Login(user, "Authentification_ResponseSuccess");
        }

        catch (Exception ex)
        {
            Console.WriteLine(ex);
        }
    }

    public async Task ReAuthentification(Guid userId)
    {
        try
        {
            var person = await context.Users.SingleOrDefaultAsync(u => u.Id == userId);

            if (person == null)
            {
                await Clients.Caller.SendAsync("Authentification_Fail", Context.ConnectionId);
            }

            else await Login(person, "ReAuthentification_ResponseSuccess");
        }

        catch (Exception ex)
        {
            Console.WriteLine(ex);
        }
    }

    public async Task Registration(UserRegistrDto dto)
    {
        try
        {
            if (context.Users.Any(u => u.Email == dto.Email))
            {
                await Clients.Caller.SendAsync("Registration_Fail", Context.ConnectionId);
            }

            var newUser = new User
            {
                Email = dto.Email,
                Name = dto.Name,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Role = (sbyte)(!context.Users.Any() ? 1 : 0) // first user becomes admin (Role = 1), others are customers (Role = 0)
            };

            context.Users.Add(newUser);
            context.SaveChanges();

            await Login(newUser, "Registration_ResponseSuccess");
        }

        catch (Exception ex)
        {
            Console.WriteLine(ex);
        }
    }

    private async Task Login(User user, string successMethod)
    {
        try
        {
            var signalrId = Context.ConnectionId;

            var connection = new Connection(user.Id, signalrId);
            await context.Connections.AddAsync(connection);
            await context.SaveChangesAsync();

            var userDto = new UserSignalrDto(user.Id, user.Name, signalrId, new TokenRequest(_jwtService.GenerateJwtToken(user)));
            await Clients.Caller.SendAsync(successMethod, userDto);
            await Clients.Others.SendAsync("User_Online", userDto);
        }

        catch (Exception ex)
        {
            Console.WriteLine(ex);
        }
    }

    public async Task LogoutUser(Guid userId)
    {
        try
        {
            var connection = await context.Connections.Where(c => c.UserId == userId).ToArrayAsync();
            context.Connections.RemoveRange(connection);
            await context.SaveChangesAsync();

            await Clients.Caller.SendAsync("Logout_Response");
            await Clients.Others.SendAsync("User_Offline", userId);
        }

        catch (Exception ex)
        {
            Console.WriteLine(ex);
        }
    }

    private async Task<Guid> GetUserId()
    {
        return await context.Connections.Where(c => c.SignalrId == Context.ConnectionId).Select(c => c.UserId).SingleOrDefaultAsync();
    }
}