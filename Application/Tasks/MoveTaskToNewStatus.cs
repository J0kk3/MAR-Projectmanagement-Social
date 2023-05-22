using MediatR;
using MongoDB.Driver;
//Project Namespaces
using Domain;
using Persistence;

namespace Application.Tasks
{
    public class MoveTaskToNewStatus
    {
        public class Command : IRequest
        {
            public Guid TaskId { get; set; }
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
                // Fetch the task
                var taskFilter = Builders<ProjectTask>.Filter.Eq(t => t.Id, request.TaskId);
                var task = await _ctx.ProjectTasks.Find(taskFilter).FirstOrDefaultAsync(cancellationToken);

                // Convert string to TaskStatus enum
                if (!Enum.TryParse(request.NewStatus, out Domain.TaskStatus newStatus))
                {
                    throw new ArgumentException("Invalid status value");
                }

                // Update the status
                task.Status = newStatus;

                // Save the changes
                await _ctx.ProjectTasks.ReplaceOneAsync(taskFilter, task, cancellationToken: cancellationToken);

                // Convert string to Guid
                if (!Guid.TryParse(request.UserId, out Guid userId))
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