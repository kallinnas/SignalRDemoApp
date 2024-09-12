namespace SignalRDemo.Models;

public class Person
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public string Username { get; set; } = null!;
    public string Password { get; set; } = null!;
    public virtual ICollection<Connections> Connections { get; set; } = new List<Connections>();
}

public class PersonRespDto : PersonDto
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;

    public PersonRespDto(int id, string name, string username) { Id = id; Name = name; Username = username; }
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