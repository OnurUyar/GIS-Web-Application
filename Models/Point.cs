using System.Text.Json.Serialization;

namespace WebApplication1.Models
{
    public class Point
    {
        public int Id { get; internal set; }
        public string Name { get; set; } = string.Empty;
        public string WKT { get; set; } = string.Empty;
        public double Latitude { get; set; }
        public double Longitude { get; set; }

        [JsonIgnore]
        public NetTopologySuite.Geometries.Point? Geometry { get; set; } // NetTopologySuite.Geometries.Point
    }
}
