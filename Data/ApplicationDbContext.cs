using Microsoft.EntityFrameworkCore;
using WebApplication1.Models;

namespace WebApplication1.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Point> Points { get; set; }
        public DbSet<Line> Lines { get; set; }
        public DbSet<Polygon> Polygons { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Point>(entity =>
            {
                entity.Property(p => p.Id)
                    .ValueGeneratedNever(); // To assigning the smallest ID that is available.

                entity.Property(p => p.Geometry) // To matching the geometry column with the name 'geom'
                    .HasColumnName("geom")
                    .HasColumnType("geometry(Point,4326)");
            });
        }
    }
}
