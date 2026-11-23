namespace backend.Models;

public class ExamSession
{
    public int Id { get; set; }
    public int CourseId { get; set; }
    public Course? Course { get; set; }

    public string Tarih { get; set; } = "14.01.2027";
    public string Saat { get; set; } = "09:00 - 10:30";
    public string Oturum { get; set; } = "Pzt 09:00-11:00";
    public string Salon { get; set; } = "D-101";
    public string Durum { get; set; } = "Taslak"; // Taslak | Yayında
}
