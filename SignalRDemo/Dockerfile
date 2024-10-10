# Use the official ASP.NET Core image as the base image
FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

# Use the official .NET SDK image for the build process
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src

# Copy only the project file first (replace with your actual project file name)
COPY ["SignalRDemoApp/SignalRDemoApp.csproj", "SignalRDemoApp/"]

# Restore the dependencies
RUN dotnet restore "SignalRDemoApp/SignalRDemoApp.csproj"

# Copy the rest of the application files
COPY . .

# Set the working directory to the project folder
WORKDIR "/src/SignalRDemoApp"

# Build the project
RUN dotnet build "SignalRDemoApp.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "SignalRDemoApp.csproj" -c Release -o /app/publish

# Use the base image again for the final step
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

ENTRYPOINT ["dotnet", "SignalRDemoApp.dll"]
