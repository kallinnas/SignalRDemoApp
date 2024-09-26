using SignalRDemo.Data;
using SignalRDemo.Models;
using SignalRDemo.Repositories.Interfaces;

namespace SignalRDemo.Repositories;

public class UserRepository : IUserRepository
{
    private readonly AppDbContext _context;

    public UserRepository(AppDbContext context) { _context = context; }

    public async Task<User?> GetByIdAsync(Guid id) { return await _context.Users.FindAsync(id); }

    //public async Task UpdateAsync(User user)
    //{
    //    _context.Users.Update(user);
    //    await _context.SaveChangesAsync();
    //}

    public async Task UpdateContext() { await _context.SaveChangesAsync(); }
}
