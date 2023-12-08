using MediatR;
using MongoDB.Driver;
using MongoDB.Bson;
//Project Namespaces
using Domain;
using Persistence;

namespace Application.Tasks
{
    public class Delete
    {
        public class Command : IRequest
        {
            public ObjectId ProjectId { get; set; }
            public ObjectId TaskId { get; set; }
            public ObjectId UserId { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            readonly DataContext _ctx;
            public Handler(DataContext ctx)
            {
                _ctx = ctx;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var project = await _ctx.Projects.Find(p => p.Id == request.ProjectId).SingleOrDefaultAsync();

                if (project != null)
                {
                    var task = project.kanbanBoard.Tasks.FirstOrDefault(t => t.Id == request.TaskId);

                    if (task != null)
                    {
                        Console.WriteLine($"request.UserId: {request.UserId}, task.OwnerId: {task.OwnerId}");
                        // Check if the current user is the owner of the task
                        if (request.UserId != task.OwnerId)
                        {
                            throw new Exception("Forbidden: User is not the owner of the task.");
                        }

                        project.kanbanBoard.Tasks.Remove(task);
                        var filter = Builders<Project>.Filter.Eq(p => p.Id, request.ProjectId);
                        await _ctx.Projects.ReplaceOneAsync(filter, project);
                    }
                }

                return Unit.Value;
            }
        }
    }
}