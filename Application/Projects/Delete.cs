using MediatR;
using MongoDB.Driver;
using MongoDB.Bson;
//Project Namespaces
using Domain;
using Persistence;

namespace Application.Projects
{
    public class Delete
    {
        public class Command : IRequest
        {
            public ObjectId Id { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            readonly DataContext _ctx;
            public Handler(DataContext ctx)
            {
                _ctx = ctx;
            }

            public async Task Handle(Command request, CancellationToken cancellationToken)
            {
                var filter = Builders<Project>.Filter.Eq(p => p.Id, request.Id);
                await _ctx.Projects.DeleteOneAsync(filter);
            }
        }
    }
}