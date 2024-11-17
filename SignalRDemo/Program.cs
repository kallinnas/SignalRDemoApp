using SignalRDemo.Repositories.Interfaces;
using SignalRDemo.Repositories;
using SignalRDemo.Services;
using SignalRDemo.Services.Interfaces;
using SignalRDemo.Extensions;

var builder = WebApplication.CreateBuilder(args);

// CORS
builder.Services.AddAppCors(builder.Configuration);

// SIGNAL_R
builder.Services.AddSignalR(options => options.EnableDetailedErrors = true);

// MySQL Db
builder.Services.AddMySqlDatabase(builder.Configuration);
builder.Services.AddScoped<JwtService>();

// Default container services.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddScoped<IGameService, GameService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MigrateDatabase(); // Apply pending migrations (for railway migration db)

app.UseCors("CorsPolicy");

app.UseHttpsRedirection();
app.UseStaticFiles(); // Serve wwwroot files (Angular dist)
app.UseRouting(); // before UseAuthorization()

app.UseAuthorization();

app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
    endpoints.MapSignalREndpoints(); // Mapping SignalR hubs using the extensions
});

app.MapFallbackToFile("index.html"); // fallback for SPA called after app.UseEndpoints

app.Run();




// 1) Dependency: AspnetCore.SignalR.Common
// 2) Create dir HubConfig => CustomHub.cs => impl :Hub interface
// 3) launchSettings: rm { IIS Express } & { SignalRDemo: "launchBrowser": false } 
// 4) Add to services of Program.cs: Cors, SignalR before AddControllers()
// 5) Add to middleware of Program: UseRouting, UseCors, UseEndpoints
// 6) Scaffolding for models
// 7) Remove empty constructor from context
// 8)
//
// UI:
// 1) set routes
// 2) auth / home comps
// 3) service
// 4) app config: withPreloading(PreloadAllModules)
// 5) npm i @microsoft/signalr
// 6) npm install ngx-signalr-websocket --save
// 
// 
