namespace WebApplication1.Models.Dto
{
    public class PolygonDto
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public double AreaKm2 { get; set; }
        public string? Wkt { get; set; }
    }
}
