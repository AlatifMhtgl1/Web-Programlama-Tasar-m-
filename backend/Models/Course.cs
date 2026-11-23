namespace backend.Models;

public class Course
{
    public int Id { get; set; }
    public string Kod { get; set; } = string.Empty;
    public string Ad { get; set; } = string.Empty;
    public int Kontenjan { get; set; } = 35;
    public int AkademisyenId { get; set; }
    public User? Akademisyen { get; set; }

    public List<CourseSchedule> Saatler { get; set; } = new();
    public List<Enrollment> Kayitlar { get; set; } = new();
}
