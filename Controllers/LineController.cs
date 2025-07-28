using Microsoft.AspNetCore.Mvc;
using WebApplication1.Interfaces;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LineController : ControllerBase
    {
        private readonly ILineService _lineService;

        public LineController(ILineService lineService)
        {
            _lineService = lineService;
        }

        [HttpPost("add")]
        public async Task<IActionResult> Add([FromBody] LineAccessRequest request)
        {
            var result = await _lineService.CreateAsync(request);
            return Ok(result);
        }

        [HttpGet("getAll")]
        public async Task<IActionResult> GetAll()
        {
            var result = await _lineService.GetAllAsync();
            return Ok(result);
        }

        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] string name)
        {
            var result = await _lineService.SearchByNameAsync(name);

            if (result.Data == null)
            {
                return NotFound(new ApiResponse<string>
                {
                    Status = "Error",
                    Message = "No line with the specified name was found.",
                    Data = null
                });
            }

            return Ok(result);
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _lineService.DeleteAsync(id);

            if (!result)
            {
                return NotFound(new ApiResponse<string>
                {
                    Status = "Error",
                    Message = "No line found to delete.",
                    Data = null
                });
            }

            return Ok(new ApiResponse<string>
            {
                Status = "Success",
                Message = "The line was deleted successfully.",
                Data = null
            });
        }

        [HttpPut("update/{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] LineAccessRequest request)
        {
            var result = await _lineService.UpdateAsync(id, request);

            if (!result)
            {
                return BadRequest(new ApiResponse<string>
                {
                    Status = "Error",
                    Message = "Update failed. Data may be invalid.",
                    Data = null
                });
            }

            return Ok(new ApiResponse<string>
            {
                Status = "Success",
                Message = "The line has been updated successfully.",
                Data = null
            });
        }
    }
}
