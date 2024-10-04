using Microsoft.EntityFrameworkCore;
using SignalRDemo.Data;
using SignalRDemo.Models;
using SignalRDemo.Repositories.Interfaces;

namespace SignalRDemo.Repositories;

public class UserRepository : IUserRepository
{
    private readonly AppDbContext _context;

    public UserRepository(AppDbContext context) { _context = context; }

    public async Task<User?> GetByIdAsync(Guid id) { return await _context.Users.FindAsync(id); }

    public async Task<UserRspPlayerDto?> GetUserRspPlayerAsync(Guid id)
    {
        return await _context.Users
            .Where(u => u.Id == id)
            .Select(u => new UserRspPlayerDto(u.Id, u.Name, u.RspWins, u.RspGames, u.RspDraws))
            .FirstOrDefaultAsync();
    }

    public async Task UpdateContext() { await _context.SaveChangesAsync(); }
}
