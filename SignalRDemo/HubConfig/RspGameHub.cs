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

    public async Task Register(Guid userId)
    {
        try
        {
            var user = await _gameService.GetByIdAsync(userId);

            if (user == null) { throw new Exception("User not found."); }

            var group = _manager.Register(user.Name);

            await Groups.AddToGroupAsync(Context.ConnectionId, group.Name);
            _connectedPlayers[Context.ConnectionId] = group.Name;

            if (group.Full)
            {
                await Clients.Group(group.Name).SendAsync("GameStarted", group.Game.Player1.Name, group.Game.Player2.Name, group.Name);
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
            var currentPlayerConnectionId = _connectedPlayers.FirstOrDefault(x => x.Value == groupName && x.Key != Context.ConnectionId).Key;

            if (currentPlayerConnectionId == null)
            {
                //await Register(player);
                await Clients.Group(groupName).SendAsync("PlayerDisconnected");
                return;
            }

            var game = _manager.Throw(groupName, player, Enum.Parse<Sign>(selection, true));

            if (game.Pending)
            { await Clients.Group(groupName).SendAsync("Pending", game.WaitingFor); }

            else
            {
                var player1 = _manager.GetGroupGamePlayers().player1;
                var player2 = _manager.GetGroupGamePlayers().player2;
                var isWinner = Signs.Beats(player1.Sign!.Value, player2.Sign!.Value);

                await _gameService.UpdateGameResultAsync(player1.Id, player2.Id, isWinner);

                var winner = game.Winner;
                var explanation = game.Explanation;

                game.Reset();

                if (winner == null)
                { await Clients.Group(groupName).SendAsync("Drawn", explanation, game.Scores); }

                else
                { await Clients.Group(groupName).SendAsync("Won", winner, explanation, game.Scores); }
            }
        }

        catch (Exception ex) { Console.WriteLine(ex); }
    }


}
