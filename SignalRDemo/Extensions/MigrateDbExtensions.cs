using Microsoft.EntityFrameworkCore;
using SignalRDemo.Data;

namespace SignalRDemo.Extensions;

public static class MigrateDbExtensions
{
    public static IApplicationBuilder MigrateDatabase(this IApplicationBuilder app)
    {
        using (var scope = app.ApplicationServices.CreateScope())
        {
            var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            dbContext.Database.Migrate(); // Apply any pending migrations
        }

        return app;
    }
}
