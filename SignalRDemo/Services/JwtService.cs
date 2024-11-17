using Microsoft.IdentityModel.Tokens;
using SignalRDemo.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace SignalRDemo.Services;

public class JwtService
{
    private readonly IConfiguration _configuration;
    private readonly IHostEnvironment _env;
    public JwtService(IConfiguration configuration, IHostEnvironment env) { _configuration = configuration; _env = env; }

    public string GenerateJwtToken(User user)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(GetJwtKey());
        
        //var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]!); - was used when Jwt:Key was set in appsettings

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Name.ToString()),
                new Claim(ClaimTypes.Role, user.Role.ToString())
            }),

            Expires = DateTime.UtcNow.AddHours(1),
            Issuer = _configuration["Jwt:Issuer"],
            Audience = _configuration["Jwt:Audience"],
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }

    public bool ValidateToken(string token)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(GetJwtKey());

        try
        {
            var validationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = _configuration["Jwt:Issuer"],
                ValidAudience = _configuration["Jwt:Audience"],
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ClockSkew = TimeSpan.Zero
            };

            SecurityToken validatedToken;
            var principal = tokenHandler.ValidateToken(token, validationParameters, out validatedToken);

            var userIdClaim = principal.FindFirst(ClaimTypes.NameIdentifier);

            if (userIdClaim != null)
            {
                return true;
            }

            return false;
        }

        catch (Exception)
        {
            return false;
        }
    }

    public ClaimsPrincipal? GetUserFromToken(string token)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(GetJwtKey());

        try
        {
            var validationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = _configuration["Jwt:Issuer"],
                ValidAudience = _configuration["Jwt:Audience"],
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ClockSkew = TimeSpan.Zero
            };

            SecurityToken validatedToken;
            var principal = tokenHandler.ValidateToken(token, validationParameters, out validatedToken);

            return principal;
        }
        catch (Exception)
        {
            return null;
        }
    }

    public User? GetUserInfoFromToken(string token)
    {
        var principal = GetUserFromToken(token);

        if (principal != null)
        {
            var userIdClaim = principal.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var emailClaim = principal.FindFirst(ClaimTypes.Email)?.Value;
            var nameClaim = principal.FindFirst(ClaimTypes.Name)?.Value;
            var roleClaim = principal.FindFirst(ClaimTypes.Role)?.Value;

            if (userIdClaim != null && emailClaim != null && roleClaim != null)
            {
                return new User
                {
                    Id = Guid.Parse(userIdClaim),
                    Email = emailClaim,
                    Name = nameClaim!,
                    Role = sbyte.Parse(roleClaim)
                };
            }
        }

        return null;
    }

    private string GetJwtKey()
    {
        if (_env.IsProduction())
        {
            return Environment.GetEnvironmentVariable("JWT_KEY") ??
                   throw new InvalidOperationException("JWT_KEY environment variable is missing");
        }

        return _configuration["Jwt:Key"] ??
               throw new InvalidOperationException("JWT_KEY setting is missing from appsettings.json");
    }
}

