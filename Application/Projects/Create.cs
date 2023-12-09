using MediatR;
using MongoDB.Bson;
//Project Namespaces
using Domain;
using Persistence;
using MongoDB.Driver;

namespace Application.Projects
{
    public class Create
    {
        public class Command : IRequest
        {
            public Project Project { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            readonly DataContext _ctx;
            readonly ICurrentUserService _currentUserService;


            public Handler(DataContext ctx, ICurrentUserService currentUserService)
            {
                _ctx = ctx;
                _currentUserService = currentUserService;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var projectId = ObjectId.GenerateNewId();
                request.Project.Id = projectId;

                // Set the logged-in user as the project's owner
                request.Project.OwnerId = new ObjectId(_currentUserService.GetUserId());

                // Create a new kanbanBoard
                var newKanbanBoard = new KanbanBoard
                {
                    ProjectId = projectId,
                    Title = request.Project.Title,
                    Tasks = new List<ProjectTask>(), // Initialize with an empty task list
                };

                // Set the KanbanBoard for the project
                request.Project.kanbanBoard = newKanbanBoard;

                // Insert the project into the database
                await _ctx.Projects.InsertOneAsync(request.Project, cancellationToken: cancellationToken);

                // Update the user who created the project
                var filter = Builders<AppUser>.Filter.Eq(u => u.Id, request.Project.OwnerId);
                var update = Builders<AppUser>.Update.Push(u => u.ProjectIds, request.Project.Id);
                await _ctx.Users.UpdateOneAsync(filter, update, cancellationToken: cancellationToken);

                return Unit.Value;
            }
        }
    }
}