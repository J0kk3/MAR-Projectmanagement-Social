using MediatR;
using MongoDB.Bson;
//Project Namespaces
using Domain;
using Persistence;

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
            public Handler(DataContext ctx)
            {
                _ctx = ctx;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var projectId = ObjectId.GenerateNewId();
                request.Project.Id = projectId;

                // Create a new kanbanBoard
                var newKanbanBoard = new KanbanBoard
                {
                    ProjectId = projectId,
                    Title = "", // Initialize with appropriate title
                    Tasks = new List<ProjectTask>(), // Initialize with an empty task list
                };

                // Set the KanbanBoard for the project
                request.Project.kanbanBoard = newKanbanBoard;

                // Insert the project into the database
                await _ctx.Projects.InsertOneAsync(request.Project, cancellationToken: cancellationToken);

                return Unit.Value;
            }
        }
    }
}