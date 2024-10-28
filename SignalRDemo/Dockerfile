# Use official .NET SDK for building the app
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /app

# Install dotnet-ef tool
RUN dotnet tool install --global dotnet-ef
ENV PATH="$PATH:/root/.dotnet/tools"

# Copy everything
COPY . ./

# Restore dependencies
RUN dotnet restore

# Build the application
RUN dotnet publish -c Release -o out --no-restore

# Use official .NET runtime for running the app
FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS runtime
WORKDIR /app

# Copy the published files from the build step
COPY --from=build /app/out ./

# Expose port
EXPOSE 80 443

# Run the application
ENTRYPOINT ["dotnet", "SignalRDemo.dll"]
