using System;
namespace SignalRDemo.Models;

public partial class Connections
{
    public Connections(int personId, string signalrId, DateTime? timeStamp)
    {
        PersonId = personId;
        SignalrId = signalrId;
        TimeStamp = timeStamp;
    }

    public int Id { get; set; }

    public int PersonId { get; set; }

    public string SignalrId { get; set; } = null!;

    public DateTime? TimeStamp { get; set; }

    public virtual Person Person { get; set; } = null!;
}
