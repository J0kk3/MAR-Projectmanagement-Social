using MediatR;
using MongoDB.Driver;
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

            public Handler(DataContext ctx)
            {
                _ctx = ctx;
            }

            public async Task<List<ProjectTask>> Handle(Query request, CancellationToken cancellationToken)
            {
                var projects = await _ctx.Projects.Find(_ => true).ToListAsync();
                return projects.SelectMany(p => p.kanbanBoard.Tasks).ToList();
            }
        }
    }
}