namespace backend.Models;

public class User
{
    public int Id { get; set; }
    public string AdSoyad { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string Rol { get; set; } = "Ogrenci"; // Admin | Akademisyen | Ogrenci
    public string? OgrenciNo { get; set; }
}
