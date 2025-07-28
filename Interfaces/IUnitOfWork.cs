using System;
using System.Threading.Tasks;
using WebApplication1.Repositories;
using WebApplication1.Models;

namespace WebApplication1.Interfaces
{
    public interface IUnitOfWork : IDisposable
    {
        IGenericRepository<Point> Points { get; }
        ILineRepository Lines { get; }
        IPolygonRepository Polygons { get; }
        Task<int> CompleteAsync();
    }
}
