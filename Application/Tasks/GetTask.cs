using MediatR;
using MongoDB.Bson;
using MongoDB.Driver;
//Project Namespaces
using Domain;
using Persistence;

public class GetTask
{
    public class Query : IRequest<ProjectTask>
    {
        public ObjectId ProjectId { get; set; }
        public ObjectId TaskId { get; set; }
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
            var filter = Builders<Project>.Filter.Eq(p => p.Id, request.ProjectId);
            var project = await _ctx.Projects.Find(filter).FirstOrDefaultAsync();

            if (project == null)
                throw new Exception("Project not found");

            var task = project.kanbanBoard.Tasks.FirstOrDefault(t => t.Id == request.TaskId);

            if (task == null)
                throw new Exception("Task not found");

            return task;
        }
    }
}