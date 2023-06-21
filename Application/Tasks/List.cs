using MediatR;
using MongoDB.Driver;
using MongoDB.Bson;
//Project Namespaces
using Domain;
using Persistence;

namespace Application.Tasks
{
    public class List
    {
        public class Query : IRequest<List<ProjectTask>> { }

        public class Handler : IRequestHandler<Query, List<ProjectTask>>
        {
            readonly DataContext _ctx;
            private readonly ICurrentUserService _currentUserService;

            public Handler(DataContext ctx, ICurrentUserService currentUserService)
            {
                _currentUserService = currentUserService;
                _ctx = ctx;
            }

            public async Task<List<ProjectTask>> Handle(Query request, CancellationToken cancellationToken)
            {
                var currentUserId = new ObjectId(_currentUserService.GetUserId());
                var filter = Builders<Project>.Filter.ElemMatch(p => p.kanbanBoard.Tasks, t => t.PeopleAssigned.Contains(currentUserId));
                var userProjects = await _ctx.Projects.Find(filter).ToListAsync();

                var userTasks = new List<ProjectTask>();
                foreach (var project in userProjects)
                {
                    // Filter tasks in this project for the current user
                    var tasksForCurrentUser = project.kanbanBoard.Tasks.Where(t => t.PeopleAssigned.Contains(currentUserId));
                    userTasks.AddRange(tasksForCurrentUser);
                }

                return userTasks;
            }
        }
    }
}