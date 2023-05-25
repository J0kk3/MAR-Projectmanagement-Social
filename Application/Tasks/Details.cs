using MongoDB.Driver;
using MongoDB.Bson;
using MediatR;
//Project Namespaces
using Domain;
using Persistence;

namespace Application.Tasks
{
    public class Details
    {
        public class Query : IRequest<ProjectTask>
        {
            public ObjectId Id { get; set; }
        }

        public class Handler : IRequestHandler<Query, ProjectTask>
        {
            readonly DataContext _ctx;
            public Handler(DataContext ctx)
            {
                _ctx = ctx;
            }

            public async Task<ProjectTask> Handle(Query request, CancellationToken cancellationToken)
            {
                var projects = await _ctx.Projects.Find(_ => true).ToListAsync();
                var task = projects.SelectMany(p => p.kanbanBoard.Tasks)
                    .FirstOrDefault(t => t.Id == request.Id);
                return task;
            }
        }
    }
}