using WebApplication1.Models;
using NetTopologySuite.Geometries;

namespace WebApplication1.Interfaces
{
    public interface ILineService
    {
        Task<int> AssignID();
        bool ValidateLine(string name, LineString geometry);
        Task<ApiResponse<string>> CreateAsync(LineAccessRequest request);
        Task<ApiResponse<List<LineDto>>> GetAllAsync();
        Task<ApiResponse<LineDto?>> SearchByNameAsync(string name);
        Task<bool> DeleteAsync(int id);
        Task<bool> UpdateAsync(int id, LineAccessRequest request);
    }
}
