using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.Interfaces;
using WebApplication1.Models;

namespace WebApplication1.Repositories
{
    public class PolygonRepository : IPolygonRepository
    {
        private readonly ApplicationDbContext _context;

        public PolygonRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<Polygon>> GetAllAsync()
        {
            return await _context.Polygons.ToListAsync();
        }

        public List<Polygon> GetAllSync()
        {
            return _context.Polygons.ToList();
        }

        public void Delete(Polygon polygon)
        {
            _context.Polygons.Remove(polygon);
        }

        public async Task AddAsync(Polygon polygon)
        {
            await _context.Polygons.AddAsync(polygon);
        }
    }
}
