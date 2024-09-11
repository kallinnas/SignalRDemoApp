using Microsoft.AspNetCore.SignalR;

namespace SignalRDemo.HubConfig
{
    public class CustomHub : Hub
    {
        public async Task AskServer(string textFromClient)
        {
            string result = textFromClient == "Hey!" ? "msg was 'hey'" : "some else msg";
            await Clients.Client(this.Context.ConnectionId).SendAsync("AskServerResponse", result);
        }
    }
}
