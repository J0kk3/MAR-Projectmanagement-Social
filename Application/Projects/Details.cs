using MediatR;
using MongoDB.Driver;
//Project Namespaces
using Domain;
using Persistence;

namespace Application.Projects
{
    public class Details
    {
        public class Query : IRequest<Project>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Query, Project>
        {
            readonly DataContext _ctx;
            public Handler(DataContext ctx)
            {
                _ctx = ctx;
            }

            public async Task<Project> Handle(Query request, CancellationToken cancellationToken)
            {
                //creates a filter to find the project with the matching id
                var filter = Builders<Project>.Filter.Eq(doc => doc.Id, request.Id);
                return await _ctx.Projects.Find(filter).FirstOrDefaultAsync();
            }
        }
    }
}