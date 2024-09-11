using Microsoft.EntityFrameworkCore;
using SignalRDemo.Data;
using SignalRDemo.HubConfig;

var builder = WebApplication.CreateBuilder(args);

// CORS
builder.Services.AddCors(options => options.AddPolicy("AllowAllHeaders", builder =>
{ builder.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod(); }));
// SIGNAL_R
builder.Services.AddSignalR(options => options.EnableDetailedErrors = true);
// Configure DbContext with MySQL
var connectionString = builder.Configuration.GetConnectionString("MySqlConnection");
builder.Services.AddDbContext<AppDbContext>(options => options.UseMySql(connectionString, ServerVersion.Parse("8.0.39-mysql")));
// JsonSerializerOptions to handle object cycles
builder.Services.AddControllers().AddJsonOptions(options =>
        {
            options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.Preserve;
            options.JsonSerializerOptions.MaxDepth = 128;
        });

// Default container services.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();



var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseRouting(); // before UseAuthorization()

app.UseHttpsRedirection();
app.UseAuthorization();


app.UseCors("AllowAllHeaders");

// SIGNAL_R
app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
    endpoints.MapHub<CustomHub>("/customHub");
});

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
//
//
// /
// npm i @microsoft/signalr
// 
// ?