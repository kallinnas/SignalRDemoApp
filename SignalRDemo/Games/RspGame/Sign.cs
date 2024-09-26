namespace SignalRDemo.Games.RspGame;

public enum Sign { Rock, Paper, Scissors }

public static class Signs
{
    // Rock-Paper-Scissors game using a 2D array _beats to define who wins and who loses for each combination of signs
    static readonly private bool?[,] _beats = new bool?[,]
    {
        { null, false, true },  // Rock: loses to Paper, beats Scissors
        { true, null, false },  // Paper: beats Rock, loses to Scissors
        { false, true, null }   // Scissors: loses to Rock, beats Paper
    };

    // by converting the Sign enums to their integer equivalents corresponds to the indices of the _beats array
    public static bool? Beats(Sign s1, Sign s2) => _beats[(int)s1, (int)s2];
}
