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

            // Ensure migrations only apply if necessary
            if (!dbContext.Database.GetPendingMigrations().Any())
            {
                dbContext.Database.Migrate();
            }
        }

        return app;
    }
}
