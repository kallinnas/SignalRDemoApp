using SignalRDemo.HubConfig;

var builder = WebApplication.CreateBuilder(args);

// CORS
builder.Services.AddCors(options => options.AddPolicy("AllowAllHeaders", builder =>
{ builder.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod(); }));
// SIGNAL_R
builder.Services.AddSignalR(options => options.EnableDetailedErrors = true);

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
// 6) 
//
// npm i @microsoft/signalr
//
// ?