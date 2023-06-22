//Project Namespaces
using Domain;
using Application.Profiles;

namespace Application.DTOs
{
    public class ProjectDto
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public int Priority { get; set; }
        public Application.Profiles.Profile Owner { get; set; }
        public ICollection<Application.Profiles.Profile> Collaborators { get; set; }
        public DateTime DueDate { get; set; }
        public string Category { get; set; }
        public IList<string> Tags { get; set; }
        public Visibility Visibility { get; set; }
        public ProjectStatus Status { get; set; }
    }
}