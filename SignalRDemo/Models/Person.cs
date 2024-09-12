namespace SignalRDemo.Models;

public class Person
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public string Username { get; set; } = null!;
    public string Password { get; set; } = null!;
    public virtual ICollection<Connections> Connections { get; set; } = new List<Connections>();
}

public class PersonSignalrDto : PersonDto
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public string SignalrConnectionId { get; set; }
    public PersonSignalrDto(int id, string name, string signalrConnectionId)
    {
        Id = id; Name = name; SignalrConnectionId = signalrConnectionId;
    }
}

public class PersonAuthDto : PersonDto
{
    public string Password { get; set; } = null!;
}

public class PersonDto
{
    public string Username { get; set; } = null!;
    public PersonDto() { }
}