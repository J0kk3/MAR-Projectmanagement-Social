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
                var project = await _ctx.Projects.Find(p => p.kanbanBoard.Tasks.Any(t => t.Id == request.Id)).FirstOrDefaultAsync();

                if (project == null)
                    throw new Exception("No project found containing the specified task.");

                var task = project.kanbanBoard.Tasks.First(t => t.Id == request.Id);
                return task;
            }
        }
    }
}