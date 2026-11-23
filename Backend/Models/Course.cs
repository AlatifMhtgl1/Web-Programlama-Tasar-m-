namespace Backend.Models;

public class Course
{
    public int Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public DayOfWeek Day { get; set; }
    public TimeOnly StartTime { get; set; }
    public TimeOnly EndTime { get; set; }
    public int Quota { get; set; }

    public ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();
}