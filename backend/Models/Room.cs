namespace backend.Models;

public class Room
{
    public int Id { get; set; }
    public string Ad { get; set; } = string.Empty;
    public int Kapasite { get; set; } = 40;
}
