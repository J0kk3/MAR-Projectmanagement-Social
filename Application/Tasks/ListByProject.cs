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
                var filter = Builders<Project>.Filter.Eq(p => p.Id, request.ProjectId);
                var project = await _ctx.Projects.Find(filter).FirstOrDefaultAsync();

                if (project == null)
                    throw new Exception("Project not found");

                if (project.kanbanBoard == null)
                    throw new Exception("Project does not contain a Kanban Board");

                return project.kanbanBoard.Tasks.ToList();
            }
        }
    }
}