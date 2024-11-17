using Microsoft.EntityFrameworkCore;
using SignalRDemo.Data;

public static class MySqlDbExtensions
{
    public static IServiceCollection AddMySqlDatabase(this IServiceCollection services, IConfiguration configuration)
    {
        string? mySqlConnectionString = Environment.GetEnvironmentVariable("SIGNALR_MYSQL_CONNECTION_STRING")
                                         ?? configuration.GetConnectionString("MySqlConnection");

        if (string.IsNullOrEmpty(mySqlConnectionString))
        {
            throw new InvalidOperationException("The connection string 'MySqlConnection' was not found.");
        }

        services.AddDbContext<AppDbContext>(options =>
            options.UseMySql(mySqlConnectionString, new MySqlServerVersion(new Version(8, 0, 21)),
                mysqlOptions => mysqlOptions.EnableRetryOnFailure()));

        return services;
    }
}
