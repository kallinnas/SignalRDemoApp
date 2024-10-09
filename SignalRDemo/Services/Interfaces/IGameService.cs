using SignalRDemo.Models;

namespace SignalRDemo.Services.Interfaces;

public interface IGameService
{
    Task<(UserRspPlayerDto?, UserRspPlayerDto?)> UpdateGameResultAsync(UserRspPlayerDto player1, UserRspPlayerDto player2, bool? isWinnerFirstPlayer);
    Task<User?> GetByIdAsync(Guid id);
    Task<UserRspPlayerDto?> GetUserRspPlayerAsync(Guid id);
}
