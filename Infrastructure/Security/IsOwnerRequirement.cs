using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Features;
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

            // var routeValues = _httpContextAccessor.HttpContext.Request.RouteValues;

            // var projectId = _httpContextAccessor.HttpContext?.Request.RouteValues
            //     .SingleOrDefault(x => x.Key == "id").Value?.ToString();
            var routeValuesFeature = _httpContextAccessor.HttpContext.Features.Get<IRouteValuesFeature>();
            var routeValues = routeValuesFeature.RouteValues;

            var projectId = routeValues.SingleOrDefault(x => x.Key == "id").Value?.ToString();


            if (projectId == null) return;
            if (!ObjectId.TryParse(projectId, out ObjectId validId)) return;

            var project = await _ctx.Projects.Find(p => p.Id == validId).SingleOrDefaultAsync();

            if (project == null) return;

            if (project.OwnerId.ToString() == userId) context.Succeed(requirement);
        }
        // protected override async Task HandleRequirementAsync(AuthorizationHandlerContext context, IsOwnerRequirement requirement)
        // {
        //     var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);

        //     if (userId == null) return;

        //     var features = _httpContextAccessor.HttpContext.Features;
        //     var routeValuesFeature = features.Get<IRouteValuesFeature>();
        //     var routeValues = routeValuesFeature.RouteValues;

        //     var projectId = routeValues.SingleOrDefault(x => x.Key == "id").Value?.ToString();

        //     if (projectId == null) return;
        //     if (!ObjectId.TryParse(projectId, out ObjectId validId)) return;

        //     var project = await _ctx.Projects.Find(p => p.Id == validId).SingleOrDefaultAsync();

        //     if (project == null) return;

        //     if (project.OwnerId.ToString() == userId) context.Succeed(requirement);
        // }
    }
}