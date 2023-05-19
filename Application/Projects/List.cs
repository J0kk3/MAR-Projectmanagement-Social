using MediatR;
using MongoDB.Driver;
//Project Namespaces
using Domain;
using Persistence;

namespace Application.Projects
{
    public class List
    {
        public class Query : IRequest<List<Project>> { }

        public class Handler : IRequestHandler<Query, List<Project>>
        {
            private readonly DataContext _ctx;

            public Handler(DataContext ctx)
            {
                _ctx = ctx;
            }

            public async Task<List<Project>> Handle(Query request, CancellationToken cancellationToken)
            {
                return await _ctx.Projects.Find(_ => true).ToListAsync();
            }
        }
    }
}