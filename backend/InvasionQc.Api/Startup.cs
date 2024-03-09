using InvasionQc.Api.OpenApi;

namespace InvasionQc.Api;

internal static class Startup
{
    internal static IHostApplicationBuilder RegisterDependencies(this IHostApplicationBuilder builder)
    {
        builder.Services.AddControllers();

        builder.Services.AddProblemDetails();

        builder.Services.AddOpenApi();

        return builder;
    }

    internal static WebApplication ConfigureMiddleware(this WebApplication app)
    {
        app.UseExceptionHandler();

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