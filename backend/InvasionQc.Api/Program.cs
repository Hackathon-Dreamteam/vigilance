using InvasionQc.Api;

var builder = WebApplication.CreateBuilder(args);

builder.RegisterDependencies();

var app = builder.Build();

app.ConfigureMiddleware();

app.Run();
