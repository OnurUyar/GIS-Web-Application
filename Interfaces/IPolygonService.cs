using WebApplication1.Models;
using WebApplication1.Models.Dto;

namespace WebApplication1.Interfaces
{
    public interface IPolygonService
    {
        Task<List<Polygon>> GetAllAsync();
        Task<List<PolygonDto>> GetAllDtosAsync();
        Task<Polygon> CreateAsync(PolygonAccessRequest request);
        Task<Polygon?> GetByNameAsync(string name);
        Task<bool> DeleteAsync(int id);
        Task<Polygon?> UpdateAsync(int id, PolygonAccessRequest request);
        int AssignID();
        bool ValidatePolygon(PolygonAccessRequest request);
    }
}
