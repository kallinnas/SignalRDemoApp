using SignalRDemo.Games.RspGame;

namespace SignalRDemo.Models;

public partial class User
{
    public Guid Id { get; set; }
    public sbyte Role { get; set; }
    public string Name { get; set; } = "";
    public string Email { get; set; } = null!;
    public string PasswordHash { get; set; } = null!;
    public short BeerWinAmount { get; set; }
    public int BeerGameAmount { get; set; }
    public int RspWins { get; set; }
    public int RspDraws { get; set; }
    public int RspGames { get; set; }

    public virtual ICollection<Connection> Connections { get; set; } = new List<Connection>();
}

public class UserAuthDto
{
    public string Email { get; set; } = null!;
    public string Password { get; set; } = null!;
}

public class UserRegistrDto : UserAuthDto
{
    public string Name { get; set; } = null!;
}

public class UserSignalrDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;
    public string SignalrId { get; set; }
    public string? Token { get; set; }
    public UserSignalrDto(Guid id, string name, string signalrId)
    {
        Id = id; Name = name; SignalrId = signalrId;
    }
    public UserSignalrDto(Guid id, string name, string signalrId, string token)
    {
        Id = id; Name = name; SignalrId = signalrId; Token = token;
    }
}

public class UserRspPlayerDto
{
    public Guid Id { get; set; }
    public string? Name { get; }
    public Sign? Sign { get; set; }
    public int RspWins { get; set; }
    public int RspGames { get; set; }
    public int RspDraws { get; set; }

    public UserRspPlayerDto(Guid id, string name, int rspWins, int rspGames, int rspDraws)
    {
        Id = id; Name = name; RspWins = rspWins; RspGames = rspGames; RspDraws = rspDraws;
    }
}

public class TokenRequest
{
    public string Token { get; set; }
    public TokenRequest(string token) { Token = token; }
}