namespace Backend.Models;

public class Enrollment
{
    public int Id { get; set; }
    public string StudentId { get; set; } = string.Empty;
    public int CourseId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ApplicationUser? Student { get; set; }
    public Course? Course { get; set; }
}
