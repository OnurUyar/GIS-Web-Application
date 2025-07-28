using WebApplication1.Models;

namespace WebApplication1.Interfaces
{
    public interface IPointService
    {
        Task<ApiResponse<List<Point>>> GetAllAsync();
        Task<ApiResponse<Point>> CheckPointAsync(string name);
        Task<ApiResponse<Point>> AddAsync(PointAccessRequest request);
        Task<ApiResponse<Point>> UpdateAsync(int id, PointAccessRequest request);
        Task<ApiResponse<bool>> DeleteAsync(int id);
    }
}
