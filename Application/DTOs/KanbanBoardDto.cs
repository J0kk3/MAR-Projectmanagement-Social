using MongoDB.Bson;

namespace Application.DTOs
{
    public class KanbanBoardDto
    {
        public ObjectId ProjectId { get; set; }
        public string Title { get; set; }
        public ICollection<ProjectTaskDto> Tasks { get; set; }
    }
}