# 1. Use Node image to build Angular app
FROM node:16 AS angular-build
WORKDIR /app/signalr-demo
COPY ./signalr-demo .  # Copy only the Angular frontend folder
RUN npm install
RUN npm run build --configuration production  # Build the Angular app for production

# 2. Use .NET SDK image to build the backend
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS backend-build
WORKDIR /app

# Copy the backend project files
COPY ./SignalRDemo ./SignalRDemo

# Copy the solution file directly to the working directory
COPY SignalRDemo/SignalRDemo.sln ./SignalRDemo.sln  # Correct path to solution file

# Copy Angular dist to .NET backend's wwwroot
RUN rm -rf /app/SignalRDemo/wwwroot/*  # Clear existing wwwroot files
COPY --from=angular-build /app/signalr-demo/dist /app/SignalRDemo/wwwroot  # Copy Angular build output

# Navigate to backend project folder, restore dependencies, and publish
WORKDIR /app/SignalRDemo
RUN dotnet restore
RUN dotnet publish -c Release -o out

# 3. Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS runtime
WORKDIR /app
COPY --from=backend-build /app/SignalRDemo/out .  # Copy the published app

# Expose port 80 for HTTP
EXPOSE 80

# Set the entry point to run the backend app
ENTRYPOINT ["dotnet", "SignalRDemo.dll"]
