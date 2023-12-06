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
            CreateMap<ProjectCollaborator, Profiles.Profile>()
                .ForMember(d => d.userName, o => o.MapFrom(s => s.AppUser.UserName))
                .ForMember(d => d.Bio, o => o.MapFrom(s => s.AppUser.Bio));
            CreateMap<KanbanBoard, KanbanBoardDto>();
            CreateMap<ProjectTask, ProjectTaskDto>();
            CreateMap<Project, ProjectDto>()
                .ForMember(d => d.Owner, o => o.MapFrom<OwnerResolver>())
                .ForMember(d => d.Collaborators, o => o.Ignore())
                .ForMember(d => d.KanbanBoard, o => o.MapFrom(s => s.kanbanBoard));
        }
    }
}