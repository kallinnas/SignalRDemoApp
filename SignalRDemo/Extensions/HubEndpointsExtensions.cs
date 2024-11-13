using SignalRDemo.HubConfig;

namespace SignalRDemo.Extensions;

public static class HubEndpointsExtensions
{
    public static IEndpointRouteBuilder MapSignalREndpoints(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapHub<ConnectionHub>("/ConnectionHub");
        endpoints.MapHub<RspGameHub>("/RspGameHub");
        return endpoints;
    }
}
