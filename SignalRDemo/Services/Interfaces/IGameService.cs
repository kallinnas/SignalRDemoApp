using SignalRDemo.Models;

namespace SignalRDemo.Services.Interfaces;

public interface IGameService
{
    Task UpdateGameResultAsync(Guid player1Id, Guid player2Id, bool? isWinner);
    Task<User?> GetByIdAsync(Guid id);
}
