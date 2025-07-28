using WebApplication1.Geometry;
using WebApplication1.Interfaces;
using WebApplication1.Models;
using WebApplication1.Models.Dto;
using WebApplication1.Resources;

namespace WebApplication1.Services
{
    public class PolygonService : IPolygonService
    {
        private readonly IUnitOfWork _unitOfWork;

        public PolygonService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<List<PolygonDto>> GetAllDtosAsync()
        {
            var polygons = await _unitOfWork.Polygons.GetAllAsync();

            var result = polygons.Select(p => new PolygonDto
            {
                Id = p.Id,
                Name = p.Name,
                AreaKm2 = p.AreaKm2,
                Wkt = p.Geometry?.AsText()
            }).ToList();

            return result;
        }

        public async Task<List<Polygon>> GetAllAsync()
        {
            return await _unitOfWork.Polygons.GetAllAsync();
        }

        public async Task<Polygon> CreateAsync(PolygonAccessRequest request)
        {
            if (!ValidatePolygon(request))
                throw new ArgumentException(Messages.InvalidPolygonData);

            var geometryHelper = new PolygonGeometry(request.WKT);
            geometryHelper.Polygon.SRID = 4326;

            var polygon = new Polygon
            {
                Id = AssignID(),
                Name = request.Name,
                Geometry = geometryHelper.Polygon,
                AreaKm2 = geometryHelper.GetAreaKm2()
            };

            await _unitOfWork.Polygons.AddAsync(polygon);
            await _unitOfWork.CompleteAsync();
            return polygon;
        }

        public async Task<Polygon?> GetByNameAsync(string name)
        {
            var polygons = await _unitOfWork.Polygons.GetAllAsync();
            return polygons.FirstOrDefault(p => p.Name?.Equals(name, StringComparison.OrdinalIgnoreCase) == true);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var polygons = await _unitOfWork.Polygons.GetAllAsync();
            var polygon = polygons.FirstOrDefault(p => p.Id == id);

            if (polygon == null)
                return false;

            _unitOfWork.Polygons.Delete(polygon);
            await _unitOfWork.CompleteAsync();
            return true;
        }

        public async Task<Polygon?> UpdateAsync(int id, PolygonAccessRequest request)
        {
            if (!ValidatePolygon(request))
                return null;

            var polygons = await _unitOfWork.Polygons.GetAllAsync();
            var existing = polygons.FirstOrDefault(p => p.Id == id);

            if (existing == null)
                return null;

            var geometry = new PolygonGeometry(request.WKT);
            geometry.Polygon.SRID = 4326;

            existing.Name = request.Name;
            existing.Geometry = geometry.Polygon;
            existing.AreaKm2 = geometry.GetAreaKm2();

            await _unitOfWork.CompleteAsync();
            return existing;
        }

        public int AssignID()
        {
            var polygons = _unitOfWork.Polygons.GetAllSync();
            var usedIds = polygons.Select(p => p.Id).ToHashSet();

            for (int i = 1; ; i++)
            {
                if (!usedIds.Contains(i))
                    return i;
            }
        }

        public bool ValidatePolygon(PolygonAccessRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Name))
                return false;

            if (string.IsNullOrWhiteSpace(request.WKT))
                return false;

            try
            {
                var geometry = new PolygonGeometry(request.WKT);
                return true;
            }
            catch
            {
                return false;
            }
        }
    }
}
