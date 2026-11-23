using Backend.Data;
using Backend.Models;
using Backend.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

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

    // GET /api/courses  (giriş yapmış herkes)
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var courses = await _db.Courses
            .AsNoTracking()
            .Select(c => new
            {
                c.Id,
                c.Code,
                c.Name,
                Day = c.Day.ToString(),
                StartTime = c.StartTime.ToString("HH:mm"),
                EndTime = c.EndTime.ToString("HH:mm"),
                c.Quota,
                Enrolled = c.Enrollments.Count
            })
            .ToListAsync();

        return Ok(courses);
    }

    // POST /api/courses  (yalnızca Admin)
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] CreateCourseDto dto)
    {
        if (dto.EndTime <= dto.StartTime)
            return BadRequest(new { message = "Bitiş saati başlangıç saatinden sonra olmalı." });

        if (await _db.Courses.AnyAsync(c => c.Code == dto.Code))
            return BadRequest(new { message = "Bu ders kodu zaten kayıtlı." });

        var course = new Course
        {
            Code = dto.Code,
            Name = dto.Name,
            Day = dto.Day,
            StartTime = dto.StartTime,
            EndTime = dto.EndTime,
            Quota = dto.Quota
        };

        _db.Courses.Add(course);
        await _db.SaveChangesAsync();

        return Ok(new { message = "Ders eklendi.", course.Id });
    }
}