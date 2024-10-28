# Use the .NET SDK image to build the application
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /app

# Copy the solution file and project files
COPY ./SignalRDemo/SignalRDemo.sln ./SignalRDemo/
COPY ./SignalRDemo/*.csproj ./SignalRDemo/

# Copy the rest of the server files
COPY ./SignalRDemo/ ./SignalRDemo/

# Restore dependencies
WORKDIR /app/SignalRDemo
RUN dotnet restore

# Build and publish the application
RUN dotnet publish -c Release -o out

# Create the runtime image
FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS runtime
WORKDIR /app

# Copy the published application from the build stage
COPY --from=build /app/SignalRDemo/out .

# Expose port 80 for the application
EXPOSE 80

# Set the entry point for the application
ENTRYPOINT ["dotnet", "SignalRDemo.dll"]
