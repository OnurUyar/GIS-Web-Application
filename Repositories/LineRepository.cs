using WebApplication1.Data;
using WebApplication1.Interfaces;
using WebApplication1.Models;

namespace WebApplication1.Repositories
{
    public class LineRepository : GenericRepository<Line>, ILineRepository
    {
        public LineRepository(ApplicationDbContext context) : base(context)
        {
        }

    }
}
