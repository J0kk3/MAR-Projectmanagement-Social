using MediatR;
using MongoDB.Driver;
using MongoDB.Bson;
//Project Namespaces
using Domain;
using Persistence;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;

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
            private readonly IHttpContextAccessor _httpContextAccessor;

            public Handler(DataContext ctx, IHttpContextAccessor httpContextAccessor)
            {
                _ctx = ctx;
                _httpContextAccessor = httpContextAccessor;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                // Fetch the project containing the task
                var projectFilter = Builders<Project>.Filter.ElemMatch(p => p.kanbanBoard.Tasks, t => t.Id == request.TaskId);

                var project = await _ctx.Projects.Find(projectFilter).FirstOrDefaultAsync(cancellationToken);

                if (project == null) throw new Exception("Task not found");

                var currentUserId = new ObjectId(_httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier));

                // Find the task
                var task = project.kanbanBoard.Tasks.FirstOrDefault(t => t.Id == request.TaskId);

                if (task == null) throw new Exception("Task not found");

                // Check if the current user is the owner of the task
                if (currentUserId != task.OwnerId)
                {
                    throw new Exception("Forbidden");
                }

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