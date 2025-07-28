using NetTopologySuite.Geometries;
using NetTopologySuite.IO;
using System;

namespace WebApplication1.Geometry
{
    public class PolygonGeometry
    {
        public Polygon Polygon { get; set; }

        public PolygonGeometry(string wkt)
        {
            var reader = new WKTReader();
            var geometry = reader.Read(wkt);

            if (geometry is not Polygon polygon)
                throw new ArgumentException("Geometry type must be Polygon.");

            if (polygon.NumPoints < 4 || polygon.NumPoints > 51) // The first and last points must be the same => min 4, max 11
                throw new ArgumentException("\r\nThe polygon must have at least 3 and at most 50 points.");

            Polygon = polygon;
        }

        public double GetAreaKm2()
        {
            try
            {
                var areaInDegrees = Polygon.Area;

                if (double.IsNaN(areaInDegrees) || double.IsInfinity(areaInDegrees))
                    return 0;

                double areaInKm2 = areaInDegrees * 111 * 111;

                if (double.IsNaN(areaInKm2) || double.IsInfinity(areaInKm2))
                    return 0;

                return Math.Round(areaInKm2, 4);
            }
            catch
            {
                return 0;
            }
        }

        public override string ToString()
        {
            var writer = new WKTWriter();
            return writer.Write(Polygon);
        }
    }
}
