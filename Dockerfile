# 1. Use Node image to build Angular app
FROM node:16 AS angular-build
WORKDIR /app/signalr-demo
COPY ./signalr-demo/package.json ./signalr-demo/package-lock.json ./
RUN npm install
COPY ./signalr-demo .  # Copy the rest of the Angular frontend folder
RUN npm run build --configuration production  # Builds to /app/signalr-demo/dist

# 2. Use .NET SDK image to build the backend
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS backend-build
WORKDIR /app

# Copy the backend project files
COPY ./SignalRDemo/SignalRDemo.sln ./SignalRDemo/  # Copy solution file into the right directory
COPY ./SignalRDemo/*.csproj ./SignalRDemo/  # Copy .csproj files (if any)
COPY ./SignalRDemo/ ./SignalRDemo/  # Copy the rest of the backend project files

# Copy Angular dist to .NET backend's wwwroot
RUN rm -rf /app/SignalRDemo/wwwroot/*
COPY --from=angular-build /app/signalr-demo/dist /app/SignalRDemo/wwwroot

# Navigate to backend project folder, restore dependencies, and publish
WORKDIR /app/SignalRDemo
RUN dotnet restore
RUN dotnet publish -c Release -o out

# 3. Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS runtime
WORKDIR /app
COPY --from=backend-build /app/SignalRDemo/out .

# Expose port 80 for HTTP
EXPOSE 80

# Set the entry point to run the backend app
ENTRYPOINT ["dotnet", "SignalRDemo.dll"]
