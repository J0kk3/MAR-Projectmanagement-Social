using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using MongoDB.Bson;
using MongoDB.Driver;
//Project Namespaces
using Persistence;

namespace Infrastructure.Security
{
    public class IsOwnerRequirement : IAuthorizationRequirement
    {
    }

    public class IsOwnerRequirementHandler : AuthorizationHandler<IsOwnerRequirement>
    {
        private readonly DataContext _ctx;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public IsOwnerRequirementHandler(DataContext ctx, IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
            _ctx = ctx;
        }

        protected override async Task HandleRequirementAsync(AuthorizationHandlerContext context, IsOwnerRequirement requirement)
        {
            var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null) return;

            var path = _httpContextAccessor.HttpContext.Request.Path.Value.Split(new[] { '/' }, StringSplitOptions.RemoveEmptyEntries);

            string projectId = null;
            for (int i = 0; i < path.Length; i++)
            {
                if (path[i].Equals("projects", StringComparison.OrdinalIgnoreCase) && i < path.Length - 1)
                {
                    projectId = path[i + 1];
                    break;
                }
            }

            if (projectId == null) return;

            var project = await _ctx.Projects.Find(p => p.Id == new ObjectId(projectId)).SingleOrDefaultAsync();

            if (project == null) return;

            if (project.OwnerId.ToString() == userId) context.Succeed(requirement);
        }
    }
}