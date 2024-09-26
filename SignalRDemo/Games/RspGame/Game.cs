using SignalRDemo.Models;

namespace SignalRDemo.Games.RspGame;

public class Game
{
    public UserRspPlayerDto Player1 { get; }
    public UserRspPlayerDto Player2 { get; }
    public bool Pending => Player1.Sign == null || Player2.Sign == null;

    public Game(UserRspPlayerDto player1, UserRspPlayerDto player2) { Player1 = player1; Player2 = player2; }

    public string? Winner
    {
        get
        {   // get{} allows use its logic block as regular field and add logic to calculate a value without changing the outer interface of the class.
            if (Pending) { throw new InvalidOperationException("Game not complete"); }

            return Signs.Beats(Player1.Sign!.Value, Player2.Sign!.Value) switch
            {   /* The switch expression allows a more concise way to map inputs to outputs */
                null => null,           // Draw
                true => Player1.Name,   // Player1 wins
                false => Player2.Name   // Player2 wins
            };
        }
    }

    public void Reset() // Resets players Throw and sets new achieved point before displaying score
    {
        if (Pending) { throw new InvalidOperationException("Game not complete"); }

        switch (Signs.Beats(Player1.Sign!.Value, Player2.Sign!.Value))
        {
            case true:
                {
                    Player1.RockPaperScissorsWinAmount++;
                    Player1.RockPaperScissorsGameAmount++;
                    break;
                }
            case false:
                {
                    Player2.RockPaperScissorsWinAmount++;
                    Player2.RockPaperScissorsGameAmount++;
                    break;
                }
            default: // Draw
                {
                    Player1.RockPaperScissorsGameAmount++;
                    Player2.RockPaperScissorsGameAmount++;
                    break;
                }
        }

        Player1.Sign = null;
        Player2.Sign = null;
    }

    public string Scores => $"{Player1.Name}: {Player1.RockPaperScissorsWinAmount}. {Player2.Name}: {Player2.RockPaperScissorsWinAmount}.";

    public string? WaitingFor => Player1.Sign == null ? Player1.Name : Player2.Name; // Displays opponents name during his Throw

    public string Explanation
    {
        get
        {
            if (Pending) { throw new InvalidOperationException("Game not complete"); }

            return Signs.Beats(Player1.Sign!.Value, Player2.Sign!.Value) switch
            {
                null => $"{Player1.Sign.Value} draws with {Player2.Sign.Value}",
                true => $"{Player1.Sign.Value} beats {Player2.Sign.Value}",
                false => $"{Player2.Sign.Value} beats {Player1.Sign.Value}"
            };
        }
    }

    public void Throw(string player, Sign selection)
    {
        if (player == Player1.Name) { Player1.Sign = selection; }
        else { Player2.Sign = selection; }
    }
}
