using System.Security.Claims;
using Microsoft.AspNetCore.Http;

public interface ICurrentUserService
{
    string GetUserId();
}

public class CurrentUserService : ICurrentUserService
{
    readonly IHttpContextAccessor _httpContextAccessor;

    public CurrentUserService(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public string GetUserId()
    {
        return _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);
    }
}