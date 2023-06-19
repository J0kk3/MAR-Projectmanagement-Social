using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Identity;
//Project Namespaces
using Domain;

public class AuthService
{
    private readonly IConfiguration _configuration;
    private readonly IPasswordHasher<AppUser> _passwordHasher;

    public AuthService(IConfiguration configuration, IPasswordHasher<AppUser> passwordHasher)
    {
        _configuration = configuration;
        _passwordHasher = passwordHasher;
    }

    public string HashPassword(AppUser user, string password)
    {
        return _passwordHasher.HashPassword(user, password);
    }

    public PasswordVerificationResult VerifyHashedPassword(AppUser user, string hashedPassword, string providedPassword)
    {
        return _passwordHasher.VerifyHashedPassword(user, hashedPassword, providedPassword);
    }

    public string GenerateJwt(AppUser user)
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(type: ClaimTypes.Name, value: user.DisplayName)
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.Now.AddDays(7),
            SigningCredentials = creds,
            Issuer = _configuration["Jwt:Issuer"]
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);

        return tokenHandler.WriteToken(token);
    }
}