using SignalRDemo.Models;

namespace SignalRDemo.Games.RspGame;

public class GameManager
{
    private object _locker = new();
    private Dictionary<string, GameGroup> _games = new();
    private GameGroup? _waitingGroup;

    public (UserRspPlayerDto player1, UserRspPlayerDto player2) GetGroupGamePlayers(string groupName)
    {
        // Check if the game group exists in the dictionary
        if (_games.TryGetValue(groupName, out var gameGroup))
        {
            // Ensure that both players exist in the game group
            if (gameGroup.Player1 != null && gameGroup.Player2 != null)
            {
                return (gameGroup.Player1, gameGroup.Player2);
            }
            else
            {
                throw new InvalidOperationException("Both players are not available in the game group.");
            }
        }
        else
        {
            throw new KeyNotFoundException($"No game group found with the name: {groupName}");
        }
    }

    //public GameGroup Register(Guid userId, string name)
    public GameGroup Register(UserRspPlayerDto user)
    {
        lock (_locker)
        {
            if (_waitingGroup == null)
            {
                _waitingGroup = new GameGroup();
                _games.TryAdd(_waitingGroup.Name, _waitingGroup);
            }

            _waitingGroup.AddPlayer(user);

            if (_waitingGroup.Full)
            {
                var group = _waitingGroup;
                _waitingGroup = null;
                return group;
            }

            return _waitingGroup;
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
