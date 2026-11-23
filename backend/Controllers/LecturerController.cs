using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Akademisyen")]
public class LecturerController : ControllerBase
{
    private readonly AppDbContext _db;

    public LecturerController(AppDbContext db)
    {
        _db = db;
    }

    public record PreferenceRequest(int CourseId, string Preference);

    [HttpGet("courses")]
    public async Task<IActionResult> GetCourses()
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var dersler = await _db.Courses
            .Where(c => c.AkademisyenId == userId)
            .Include(c => c.Kayitlar)
            .ThenInclude(k => k.Student)
            .ToListAsync();

        return Ok(dersler.Select(c => new
        {
            c.Id,
            c.Kod,
            c.Ad,
            c.Kontenjan,
            ogrenciler = c.Kayitlar
                .Where(k => k.Student != null)
                .Select(k => new { k.Student!.Id, k.Student.AdSoyad, k.Student.OgrenciNo })
        }));
    }

    [HttpGet("exams")]
    public async Task<IActionResult> GetExams()
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var sinavlar = await _db.ExamSessions
            .Include(e => e.Course)
            .Where(e => e.Durum == "Yayında" && e.Course != null && e.Course.AkademisyenId == userId)
            .ToListAsync();

        return Ok(sinavlar.Select(e => new
        {
            e.Id,
            dersKod = e.Course!.Kod,
            dersAd = e.Course.Ad,
            e.Tarih,
            e.Saat,
            salonlar = e.Salon,
            gozetmenMi = false
        }));
    }

    [HttpPost("exam-preference")]
    public IActionResult SavePreference([FromBody] PreferenceRequest req)
    {
        return Ok(new { message = $"Tercih alındı: {req.Preference}" });
    }
}
