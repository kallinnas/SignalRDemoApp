using SignalRDemo.Models;

namespace SignalRDemo.Games.RspGame;

public class GameGroup
{
    public UserRspPlayerDto? Player1;
    public UserRspPlayerDto? Player2;
    private Game? _game;

    public Game Game => _game ?? throw new InvalidOperationException("Game not created");
    public string Name { get; } = Guid.NewGuid().ToString();
    public bool Full => _game != null;
    public void Reset() => _game = null;

    public void AddPlayer(Guid id, string name)
    {
        if (Player1 == null)
        {
            Player1 = new UserRspPlayerDto(name) { Id = id };
        }
        else
        {
            Player2 = new UserRspPlayerDto(name) { Id = id };
            _game = new Game(Player1, Player2);
        }
    }

    public void ResetGame()
    {
        _game = null;
        Player1 = null;
        Player2 = null;
    }
}
