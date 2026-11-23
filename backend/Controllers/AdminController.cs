using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class AdminController : ControllerBase
{
    private readonly AppDbContext _db;

    public AdminController(AppDbContext db)
    {
        _db = db;
    }

    public record CreateCourseRequest(string Kod, string Ad, int AkademisyenId, int Kontenjan, string Gun, string Baslangic, string Bitis, string Derslik);
    public record CreateRoomRequest(string Ad, int Kapasite);

    [HttpPost("courses")]
    public async Task<IActionResult> CreateCourse([FromBody] CreateCourseRequest req)
    {
        var course = new Course
        {
            Kod = req.Kod.Trim(),
            Ad = req.Ad.Trim(),
            AkademisyenId = req.AkademisyenId,
            Kontenjan = req.Kontenjan,
            Saatler = new List<CourseSchedule>
            {
                new() { Gun = req.Gun, Baslangic = req.Baslangic, Bitis = req.Bitis, Derslik = req.Derslik }
            }
        };
        _db.Courses.Add(course);
        await _db.SaveChangesAsync();
        return Ok(course);
    }

    [HttpPost("rooms")]
    public async Task<IActionResult> CreateRoom([FromBody] CreateRoomRequest req)
    {
        var room = new Room { Ad = req.Ad.Trim(), Kapasite = req.Kapasite };
        _db.Rooms.Add(room);
        await _db.SaveChangesAsync();
        return Ok(room);
    }

    [HttpPost("exams/generate")]
    public async Task<IActionResult> GenerateExams()
    {
        var mevcutTaslaklar = await _db.ExamSessions.Where(e => e.Durum == "Taslak").ToListAsync();
        _db.ExamSessions.RemoveRange(mevcutTaslaklar);

        var dersler = await _db.Courses.Include(c => c.Kayitlar).ToListAsync();
        var salonlar = await _db.Rooms.ToListAsync();
        var oturumlar = new[] { "Pzt 09:00-11:00", "Pzt 13:00-15:00", "Sal 09:00-11:00", "Car 09:00-11:00" };

        var uretilen = new List<ExamSession>();
        for (int i = 0; i < dersler.Count; i++)
        {
            var d = dersler[i];
            var salon = salonlar.Count > 0 ? salonlar[i % salonlar.Count].Ad : "D-101";
            var session = new ExamSession
            {
                CourseId = d.Id,
                Tarih = "14.01.2027",
                Saat = "09:00 - 10:30",
                Oturum = oturumlar[i % oturumlar.Length],
                Salon = salon,
                Durum = "Taslak"
            };
            _db.ExamSessions.Add(session);
            uretilen.Add(session);
        }

        await _db.SaveChangesAsync();
        return Ok(new
        {
            exams = uretilen.Select((e, idx) => new
            {
                e.Id,
                dersKod = dersler[idx].Kod,
                dersAd = dersler[idx].Ad,
                e.Oturum,
                e.Salon,
                ogrenciSayisi = dersler[idx].Kayitlar.Count
            }),
            unplaced = Array.Empty<string>()
        });
    }

    [HttpPost("exams/publish")]
    public async Task<IActionResult> PublishExams()
    {
        var tumSinavlar = await _db.ExamSessions.ToListAsync();
        foreach (var s in tumSinavlar) s.Durum = "Yayında";
        await _db.SaveChangesAsync();
        return Ok(new { message = "Sınav planı yayınlandı." });
    }
}
