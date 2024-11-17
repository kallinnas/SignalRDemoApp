namespace SignalRDemo.Extensions;

public static class CorsExtensions
{
    public static IServiceCollection AddAppCors(this IServiceCollection services, IConfiguration configuration)
    {
        var allowedOrigins = configuration["AllowedOrigins"]?.Split(",") ?? Array.Empty<string>();

        services.AddCors(options => options.AddPolicy("CorsPolicy", builder =>
        {
            builder.WithOrigins(allowedOrigins)
                   .AllowCredentials()
                   .AllowAnyHeader()
                   .AllowAnyMethod();
        }));

        return services;
    }
}

