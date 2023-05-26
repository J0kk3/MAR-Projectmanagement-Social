using MediatR;
using MongoDB.Driver;
//Project Namespaces
using Domain;
using Persistence;
using MongoDB.Bson;

namespace Application.Tasks
{
    public class ListByProject
    {
        public class Query : IRequest<List<ProjectTask>>
        {
            public ObjectId ProjectId { get; set; }
        }

        public class Handler : IRequestHandler<Query, List<ProjectTask>>
        {
            readonly DataContext _ctx;

            public Handler(DataContext ctx)
            {
                _ctx = ctx;
            }

            public async Task<List<ProjectTask>> Handle(Query request, CancellationToken cancellationToken)
            {
                var project = await _ctx.Projects.Find(p => p.Id == request.ProjectId).SingleOrDefaultAsync();
                return project != null ? project.kanbanBoard.Tasks.ToList() : new List<ProjectTask>();
            }
        }
    }
}