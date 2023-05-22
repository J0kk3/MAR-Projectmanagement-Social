using AutoMapper;
//Project Namespaces
using Domain;

namespace Application.Core
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<Project, Project>();
        }
    }
}