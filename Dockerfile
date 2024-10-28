# 1. Use Node image to build Angular app
FROM node:16 AS angular-build
WORKDIR /app/signalr-demo
COPY ./signalr-demo .  # Copy only the Angular frontend folder
RUN npm install
RUN npm run build --prod  # builds to /app/signalr-demo/dist

# 2. Use .NET SDK image to build the backend
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS backend-build
WORKDIR /app

# Copy the backend project files
COPY ./SignalRDemo ./SignalRDemo

# Copy the solution file to the current working directory
COPY ./SignalRDemo/SignalRDemo.sln ./SignalRDemo/SignalRDemo.sln  # Correct path to solution file

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
