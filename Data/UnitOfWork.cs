using WebApplication1.Interfaces;
using WebApplication1.Repositories;
using WebApplication1.Models;

namespace WebApplication1.Data
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly ApplicationDbContext _context;
        public IGenericRepository<Point> Points { get; }
        public ILineRepository Lines { get; }
        public IPolygonRepository Polygons { get; private set; }

        public UnitOfWork(ApplicationDbContext context)
        {
            _context = context;
            Points = new GenericRepository<Point>(_context);
            Lines = new LineRepository(context);
            Polygons = new PolygonRepository(_context);
        }

        public async Task<int> CompleteAsync()
        {
            return await _context.SaveChangesAsync();
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}
