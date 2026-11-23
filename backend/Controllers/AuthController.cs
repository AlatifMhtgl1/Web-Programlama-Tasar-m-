using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using backend.Data;
using backend.Models;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IConfiguration _config;

    public AuthController(AppDbContext db, IConfiguration config)
    {
        _db = db;
        _config = config;
    }

    public record RegisterRequest(string AdSoyad, string Email, string Password, string? OgrenciNo);
    public record LoginRequest(string Email, string Password);

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest req)
    {
        if (string.IsNullOrWhiteSpace(req.AdSoyad) ||
            string.IsNullOrWhiteSpace(req.Email) ||
            string.IsNullOrWhiteSpace(req.Password) ||
            req.Password.Length < 8)
        {
            return BadRequest(new { message = "Ad soyad, geçerli e-posta ve en az 8 karakterli şifre zorunludur." });
        }

        var emailNormalized = req.Email.Trim().ToLowerInvariant();
        if (await _db.Users.AnyAsync(u => u.Email.ToLower() == emailNormalized))
        {
            return Conflict(new { message = "Bu e-posta adresi zaten kayıtlı." });
        }

        var user = new User
        {
            AdSoyad = req.AdSoyad.Trim(),
            Email = emailNormalized,
            PasswordHash = AppDbContext.BCryptHash(req.Password),
            Rol = "Ogrenci",
            OgrenciNo = req.OgrenciNo
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        var token = GenerateJwt(user);
        return Ok(new
        {
            token,
            user = new { user.Id, user.AdSoyad, user.Email, user.Rol, user.OgrenciNo }
        });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest req)
    {
        var emailNormalized = req.Email.Trim().ToLowerInvariant();
        var hash = AppDbContext.BCryptHash(req.Password);

        var user = await _db.Users
            .FirstOrDefaultAsync(u => u.Email.ToLower() == emailNormalized && u.PasswordHash == hash);

        if (user == null)
        {
            return Unauthorized(new { message = "E-posta veya şifre hatalı." });
        }

        var token = GenerateJwt(user);
        return Ok(new
        {
            token,
            user = new { user.Id, user.AdSoyad, user.Email, user.Rol, user.OgrenciNo }
        });
    }

    private string GenerateJwt(User user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Name, user.AdSoyad),
            new Claim(ClaimTypes.Role, user.Rol)
        };

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
