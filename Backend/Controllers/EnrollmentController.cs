using System.Security.Claims;
using Backend.Data;
using Backend.Models;
using Backend.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

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

    // GET /api/enrollments  (öğrenci kendi kayıtlarını görür)
    [HttpGet]
    public async Task<IActionResult> GetMine()
    {
        var studentId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        var items = await _db.Enrollments
            .AsNoTracking()
            .Where(e => e.StudentId == studentId)
            .Select(e => new
            {
                e.Id,
                e.CourseId,
                e.Course!.Code,
                e.Course.Name,
                Day = e.Course.Day.ToString(),
                StartTime = e.Course.StartTime.ToString("HH:mm"),
                EndTime = e.Course.EndTime.ToString("HH:mm")
            })
            .ToListAsync();

        return Ok(items);
    }

    // POST /api/enrollments
    [HttpPost]
    public async Task<IActionResult> Enroll([FromBody] CreateEnrollmentDto dto)
    {
        var studentId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (studentId == null)
            return Unauthorized();

        var course = await _db.Courses
            .Include(c => c.Enrollments)
            .FirstOrDefaultAsync(c => c.Id == dto.CourseId);

        if (course == null)
            return NotFound(new { message = "Ders bulunamadı." });

        // Kural 1: Aynı derse ikinci kez kayıt olamaz
        bool alreadyEnrolled = await _db.Enrollments
            .AnyAsync(e => e.StudentId == studentId && e.CourseId == course.Id);
        if (alreadyEnrolled)
            return BadRequest(new { message = "Bu derse zaten kayıtlısınız." });

        // Kural 2: Kontenjan kontrolü
        if (course.Enrollments.Count >= course.Quota)
            return BadRequest(new { message = "Bu dersin kontenjanı dolu." });

        // Kural 3: Saat çakışması kontrolü
        // Öğrencinin kayıtlı olduğu derslerden, aynı gün ve saat aralığı kesişen var mı?
        var conflict = await _db.Enrollments
            .Where(e => e.StudentId == studentId)
            .Select(e => e.Course!)
            .Where(c => c.Day == course.Day
                && c.StartTime < course.EndTime
                && course.StartTime < c.EndTime)
            .FirstOrDefaultAsync();

        if (conflict != null)
            return BadRequest(new { message = $"Saat çakışması var: {conflict.Code} ile aynı zaman aralığında." });

        _db.Enrollments.Add(new Enrollment
        {
            StudentId = studentId,
            CourseId = course.Id
        });
        await _db.SaveChangesAsync();

        return Ok(new { message = "Derse kayıt başarılı." });
    }

    // DELETE /api/enrollments/{id}  (kendi kaydını bırakır)
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Drop(int id)
    {
        var studentId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        var enrollment = await _db.Enrollments
            .FirstOrDefaultAsync(e => e.Id == id && e.StudentId == studentId);

        if (enrollment == null)
            return NotFound(new { message = "Kayıt bulunamadı." });

        _db.Enrollments.Remove(enrollment);
        await _db.SaveChangesAsync();

        return Ok(new { message = "Ders bırakıldı." });
    }
}