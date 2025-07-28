using NetTopologySuite.Geometries;
using NetTopologySuite.IO;

namespace WebApplication1.Geometry
{
    public class LineGeometry
    {
        public LineString LineString { get; set; }

        public LineGeometry(string wkt)
        {
            var reader = new WKTReader();
            var geometry = reader.Read(wkt);

            if (geometry is not LineString lineString)
                throw new ArgumentException("The geometry must be of type LINESTRING.");

            LineString = lineString;
        }

        public double GetLengthKm()
        {
            var coords = LineString?.Coordinates;
            if (coords == null || coords.Length < 2)
                return 0;

            double total = 0;
            for (int i = 0; i < coords.Length - 1; i++)
            {
                double segment = HaversineKm(
                    coords[i].Y, coords[i].X,
                    coords[i + 1].Y, coords[i + 1].X
                );

                if (double.IsNaN(segment) || double.IsInfinity(segment))
                    continue;

                total += segment;
            }

            double result = Math.Round(total, 3);

            if (double.IsNaN(result) || double.IsInfinity(result))
                return 0;

            return result;
        }

        private double HaversineKm(double lat1, double lon1, double lat2, double lon2)
        {
            double R = 6371;
            double dLat = DegreesToRadians(lat2 - lat1);
            double dLon = DegreesToRadians(lon2 - lon1);
            double a =
                Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                Math.Cos(DegreesToRadians(lat1)) * Math.Cos(DegreesToRadians(lat2)) *
                Math.Sin(dLon / 2) * Math.Sin(dLon / 2);
            double c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
            return R * c;
        }

        private double DegreesToRadians(double deg) => deg * (Math.PI / 180);
    }
}
