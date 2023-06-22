using MediatR;
using MongoDB.Bson;
//Project Namespaces
using Application.Core;
using Application.Interfaces;
using Persistence;
using MongoDB.Driver;

namespace Application.Tasks
{
    public class UpdatePeopleAssigned
    {
        public class Command : IRequest<Result<Unit>>
        {
            public ObjectId ProjectId { get; set; }
            public ObjectId TaskId { get; set; }
            public List<ObjectId> PeopleAssignedIds { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _ctx;
            private readonly IUserProfileService _userProfileService;
            public Handler(DataContext ctx, IUserProfileService userProfileService)
            {
                _userProfileService = userProfileService;
                _ctx = ctx;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var project = await _ctx.Projects.Find(p => p.Id == request.ProjectId).FirstOrDefaultAsync();
                if (project == null) return Result<Unit>.Failure("Project not found");

                // Locate the task within the project
                var task = project.kanbanBoard.Tasks.FirstOrDefault(t => t.Id == request.TaskId);
                if (task == null) return Result<Unit>.Failure("Task not found");

                // Update the people assigned to this task
                task.PeopleAssigned = request.PeopleAssignedIds ?? new List<ObjectId>();

                // Save changes back to the database
                var replaceResult = await _ctx.Projects.ReplaceOneAsync(p => p.Id == request.ProjectId, project);
                var success = replaceResult.ModifiedCount > 0;

                return success ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Problem updating assigned people");
            }
        }
    }
}