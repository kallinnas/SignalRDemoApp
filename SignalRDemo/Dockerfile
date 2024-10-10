# Set the working directory inside the container
WORKDIR /app

# Copy the csproj and solution files first (for caching)
COPY *.csproj ./

# Run dotnet restore
RUN dotnet restore

# Copy the rest of the app files
COPY . ./
