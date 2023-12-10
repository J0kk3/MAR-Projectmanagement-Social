using MediatR;
using MongoDB.Driver;
using MongoDB.Bson;
//Project Namespaces
using Domain;
using Persistence;

namespace Application.Tasks
{
    public class Edit
    {
        public class Command : IRequest<ProjectTask>
        {
            public ObjectId ProjectId { get; set; }
            public ObjectId TaskId { get; set; }
            public ObjectId UserId { get; set; }
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
                var project = await _ctx.Projects.Find(p => p.Id == request.ProjectId && p.kanbanBoard.Tasks.Any(t => t.Id == request.TaskId)).FirstOrDefaultAsync();
                if (project == null)
                    throw new Exception("Project not found");

                var task = project.kanbanBoard.Tasks.First(t => t.Id == request.TaskId);
                if (task == null)
                    throw new Exception("Task not found in the project");

                // Check if the user is authorized to edit the task
                if (task.OwnerId != request.UserId)
                {
                    throw new Exception("Forbidden: User is not authorized to edit this task.");
                }

                // update the task with the provided details
                task.Name = request.Task.Name;
                task.Description = request.Task.Description;
                task.DueDate = request.Task.DueDate;
                task.PeopleAssigned = request.Task.PeopleAssigned;
                task.Status = request.Task.Status;

                await _ctx.Projects.ReplaceOneAsync(p => p.Id == project.Id, project);

                // Update the users who are assigned this task
                foreach (var userId in request.Task.PeopleAssigned)
                {
                    var filter = Builders<AppUser>.Filter.Eq(u => u.Id, userId);
                    var update = Builders<AppUser>.Update.Push(u => u.TaskIds, request.Task.Id);
                    await _ctx.Users.UpdateOneAsync(filter, update, cancellationToken: cancellationToken);
                }

                return task;
            }
        }
    }
}