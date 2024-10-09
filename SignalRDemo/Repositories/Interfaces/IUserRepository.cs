using SignalRDemo.Models;

namespace SignalRDemo.Repositories.Interfaces;

public interface IUserRepository
{
    Task<User?> GetByIdAsync(Guid id);
    Task<UserRspPlayerDto?> GetUserRspPlayerAsync(Guid id);
    Task<UserRspPlayerDto?> UpdatePlayersResultAsync(Guid playerId, bool? isWinner);
}
