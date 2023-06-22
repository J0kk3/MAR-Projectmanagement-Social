using AutoMapper;
//Project Namespaces
using Domain;
using Application.DTOs;

namespace Application.Core
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<Project, Project>();
            CreateMap<Project, ProjectDto>()
                //Ignore these fields because they are manually set
                .ForMember(d => d.Owner, o => o.Ignore())
                .ForMember(d => d.Collaborators, o => o.Ignore());
            CreateMap<ProjectCollaborator, Profiles.Profile>()
                .ForMember(d => d.userName, o => o.MapFrom(s => s.AppUser.UserName))
                .ForMember(d => d.Bio, o => o.MapFrom(s => s.AppUser.Bio));
                // .ForMember(d => d.Image, o => o.MapFrom(s => s.Image));
        }
    }
}