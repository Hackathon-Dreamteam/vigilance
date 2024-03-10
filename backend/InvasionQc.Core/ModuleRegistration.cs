using InvasionQc.Core.Advisory;
using InvasionQc.Core.Alerting;
using InvasionQc.Core.DataLoader;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace InvasionQc.Core;

public static class ModuleRegistration
{
    public static IServiceCollection AddInvasionQcCore(this IServiceCollection services,  IConfiguration configuration)
    {
        services.AddMediatR(cfg => cfg.RegisterServicesFromAssemblies(CoreAssembly.Reference));

        services.AddSingleton<FileObservationsLoader>();

        services.AddSingleton<AlertRepositories>();

        services.AddOptions<AdvisoryOptions>()
            .Bind(configuration.GetSection(AdvisoryOptions.SectionName));

        if(!string.IsNullOrEmpty(configuration[$"{AdvisoryOptions.SectionName}:{nameof(AdvisoryOptions.ApiKey)}"]))
        {
            services.AddSingleton<IAdvisor, OpenAiAdvisor>();
        }
        else
        {
            services.AddSingleton<IAdvisor, DumpAdvisor>();
        }

        return services;
    }
}
