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
        var player1 = await _userRepository.GetByIdAsync(player1Id);
        var player2 = await _userRepository.GetByIdAsync(player2Id);

        if (player1 == null || player2 == null) { throw new Exception("Players not found."); }

        player1.RockPaperScissorsGameAmount++;
        player2.RockPaperScissorsGameAmount++;

        if (isWinner != null)
        {
            if ((bool)isWinner) { player1.RockPaperScissorsWinAmount++; }
            else { player2.RockPaperScissorsWinAmount++; }
        }

        await _userRepository.UpdateContext();
    }

    public async Task<User?> GetByIdAsync(Guid id)
    {
        return await _userRepository.GetByIdAsync(id);
    }
}
