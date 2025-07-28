using WebApplication1.Models;

namespace WebApplication1.Interfaces
{
    public interface IPolygonRepository
    {
        Task<List<Polygon>> GetAllAsync();
        List<Polygon> GetAllSync();
        Task AddAsync(Polygon polygon);
        void Delete(Polygon polygon);
    }
}
