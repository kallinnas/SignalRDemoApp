using Microsoft.EntityFrameworkCore;
using MySqlConnector;
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

    public async Task<UserRspPlayerDto?> UpdatePlayersResultAsync(Guid playerId, bool? isWinner)
    {
        string query = @"
        UPDATE users 
        SET RspGames = RspGames + 1, 
            RspWins = CASE WHEN @isWinner = 1 THEN RspWins + 1 ELSE RspWins END,
            RspDraws = CASE WHEN @isWinner IS NULL THEN RspDraws + 1 ELSE RspDraws END
        WHERE Id = @playerId";

        await _context.Database.ExecuteSqlRawAsync(query,
            new MySqlParameter("@isWinner", isWinner.HasValue ? (isWinner.Value ? 1 : 0) : DBNull.Value),
            new MySqlParameter("@playerId", playerId));

        await _context.SaveChangesAsync();

        return await GetUserRspPlayerAsync(playerId);
    }
}
