using System;
using System.Collections.Generic;

namespace SignalRDemo.Models;

public partial class Connections
{
    public int Id { get; set; }

    public int PersonId { get; set; }

    public string SignalrId { get; set; } = null!;

    public DateTime? TimeStamp { get; set; }

    public virtual Person Person { get; set; } = null!;
}
