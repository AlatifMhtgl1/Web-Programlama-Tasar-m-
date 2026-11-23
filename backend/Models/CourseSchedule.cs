namespace backend.Models;

public class CourseSchedule
{
    public int Id { get; set; }
    public int CourseId { get; set; }
    public Course? Course { get; set; }

    public string Gun { get; set; } = "Pzt"; // Pzt, Sal, Car, Per, Cum
    public string Baslangic { get; set; } = "09:00";
    public string Bitis { get; set; } = "11:00";
    public string Derslik { get; set; } = "D-101";
}
