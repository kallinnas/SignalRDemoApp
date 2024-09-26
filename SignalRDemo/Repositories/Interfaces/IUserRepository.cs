using SignalRDemo.Models;

namespace SignalRDemo.Repositories.Interfaces;

public interface IUserRepository
{
    Task<User?> GetByIdAsync(Guid id);
    Task UpdateContext();
    //Task UpdateAsync(User user);
}
