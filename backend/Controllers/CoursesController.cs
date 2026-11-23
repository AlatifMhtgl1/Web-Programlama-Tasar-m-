using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CoursesController : ControllerBase
{
    private readonly AppDbContext _db;

    public CoursesController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> GetCourses()
    {
        var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        int.TryParse(userIdStr, out var userId);

        var courses = await _db.Courses
            .Include(c => c.Akademisyen)
            .Include(c => c.Saatler)
            .Include(c => c.Kayitlar)
            .ToListAsync();

        var result = courses.Select(c => new
        {
            c.Id,
            c.Kod,
            c.Ad,
            akademisyen = c.Akademisyen?.AdSoyad ?? "Atanmadı",
            c.Kontenjan,
            kayitliSayisi = c.Kayitlar.Count,
            kayitliMi = c.Kayitlar.Any(k => k.StudentId == userId),
            saatler = c.Saatler.Select(s => new { s.Gun, s.Baslangic, s.Bitis, s.Derslik })
        });

        return Ok(new
        {
            enrollmentOpen = true,
            termInfo = "2026-2027 Güz Dönemi (Kayıt Açık)",
            courses = result
        });
    }
}
