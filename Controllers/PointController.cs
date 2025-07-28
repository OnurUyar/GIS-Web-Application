using Microsoft.AspNetCore.Mvc;
using WebApplication1.Models;
using WebApplication1.Interfaces;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PointController : ControllerBase
    {
        private readonly IPointService _pointService;

        public PointController(IPointService pointService)
        {
            _pointService = pointService;
        }

        [HttpGet]
        public async Task<ApiResponse<List<Point>>> GetAll()
        {
            return await _pointService.GetAllAsync();
        }

        [HttpGet("CheckPoint/{name}")]
        public async Task<ApiResponse<Point>> CheckPoint(string name)
        {
            return await _pointService.CheckPointAsync(name);
        }

        [HttpPost]
        public async Task<ApiResponse<Point>> Add(PointAccessRequest request)
        {
            return await _pointService.AddAsync(request);
        }

        [HttpPut("{id}")]
        public async Task<ApiResponse<Point>> Update(int id, PointAccessRequest request)
        {
            return await _pointService.UpdateAsync(id, request);
        }

        [HttpDelete("{id}")]
        public async Task<ApiResponse<bool>> Delete(int id)
        {
            return await _pointService.DeleteAsync(id);
        }
    }
}
