using MediatR;
using MongoDB.Driver;
using MongoDB.Bson;
//Project Namespaces
using Domain;
using Persistence;

namespace Application.Tasks
{
    public class MoveTaskToNewStatus
    {
        public class Command : IRequest
        {
            public ObjectId TaskId { get; set; }
            public string NewStatus { get; set; }
            public string UserId { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _ctx;

            public Handler(DataContext ctx)
            {
                _ctx = ctx;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                // Fetch the project containing the task
                var projectFilter = Builders<Project>.Filter.ElemMatch(p => p.kanbanBoard.Tasks, t => t.Id == request.TaskId);

                var project = await _ctx.Projects.Find(projectFilter).FirstOrDefaultAsync(cancellationToken);

                if (project == null) throw new Exception("Task not found");

                // Find the task
                var task = project.kanbanBoard.Tasks.FirstOrDefault(t => t.Id == request.TaskId);

                if (task == null) throw new Exception("Task not found");

                // Set the new TaskColumn
                task.TaskColumn = request.NewStatus;

                // Update the project in the database
                await _ctx.Projects.ReplaceOneAsync(projectFilter, project, cancellationToken: cancellationToken);

                // Convert string to Guid
                if (!ObjectId.TryParse(request.UserId, out ObjectId userId))
                {
                    throw new ArgumentException("Invalid userId value");
                }

                // Create a notification
                var notification = new Notification
                {
                    TargetUserId = userId,
                    Message = $"Task {task.Name} has been moved to {request.NewStatus}",
                    Time = DateTime.UtcNow,
                    IsRead = false
                };

                // Save the notification
                await _ctx.Notifications.InsertOneAsync(notification, cancellationToken: cancellationToken);

                return Unit.Value;
            }
        }
    }
}