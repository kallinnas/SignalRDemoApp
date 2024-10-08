using Microsoft.AspNetCore.SignalR;
using SignalRDemo.Games.RspGame;
using SignalRDemo.Services.Interfaces;

namespace SignalRDemo.HubConfig;

public class RspGameHub : Hub
{
    public static GameManager _manager = new();
    private static Dictionary<string, string> _connectedPlayers = new();
    private IGameService _gameService;

    public RspGameHub(IGameService gameService) { _gameService = gameService; }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        if (_connectedPlayers.TryGetValue(Context.ConnectionId, out var groupName))
        {
            _connectedPlayers.Remove(Context.ConnectionId);
            _manager.RemoveGameGroup(groupName, Context.ConnectionId);
            await Clients.Group(groupName).SendAsync("PlayerDisconnected");
        }

        await base.OnDisconnectedAsync(exception);
    }

    public async Task Register(string userId)
    {
        try
        {
            if (!Guid.TryParse(userId, out Guid guidUserId))
            {
                throw new Exception("Invalid userId format.");
            }

            var user = await _gameService.GetUserRspPlayerAsync(guidUserId);

            if (user == null) { throw new Exception("User not found."); }

            var group = _manager.Register(user);

            await Groups.AddToGroupAsync(Context.ConnectionId, group.Name);
            _connectedPlayers[Context.ConnectionId] = group.Name;

            if (group.Full)
            {
                await Clients.Group(group.Name).SendAsync("GameStarted", group.Game.Player1, group.Game.Player2, group.Name);
            }

            else
            {
                await Clients.Caller.SendAsync("WaitingForPlayer");
            }
        }

        catch (Exception ex) { Console.WriteLine(ex); }
    }

    public async Task Throw(string groupName, string player, string selection)
    {
        try
        {
            // Approve connection between users paired during Register()
            var currentPlayerConnectionId = _connectedPlayers.FirstOrDefault(x => x.Value == groupName && x.Key != Context.ConnectionId).Key;

            if (currentPlayerConnectionId == null)
            {
                await Clients.Group(groupName).SendAsync("PlayerDisconnected");
                return;
            }

            // Fills up game obg with throw-sign values to hold game state proccess
            var game = _manager.Throw(groupName, player, Enum.Parse<Sign>(selection, true));

            if (game.Pending) // Returns opponentsName and reports to first-move player about Pending state 
            { await Clients.Group(groupName).SendAsync("Pending", game.WaitingForOpponentsName); }

            else
            {   // Gets players to define a winner due Beats Sign schema
                var (player1, player2) = _manager.GetGroupGamePlayers(groupName);
                var isWinner = Signs.Beats(player1.Sign!.Value, player2.Sign!.Value);

                await _gameService.UpdateGameResultAsync(player1.Id, player2.Id, isWinner);

                var winner = game.Winner;

                if (winner == null)
                { await Clients.Group(groupName).SendAsync("Drawn", game.Explanation, game.Scores); }

                else
                { await Clients.Group(groupName).SendAsync("Won", winner, game.Explanation, player1, player2); }

                game.Reset();
            }
        }

        catch (Exception ex) { Console.WriteLine(ex); }
    }


}
