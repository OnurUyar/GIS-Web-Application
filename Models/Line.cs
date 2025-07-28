using NetTopologySuite.Geometries;

namespace WebApplication1.Models
{
    public class Line
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public LineString? Geometry { get; set; }
        public double? LengthKm { get; set; }
    }
}
