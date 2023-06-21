using MediatR;
using MongoDB.Driver;
//Project Namespaces
using Domain;
using Persistence;
using MongoDB.Bson;

namespace Application.Projects
{
    public class Details
    {
        public class Query : IRequest<Project>
        {
            public ObjectId Id { get; set; }
        }

        public class Handler : IRequestHandler<Query, Project>
        {
            private readonly DataContext _ctx;
            private readonly ICurrentUserService _currentUserService;

            public Handler(DataContext ctx, ICurrentUserService currentUserService)
            {
                _ctx = ctx;
                _currentUserService = currentUserService;
            }

            public async Task<Project> Handle(Query request, CancellationToken cancellationToken)
            {
                var authenticatedUserId = _currentUserService.GetUserId();

                if (authenticatedUserId == null)
                {
                    // Handle the case where there is no authenticated user.
                    return null;
                }

                // Create a filter to find the project with the matching id where the authenticated user is the owner or a collaborator
                var filter = Builders<Project>.Filter.And(
                    Builders<Project>.Filter.Eq(doc => doc.Id, request.Id),
                    Builders<Project>.Filter.Or(
                        Builders<Project>.Filter.Eq(doc => doc.OwnerId.ToString(), authenticatedUserId),
                        Builders<Project>.Filter.AnyEq(doc => doc.CollaboratorIds.Select(id => id.ToString()), authenticatedUserId)
                    )
                );

                return await _ctx.Projects.Find(filter).FirstOrDefaultAsync();
            }
        }
    }
}