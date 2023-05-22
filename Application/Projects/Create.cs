using MediatR;
using MongoDB.Driver;
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
                await _ctx.Projects.InsertOneAsync(request.Project, cancellationToken: cancellationToken);

                return Unit.Value;
            }
        }
    }
}