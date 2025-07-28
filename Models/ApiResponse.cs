namespace WebApplication1.Models
{
    public class ApiResponse<T>
    {
        public required T? Data { get; set; }
        public required string Message { get; set; }
        public required string Status { get; set; }
    }
}
