using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Ogrenci")]
public class ExamsController : ControllerBase
{
    private readonly AppDbContext _db;

    public ExamsController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet("my")]
    public async Task<IActionResult> GetMyExams()
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var kayitliDersIds = await _db.Enrollments
            .Where(e => e.StudentId == userId)
            .Select(e => e.CourseId)
            .ToListAsync();

        var sinavlar = await _db.ExamSessions
            .Include(x => x.Course)
            .Where(x => x.Durum == "Yayında" && kayitliDersIds.Contains(x.CourseId))
            .ToListAsync();

        var sira = 1;
        return Ok(sinavlar.Select(x => new
        {
            x.Id,
            dersKod = x.Course?.Kod ?? "",
            dersAd = x.Course?.Ad ?? "",
            x.Tarih,
            x.Saat,
            x.Salon,
            siraNo = sira++
        }));
    }
}
