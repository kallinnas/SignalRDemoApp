using SignalRDemo.Models;
using SignalRDemo.Repositories.Interfaces;
using SignalRDemo.Services.Interfaces;

namespace SignalRDemo.Services;

public class GameService : IGameService
{
    private readonly IUserRepository _userRepository;

    public GameService(IUserRepository userRepository) { _userRepository = userRepository; }

    public async Task<(UserRspPlayerDto?, UserRspPlayerDto?)> UpdateGameResultAsync(UserRspPlayerDto player1, UserRspPlayerDto player2, bool? isWinnerFirstPlayer)
    {
        var updatePlayer1 = await _userRepository.UpdatePlayersResultAsync(player1.Id, isWinnerFirstPlayer);
        var updatePlayer2 = await _userRepository.UpdatePlayersResultAsync(player2.Id, !isWinnerFirstPlayer);

        updatePlayer1!.Sign = player1.Sign;
        updatePlayer2!.Sign = player2.Sign;

        return (updatePlayer1, updatePlayer2);
    }

    public async Task<User?> GetByIdAsync(Guid id) { return await _userRepository.GetByIdAsync(id); }

    public async Task<UserRspPlayerDto?> GetUserRspPlayerAsync(Guid id) { return await _userRepository.GetUserRspPlayerAsync(id); }
}
