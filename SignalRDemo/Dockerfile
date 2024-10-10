# Use the official .NET 6 SDK as a build environment
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build-env
WORKDIR /app

# Copy the project file and restore dependencies
COPY SignalRDemo.csproj ./
RUN dotnet restore

# Copy the remaining application files
COPY . ./
RUN dotnet publish -c Release -o out

# Use the official ASP.NET Core runtime for running the application
FROM mcr.microsoft.com/dotnet/aspnet:6.0
WORKDIR /app
COPY --from=build-env /app/out .

# Expose ports for HTTP and HTTPS
EXPOSE 80
EXPOSE 443

# Start the app
ENTRYPOINT ["dotnet", "SignalRDemo.dll"]
