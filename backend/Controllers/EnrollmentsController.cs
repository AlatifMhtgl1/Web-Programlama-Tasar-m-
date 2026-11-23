using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Ogrenci")]
public class EnrollmentsController : ControllerBase
{
    private readonly AppDbContext _db;

    public EnrollmentsController(AppDbContext db)
    {
        _db = db;
    }

    public record EnrollRequest(int CourseId);

    [HttpPost]
    public async Task<IActionResult> Enroll([FromBody] EnrollRequest req)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var hedefDers = await _db.Courses
            .Include(c => c.Saatler)
            .Include(c => c.Kayitlar)
            .FirstOrDefaultAsync(c => c.Id == req.CourseId);

        if (hedefDers == null) return NotFound(new { message = "Ders bulunamadı." });

        if (hedefDers.Kayitlar.Any(k => k.StudentId == userId))
            return BadRequest(new { message = "Bu derse zaten kayıtlısınız." });

        if (hedefDers.Kayitlar.Count >= hedefDers.Kontenjan)
            return BadRequest(new { message = $"'{hedefDers.Kod}' dersinin kontenjanı dolu." });

        var mevcutDersler = await _db.Enrollments
            .Where(e => e.StudentId == userId)
            .Include(e => e.Course!)
            .ThenInclude(c => c.Saatler)
            .Select(e => e.Course!)
            .ToListAsync();

        foreach (var d in mevcutDersler)
        {
            foreach (var s1 in hedefDers.Saatler)
            {
                foreach (var s2 in d.Saatler)
                {
                    if (s1.Gun == s2.Gun &&
                        Dakika(s1.Baslangic) < Dakika(s2.Bitis) &&
                        Dakika(s2.Baslangic) < Dakika(s1.Bitis))
                    {
                        return BadRequest(new
                        {
                            message = $"Saat çakışması: '{hedefDers.Kod}' ({s1.Gun} {s1.Baslangic}-{s1.Bitis}), '{d.Kod}' ile çakışıyor."
                        });
                    }
                }
            }
        }

        _db.Enrollments.Add(new Enrollment { StudentId = userId, CourseId = hedefDers.Id });
        await _db.SaveChangesAsync();
        return Ok(new { message = "Derse kayıt olundu." });
    }

    [HttpDelete("{courseId:int}")]
    public async Task<IActionResult> Drop(int courseId)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var kayit = await _db.Enrollments
            .FirstOrDefaultAsync(e => e.StudentId == userId && e.CourseId == courseId);

        if (kayit == null) return NotFound(new { message = "Kayıt bulunamadı." });

        _db.Enrollments.Remove(kayit);
        await _db.SaveChangesAsync();
        return Ok(new { message = "Ders bırakıldı." });
    }

    private static int Dakika(string saatStr)
    {
        var parts = saatStr.Split(':');
        return int.Parse(parts[0]) * 60 + int.Parse(parts[1]);
    }
}
