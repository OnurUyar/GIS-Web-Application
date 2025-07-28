using Microsoft.AspNetCore.Mvc;
using WebApplication1.Geometry;
using WebApplication1.Interfaces;
using WebApplication1.Models;
using WebApplication1.Resources;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PolygonController : ControllerBase
    {
        private readonly IPolygonService _polygonService;

        public PolygonController(IPolygonService polygonService)
        {
            _polygonService = polygonService;
        }

        [HttpGet("getAll")]
        public async Task<IActionResult> GetAll()
        {
            var polygons = await _polygonService.GetAllDtosAsync();
            return Ok(new { data = polygons });
        }

        [HttpPost("add")]
        public async Task<IActionResult> Add([FromBody] PolygonAccessRequest request)
        {
            if (!_polygonService.ValidatePolygon(request))
            {
                return BadRequest(new ApiResponse<string>
                {
                    Status = "Error",
                    Message = Messages.InvalidPolygonData,
                    Data = null
                });
            }

            var polygon = await _polygonService.CreateAsync(request);

            return Ok(new ApiResponse<Polygon>
            {
                Status = "Success",
                Message = Messages.PolygonAddedSuccessfully,
                Data = polygon
            });
        }

        [HttpGet("search")]
        public async Task<IActionResult> GetByName([FromQuery] string name)
        {
            var polygon = await _polygonService.GetByNameAsync(name);

            if (polygon == null)
            {
                return NotFound(new ApiResponse<string>
                {
                    Status = "Error",
                    Message = $"'{name}' No polygon with the name was found.",
                    Data = null
                });
            }

            return Ok(new ApiResponse<Polygon>
            {
                Status = "Success",
                Message = "Polygon found.",
                Data = polygon
            });
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _polygonService.DeleteAsync(id);

            if (!result)
            {
                return NotFound(new ApiResponse<string>
                {
                    Status = "Error",
                    Message = $"The polygon with ID {id} was not found.",
                    Data = null
                });
            }

            return Ok(new ApiResponse<string>
            {
                Status = "Success",
                Message = "Polygon deleted successfully.",
                Data = null
            });
        }

        [HttpPut("update/{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] PolygonAccessRequest request)
        {
            var updated = await _polygonService.UpdateAsync(id, request);

            if (updated == null)
            {
                return BadRequest(new ApiResponse<string>
                {
                    Status = "Error",
                    Message = "Update failed. ID is invalid or data is incorrect.",
                    Data = null
                });
            }

            return Ok(new ApiResponse<Polygon>
            {
                Status = "Success",
                Message = "Polygon updated successfully.",
                Data = updated
            });
        }
    }
}
