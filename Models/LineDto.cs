namespace WebApplication1.Models
{
    public class LineDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public double LengthKm { get; set; }
        public string WKT { get; set; } = string.Empty;
    }
}
