using System.Text.Json.Serialization;
using InvasionQc.Api.OpenApi;
using InvasionQc.Core;

namespace InvasionQc.Api;

internal static class Startup
{
    internal static IHostApplicationBuilder RegisterDependencies(this IHostApplicationBuilder builder)
    {
        builder.Services.AddControllers()
            .AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
            });
        builder.Services.AddProblemDetails();
        builder.Services.AddOpenApi();

        builder.Services.AddInvasionQcCore();

        builder.Services.AddResponseCompression(options =>
        {
            options.EnableForHttps = true;
        });

        return builder;
    }

    internal static WebApplication ConfigureMiddleware(this WebApplication app)
    {
        app.UseResponseCompression();
        app.UseExceptionHandler();
        app.UseCors(x => x.AllowAnyOrigin());
        app.UseStatusCodePages();

        if (app.Environment.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
        }

        app.UseOpenApi();
        app.MapControllers();

        return app;
    }
}
