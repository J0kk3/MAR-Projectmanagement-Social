using MediatR;
using MongoDB.Driver;
using AutoMapper;
//Project Namespaces
using Domain;
using Persistence;

namespace Application.Projects
{
    public class Edit
    {
        public class Command : IRequest
        {
            public Project Project { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            readonly DataContext _ctx;
            readonly IMapper _mapper;
            public Handler(DataContext ctx, IMapper mapper)
            {
                _mapper = mapper;
                _ctx = ctx;
            }

            public async Task Handle(Command request, CancellationToken cancellationToken)
            {
                var filter = Builders<Project>.Filter.Eq(p => p.Id, request.Project.Id);
                var project = await _ctx.Projects.Find(filter).FirstOrDefaultAsync();

                _mapper.Map(request.Project, project);

                await _ctx.Projects.ReplaceOneAsync(filter, project);
            }
        }
    }
}