using InvasionQc.Core.Alerting;
using InvasionQc.Core.FileDataLoader;
using Microsoft.Extensions.DependencyInjection;

namespace InvasionQc.Core;

public static class ModuleRegistration
{
    public static IServiceCollection AddInvasionQcCore(this IServiceCollection services)
    {
        services.AddMediatR(cfg => cfg.RegisterServicesFromAssemblies(CoreAssembly.Reference));

        services.AddSingleton<FileObservationsLoader>();

        services.AddSingleton<AlertRepositories>();

        return services;
    }
}
