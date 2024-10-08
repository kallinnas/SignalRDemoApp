using SignalRDemo.Models;
using SignalRDemo.Repositories.Interfaces;
using SignalRDemo.Services.Interfaces;

namespace SignalRDemo.Services;

public class GameService : IGameService
{
    private readonly IUserRepository _userRepository;

    public GameService(IUserRepository userRepository) { _userRepository = userRepository; }

    public async Task UpdateGameResultAsync(Guid player1Id, Guid player2Id, bool? isWinner)
    {
        var player1 = await _userRepository.GetUserRspPlayerAsync(player1Id);
        var player2 = await _userRepository.GetUserRspPlayerAsync(player2Id);

        if (player1 == null || player2 == null) { throw new Exception("Players not found."); }

        player1.RspGames++;
        player2.RspGames++;

        if (isWinner != null)
        {
            if ((bool)isWinner) { player1.RspWins++; }
            else { player2.RspWins++; }
        }

        else
        {
            player1.RspDraws++;
            player2.RspDraws++;
        }

        await _userRepository.UpdateContext();
    }

    public async Task<User?> GetByIdAsync(Guid id) { return await _userRepository.GetByIdAsync(id); }

    public async Task<UserRspPlayerDto?> GetUserRspPlayerAsync(Guid id) { return await _userRepository.GetUserRspPlayerAsync(id); }
}
