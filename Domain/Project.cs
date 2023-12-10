
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Domain
{
    public enum TaskStatus
    {
        ToDo,
        InProgress,
        InReview,
        Done
    }

    public enum Visibility
    {
        Public,
        Private
    }

    public enum ProjectStatus
    {
        Active,
        Paused,
    }

    public class Project
    {
        [BsonId]
        [BsonElement("_id")]
        public ObjectId Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public int Priority { get; set; }
        public ObjectId OwnerId { get; set; }
        public IList<ObjectId> CollaboratorIds { get; set; } = new List<ObjectId>();
        public DateTime DueDate { get; set; }
        public string Category { get; set; }
        public IList<string> Tags { get; set; } = new List<string>();
        public Visibility Visibility { get; set; }
        public ProjectStatus Status { get; set; }
        public KanbanBoard kanbanBoard { get; set; }
    }

    public class KanbanBoard
    {
        public ObjectId ProjectId { get; set; }
        public string Title { get; set; }
        public IList<ProjectTask> Tasks { get; set; }
    }

    public class ProjectTask
    {
        public ObjectId Id { get; set; }
        public ObjectId ProjectId { get; set; }
        public ObjectId OwnerId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime DueDate { get; set; }
        public TaskStatus Status { get; set; }
        public IList<ObjectId> PeopleAssigned { get; set; } = new List<ObjectId>();
    }
}