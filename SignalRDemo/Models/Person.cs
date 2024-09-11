namespace SignalRDemo.Models;

public class Person
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public string Username { get; set; } = null!;
    public string Password { get; set; } = null!;
    public virtual ICollection<Connections> Connections { get; set; } = new List<Connections>();
}

public class PersonDto
{
    public string Username { get; set; } = null!;
    public string Password { get; set; } = null!;

    public PersonDto() { }
    public PersonDto(string username, string password) { Username = username; Password = password; }
}
