using NetTopologySuite.Geometries;
using WebApplication1.Geometry;
using WebApplication1.Interfaces;
using WebApplication1.Models;
using WebApplication1.Repositories;

namespace WebApplication1.Services
{
    public class LineService : ILineService
    {
        private readonly IUnitOfWork _unitOfWork;

        public LineService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<int> AssignID()
        {
            var lines = await _unitOfWork.Lines.GetAllAsync();
            var usedIds = lines.Select(p => p.Id).OrderBy(id => id).ToList();

            for (int i = 1; i <= usedIds.Count + 1; i++)
            {
                if (!usedIds.Contains(i))
                    return i;
            }

            return usedIds.Count + 1;
        }

        public bool ValidateLine(string name, LineString geometry)
        {
            if (string.IsNullOrWhiteSpace(name))
                return false;

            if (geometry == null || geometry.Coordinates.Length < 2)
                return false;

            foreach (var coord in geometry.Coordinates)
            {
                if (coord.X < 25 || coord.X > 45 || coord.Y < 35 || coord.Y > 43)
                    return false;
            }

            return true;
        }

        public async Task<ApiResponse<string>> CreateAsync(LineAccessRequest request)
        {
            LineGeometry geometryHelper;

            try
            {
                geometryHelper = new LineGeometry(request.WKT);
            }
            catch (Exception)
            {
                return new ApiResponse<string>
                {
                    Status = "Error",
                    Message = "Invalid WKT format.",
                    Data = null
                };
            }

            if (!ValidateLine(request.Name, geometryHelper.LineString))
            {
                return new ApiResponse<string>
                {
                    Status = "Error",
                    Message = "Data is invalid. Outside the borders of Türkiye or missing line.",
                    Data = null
                };
            }

            geometryHelper.LineString.SRID = 4326;
            var line = new Line
            {
                Id = await AssignID(),
                Name = request.Name,
                Geometry = geometryHelper.LineString,
                LengthKm = geometryHelper.GetLengthKm()
            };

            await _unitOfWork.Lines.AddAsync(line);
            await _unitOfWork.CompleteAsync();

            return new ApiResponse<string>
            {
                Status = "Success",
                Message = "Line added successfully.",
                Data = null
            };
        }

        public async Task<ApiResponse<List<LineDto>>> GetAllAsync()
        {
            var lines = await _unitOfWork.Lines.GetAllAsync();

            var dtoList = lines.Select(l => new LineDto
            {
                Id = l.Id,
                Name = l.Name ?? string.Empty,
                LengthKm = double.IsNaN(l.LengthKm ?? 0) || double.IsInfinity(l.LengthKm ?? 0) ? 0 : Math.Round(l.LengthKm ?? 0, 3),
                WKT = l.Geometry?.AsText() ?? string.Empty
            }).ToList();

            return new ApiResponse<List<LineDto>>
            {
                Status = "Success",
                Message = "All lines listed.",
                Data = dtoList
            };
        }

        public async Task<ApiResponse<LineDto?>> SearchByNameAsync(string name)
        {
            var lines = await _unitOfWork.Lines.GetAllAsync();
            var match = lines.FirstOrDefault(l => l.Name?.Equals(name, StringComparison.OrdinalIgnoreCase) == true);

            if (match == null)
            {
                return new ApiResponse<LineDto?>
                {
                    Status = "Error",
                    Message = "Line not found.",
                    Data = null
                };
            }

            var dto = new LineDto
            {
                Id = match.Id,
                Name = match.Name ?? "",
                LengthKm = double.IsNaN(match.LengthKm ?? 0) || double.IsInfinity(match.LengthKm ?? 0) ? 0 : Math.Round(match.LengthKm ?? 0, 3),
                WKT = match.Geometry?.AsText() ?? ""
            };

            return new ApiResponse<LineDto?>
            {
                Status = "Success",
                Message = "Line found.",
                Data = dto
            };
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var line = await _unitOfWork.Lines.GetByIdAsync(id);
            if (line == null) return false;

            _unitOfWork.Lines.Delete(line);
            await _unitOfWork.CompleteAsync();
            return true;
        }

        public async Task<bool> UpdateAsync(int id, LineAccessRequest request)
        {
            var existing = await _unitOfWork.Lines.GetByIdAsync(id);
            if (existing == null) return false;

            LineGeometry geom;
            try
            {
                geom = new LineGeometry(request.WKT);
            }
            catch
            {
                return false;
            }

            if (!ValidateLine(request.Name, geom.LineString))
                return false;

            geom.LineString.SRID = 4326;
            existing.Name = request.Name;
            existing.Geometry = geom.LineString;
            existing.LengthKm = geom.GetLengthKm();

            await _unitOfWork.CompleteAsync();
            return true;
        }
    }
}
