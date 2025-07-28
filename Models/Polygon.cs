using NetTopologySuite.Geometries;
using System.Text.Json.Serialization;
using WebApplication1.Geometry;

namespace WebApplication1.Models
{
    public class Polygon
    {
        public int Id { get; set; }
        public string? Name { get; set; }

        [JsonIgnore]
        public NetTopologySuite.Geometries.Polygon? Geometry { get; set; }
        public double AreaKm2 { get; set; }
        public string? Wkt => Geometry?.AsText();
    }
}
