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
        }

        public static class TaskStatusMapper
        {
            private static readonly Dictionary<string, Domain.TaskStatus> Mapping = new Dictionary<string, Domain.TaskStatus>
            {
                {"ToDo", Domain.TaskStatus.ToDo},
                {"InProgress", Domain.TaskStatus.InProgress},
                {"InReview", Domain.TaskStatus.InReview},
                {"Done", Domain.TaskStatus.Done}
            };

            public static Domain.TaskStatus ConvertStringToTaskStatus(string status)
            {
                if (!Mapping.TryGetValue(status, out var taskStatus))
                    throw new Exception($"Invalid task status: {status}");
                return taskStatus;
            }
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

                // Convert the string to TaskStatus using the mapping
                var newStatus = TaskStatusMapper.ConvertStringToTaskStatus(request.NewStatus);

                // Set the new TaskColumn
                task.Status = newStatus;

                // Update the project in the database
                await _ctx.Projects.ReplaceOneAsync(projectFilter, project, cancellationToken: cancellationToken);

                return Unit.Value;
            }
        }
    }
}