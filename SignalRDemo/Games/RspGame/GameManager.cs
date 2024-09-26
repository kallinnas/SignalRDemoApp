using SignalRDemo.Models;

namespace SignalRDemo.Games.RspGame;

public class GameManager
{
    private object _locker = new();
    private Dictionary<string, GameGroup> _games = new();
    private GameGroup? _waitingGroup;

    public (UserRspPlayerDto player1, UserRspPlayerDto player2) GetGroupGamePlayers()
    {
        return (_waitingGroup!.Player1!, _waitingGroup.Player2!);
    }

    public GameGroup Register(string name)
    {
        lock (_locker)
        {
            if (_waitingGroup == null)
            {
                _waitingGroup = new GameGroup();
                _games.TryAdd(_waitingGroup.Name, _waitingGroup);
            }

            _waitingGroup.AddPlayer(name);

            var retVal = _waitingGroup;

            if (_waitingGroup.Full)
                _waitingGroup = null;

            return retVal;
        }
    }

    public Game Throw(string groupName, string player, Sign sign)
    {
        lock (_locker)
        {
            var game = _games[groupName].Game;
            game.Throw(player, sign);
            return game;
        }
    }

    public void RemoveGameGroup(string groupName, string playerName)
    {
        lock (_locker)
        {
            if (_games.ContainsKey(groupName))
            {
                var group = _games[groupName];
                group.ResetGame();
                _games.Remove(groupName);
            }
        }
    }



}
