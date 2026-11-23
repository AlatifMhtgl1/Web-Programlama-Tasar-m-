using System.ComponentModel.DataAnnotations;

namespace Backend.Models.DTOs;

public class CreateEnrollmentDto
{
    [Required]
    public int CourseId { get; set; }
}