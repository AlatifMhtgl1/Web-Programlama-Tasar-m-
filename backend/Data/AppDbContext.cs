using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Course> Courses => Set<Course>();
    public DbSet<CourseSchedule> CourseSchedules => Set<CourseSchedule>();
    public DbSet<Enrollment> Enrollments => Set<Enrollment>();
    public DbSet<Room> Rooms => Set<Room>();
    public DbSet<ExamSession> ExamSessions => Set<ExamSession>();

    public static void SeedData(AppDbContext db)
    {
        db.Database.EnsureCreated();
        if (db.Users.Any()) return;

        var admin = new User
        {
            AdSoyad = "Sistem Yöneticisi",
            Email = "admin@kostu.edu.tr",
            PasswordHash = BCryptHash("Admin123"),
            Rol = "Admin"
        };
        var hoca = new User
        {
            AdSoyad = "Dr. Öğr. Üyesi Ahmet Kaya",
            Email = "hoca@kostu.edu.tr",
            PasswordHash = BCryptHash("Hoca1234"),
            Rol = "Akademisyen"
        };
        var ogrenci = new User
        {
            AdSoyad = "Ali Yılmaz",
            Email = "ogrenci@kostu.edu.tr",
            PasswordHash = BCryptHash("Ogrenci123"),
            Rol = "Ogrenci",
            OgrenciNo = "240502001"
        };

        db.Users.AddRange(admin, hoca, ogrenci);
        db.SaveChanges();

        var d1 = new Course
        {
            Kod = "BLM201",
            Ad = "Veri Yapıları",
            Kontenjan = 40,
            AkademisyenId = hoca.Id,
            Saatler = new List<CourseSchedule>
            {
                new() { Gun = "Pzt", Baslangic = "09:00", Bitis = "11:00", Derslik = "D-101" }
            }
        };
        var d2 = new Course
        {
            Kod = "YMH305",
            Ad = "Web Programlama",
            Kontenjan = 35,
            AkademisyenId = hoca.Id,
            Saatler = new List<CourseSchedule>
            {
                new() { Gun = "Pzt", Baslangic = "10:00", Bitis = "12:00", Derslik = "D-204" }
            }
        };
        var d3 = new Course
        {
            Kod = "YMH302",
            Ad = "Veritabanı Yönetim Sistemleri",
            Kontenjan = 45,
            AkademisyenId = hoca.Id,
            Saatler = new List<CourseSchedule>
            {
                new() { Gun = "Car", Baslangic = "09:00", Bitis = "11:00", Derslik = "D-105" }
            }
        };

        db.Courses.AddRange(d1, d2, d3);
        db.Rooms.AddRange(
            new Room { Ad = "D-101", Kapasite = 40 },
            new Room { Ad = "D-102", Kapasite = 35 },
            new Room { Ad = "B-201", Kapasite = 50 }
        );
        db.SaveChanges();

        db.Enrollments.Add(new Enrollment { StudentId = ogrenci.Id, CourseId = d1.Id });
        db.ExamSessions.Add(new ExamSession
        {
            CourseId = d1.Id,
            Tarih = "12.01.2027",
            Saat = "09:00 - 10:30",
            Oturum = "Pzt 09:00-11:00",
            Salon = "D-101",
            Durum = "Yayında"
        });
        db.SaveChanges();
    }

    public static string BCryptHash(string plain)
    {
        using var sha = System.Security.Cryptography.SHA256.Create();
        var bytes = sha.ComputeHash(System.Text.Encoding.UTF8.GetBytes(plain));
        return Convert.ToBase64String(bytes);
    }
}
