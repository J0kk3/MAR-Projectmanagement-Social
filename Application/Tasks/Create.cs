using MediatR;
using MongoDB.Driver;
using MongoDB.Bson;
//Project Namespaces
using Domain;
using Persistence;

namespace Application.Tasks
{
    public class Create
    {
        public class Command : IRequest<ProjectTask>
        {
            public ProjectTask Task { get; set; }
        }

        public class Handler : IRequestHandler<Command, ProjectTask>
        {
            readonly DataContext _ctx;
            public Handler(DataContext ctx)
            {
                _ctx = ctx;
            }

            public async Task<ProjectTask> Handle(Command request, CancellationToken cancellationToken)
            {
                request.Task.Id = ObjectId.GenerateNewId();

                var filter = Builders<Project>.Filter.Eq(p => p.Id, request.Task.ProjectId);
                var update = Builders<Project>.Update.Push(p => p.kanbanBoard.Tasks, request.Task);
                await _ctx.Projects.UpdateOneAsync(filter, update, cancellationToken: cancellationToken);

                // Add this task to the list of tasks of each assigned user
                foreach (var userId in request.Task.PeopleAssigned)
                {
                    var userFilter = Builders<AppUser>.Filter.Eq(u => u.Id, userId);
                    var userUpdate = Builders<AppUser>.Update.Push(u => u.TaskIds, request.Task.Id);
                    await _ctx.Users.UpdateOneAsync(userFilter, userUpdate, cancellationToken: cancellationToken);
                }

                return request.Task;
            }
        }
    }
}