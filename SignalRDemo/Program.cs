using SignalRDemo.HubConfig;
using SignalRDemo.Repositories.Interfaces;
using SignalRDemo.Repositories;
using SignalRDemo.Services;
using SignalRDemo.Services.Interfaces;
using SignalRDemo.Extensions;
using Microsoft.EntityFrameworkCore;
using SignalRDemo.Data;

var builder = WebApplication.CreateBuilder(args);

// CORS
builder.Services.AddCors(options => options.AddPolicy("AllowAllHeaders", builder =>
{ builder.WithOrigins("https://mainportfolio-production-8e90.up.railway.app").AllowCredentials().AllowAnyHeader().AllowAnyMethod(); }));
//{ builder.WithOrigins("http://localhost:4200").AllowCredentials().AllowAnyHeader().AllowAnyMethod(); }));
//builder.Services.AddCors(options => options.AddPolicy("CorsPolicy", policy => policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader())); // before railway

// SIGNAL_R
builder.Services.AddSignalR(options => options.EnableDetailedErrors = true);

var connectionString = builder.Configuration.GetConnectionString("MySqlConnection");
builder.Services.AddDbContext<AppDbContext>(options => options.UseMySql(connectionString, ServerVersion.Parse("8.0.39-mysql")));
// MySQL Db
//builder.Services.AddMySqlDatabase(builder.Configuration);
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

// Apply pending migrations (for railway migration db)
//using (var scope = app.Services.CreateScope())
//{
//    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
//    dbContext.Database.Migrate(); // Apply any pending migrations
//}

app.UseCors("AllowAllHeaders");

app.UseHttpsRedirection();
app.UseStaticFiles(); // Serve wwwroot files (Angular dist)
app.UseRouting(); // before UseAuthorization()

app.UseAuthorization();
app.UseAuthorization();

app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
    endpoints.MapHub<ConnectionHub>("/ConnectionHub");
    endpoints.MapHub<RspGameHub>("/RspGameHub");
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
//
//
//
// UI:
// 1) npm i ngx-toastr
// and 
// importProvidersFrom(ToastrModule.forRoot(
// { enableHtml: true, timeOut: 10000, positionClass: 'toast-top-right', preventDuplicates: false})),
// 
// 2)routes
// 3) auth / home comps
// 4) service
// 5) Routes in app config: withPreloading(PreloadAllModules)
//
// /
// npm i @microsoft/signalr
// 
// for game install on UI: npm install ngx-signalr-websocket --save
//
//
// ?