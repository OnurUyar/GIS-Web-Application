using System.Xml.Linq;
using WebApplication1.Geometry;
using WebApplication1.Interfaces;
using WebApplication1.Models;
using WebApplication1.Resources;

namespace WebApplication1.Services
{
    public class PointService : IPointService
    {
        private readonly IUnitOfWork _unitOfWork;

        public PointService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        private void ValidatePoint(Point point)
        {
            if (string.IsNullOrWhiteSpace(point.Name))
                throw new Exception(Messages.ValidationNameEmpty);

            if (point.Name.Length > 70)
                throw new Exception(Messages.ValidationNameLong);

            if (point.Latitude < 35.0 || point.Latitude > 43.0)
                throw new Exception(Messages.ValidationLat);

            if (point.Longitude < 25.0 || point.Longitude > 45.0)
                throw new Exception(Messages.ValidationLon);
        }

        private async Task<int> AssignID()
        {
            var allPoints = await _unitOfWork.Points.GetAllAsync();
            var usedIds = allPoints.Select(p => p.Id).OrderBy(id => id).ToList();

            int nextId = 1;
            foreach (var id in usedIds)
            {
                if (id == nextId)
                    nextId++;
                else
                    break;
            }
            return nextId;
        }

        public async Task<ApiResponse<List<Point>>> GetAllAsync()
        {
            var points = await _unitOfWork.Points.GetAllAsync();
            var ordered = points.OrderBy(p => p.Id).ToList();

            return new ApiResponse<List<Point>>
            {
                Status = "OK",
                Message = Messages.Listed,
                Data = ordered
            };
        }

        public async Task<ApiResponse<Point>> CheckPointAsync(string name)
        {
            var point = await _unitOfWork.Points.GetAsync(p => p.Name.ToLower() == name.ToLower());
            if (point == null)
                throw new Exception(string.Format(Messages.PointNotFoundName, name));

            return new ApiResponse<Point>
            {
                Status = "OK",
                Message = string.Format(Messages.PointFound, name),
                Data = point
            };
        }

        public async Task<ApiResponse<Point>> AddAsync(PointAccessRequest request)
        {
            var existing = await _unitOfWork.Points.GetAsync(p => p.Name.ToLower() == request.Name.ToLower());
            if (existing != null)
                throw new Exception(string.Format(Messages.PointExists, request.Name));

            var point = new Point
            {
                Id = await AssignID(),
                Name = request.Name,
                Latitude = request.Latitude,
                Longitude = request.Longitude,
                WKT = new PointGeometry(request.Longitude, request.Latitude).ToWKT(),
                Geometry = new NetTopologySuite.Geometries.Point(request.Longitude, request.Latitude) { SRID = 4326 }
            };

            ValidatePoint(point);

            await _unitOfWork.Points.AddAsync(point);
            await _unitOfWork.CompleteAsync();

            return new ApiResponse<Point>
            {
                Status = "OK",
                Message = Messages.PointAdded,
                Data = point
            };
        }

        public async Task<ApiResponse<Point>> UpdateAsync(int id, PointAccessRequest request)
        {
            var existing = await _unitOfWork.Points.GetAsync(p => p.Id == id);
            if (existing == null)
                throw new Exception(string.Format(Messages.PointNotFoundId, id));

            existing.Name = request.Name;
            existing.Latitude = request.Latitude;
            existing.Longitude = request.Longitude;
            existing.WKT = new PointGeometry(request.Longitude, request.Latitude).ToWKT();
            existing.Geometry = new NetTopologySuite.Geometries.Point(request.Longitude, request.Latitude) { SRID = 4326 };

            ValidatePoint(existing);

            _unitOfWork.Points.Update(existing);
            await _unitOfWork.CompleteAsync();

            return new ApiResponse<Point>
            {
                Status = "OK",
                Message = Messages.PointUpdated,
                Data = existing
            };
        }

        public async Task<ApiResponse<bool>> DeleteAsync(int id)
        {
            var existing = await _unitOfWork.Points.GetAsync(p => p.Id == id);
            if (existing == null)
                throw new Exception(string.Format(Messages.PointNotFoundId, id));

            _unitOfWork.Points.Delete(existing);
            await _unitOfWork.CompleteAsync();

            return new ApiResponse<bool>
            {
                Status = "OK",
                Message = Messages.PointDeleted,
                Data = true
            };
        }
    }
}
