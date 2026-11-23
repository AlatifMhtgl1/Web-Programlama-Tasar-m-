using System.ComponentModel.DataAnnotations;

namespace Backend.Models.DTOs;

public class CreateCourseDto
{
    [Required]
    public string Code { get; set; } = string.Empty;

    [Required]
    public string Name { get; set; } = string.Empty;

    [Required]
    public DayOfWeek Day { get; set; }

    [Required]
    public TimeOnly StartTime { get; set; }

    [Required]
    public TimeOnly EndTime { get; set; }

    [Range(1, 500)]
    public int Quota { get; set; }
}