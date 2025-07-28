namespace WebApplication1.Geometry
{
    public abstract class Geometry
    {
        public abstract string Type { get; }

        public abstract string ToWKT();
    }
}
