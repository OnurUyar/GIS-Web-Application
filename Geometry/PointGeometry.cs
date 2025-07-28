namespace WebApplication1.Geometry
{
    public class PointGeometry : Geometry
    {
        public double X { get; set; }
        public double Y { get; set; }

        public override string Type => "Point";

        public PointGeometry(double x, double y)
        {
            X = x;
            Y = y;
        }

        public override string ToWKT()
        {
            return $"POINT({X} {Y})";
        }

        // Converting WKT to PointGeometry
        public static PointGeometry FromWKT(string wkt)
        {
            if (string.IsNullOrWhiteSpace(wkt))
                throw new ArgumentException("WKT cannot be null or empty.");

            wkt = wkt.Trim().ToUpper();

            if (!wkt.StartsWith("POINT(") || !wkt.EndsWith(")"))
                throw new ArgumentException("Invalid WKT format for Point.");

            var content = wkt.Substring(6, wkt.Length - 7).Trim();
            var parts = content.Split(' ');

            if (parts.Length != 2)
                throw new ArgumentException("Invalid coordinate format.");

            double x = double.Parse(parts[0]);
            double y = double.Parse(parts[1]);

            return new PointGeometry(x, y);
        }
    }
}
