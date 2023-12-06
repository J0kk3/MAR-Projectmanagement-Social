using MongoDB.Bson;

namespace Application.DTOs
{
    public class ProjectTaskDto
    {
        public ObjectId Id { get; set; }
        public ObjectId ProjectId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime DueDate { get; set; }
        public TaskStatus Status { get; set; }
        public ICollection<ObjectId> PeopleAssigned { get; set; }
    }
}