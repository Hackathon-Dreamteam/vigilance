using Microsoft.OpenApi.Models;

namespace InvasionQc.Api.OpenApi;

public static class OpenApiConfigureExtensions
{
    public static IServiceCollection AddOpenApi(this IServiceCollection services)
    {
        // Enable collecting endpoints metadata, it will be use by Swagger
        services.AddEndpointsApiExplorer();

        // Will generate a OpenAPI specification file
        services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo { Title = "La Belle Data", Version = "v1" });
        });
        return services;
    }

    public static IApplicationBuilder UseOpenApi(this WebApplication app)
    {
        // Add Swagger middleware that can generate the OpenApi Specification file
        app.UseSwagger();

        // Add Swagger UI middleware that provide a UI to display interactive documentation
        app.UseSwaggerUI();

        return app;
    }
}
