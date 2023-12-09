using MediatR;
using MongoDB.Driver;
using AutoMapper;
//Project Namespaces
using Domain;
using Persistence;
using Application.DTOs;
using Application.Interfaces;

namespace Application.Projects
{
    public class List
    {
        public class Query : IRequest<List<ProjectDto>> { }

        public class Handler : IRequestHandler<Query, List<ProjectDto>>
        {
            readonly DataContext _ctx;
            readonly IMapper _mapper;
            readonly IUserProfileService _profileService;

            public Handler(DataContext ctx, IMapper mapper, IUserProfileService profileService)
            {
                _ctx = ctx;
                _mapper = mapper;
                _profileService = profileService;
            }

            public async Task<List<ProjectDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var projects = await _ctx.Projects.Find(_ => true).ToListAsync();

                var projectDtos = new List<ProjectDto>();

                foreach (var project in projects)
                {
                    var projectDto = _mapper.Map<ProjectDto>(project);

                    projectDto.Owner = await _profileService.GetProfileById(project.OwnerId.ToString());
                    projectDto.Collaborators = new List<Application.Profiles.Profile>();
                    foreach (var collaboratorId in project.CollaboratorIds)
                    {
                        var collaboratorProfile = await _profileService.GetProfileById(collaboratorId.ToString());
                        projectDto.Collaborators.Add(collaboratorProfile);
                    }

                    projectDtos.Add(projectDto);
                }

                return projectDtos;
            }
        }
    }
}