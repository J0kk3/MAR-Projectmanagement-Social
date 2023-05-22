namespace Domain
{
    public enum TaskStatus
    {
        ToDo,
        InProgress,
        InReview,
        Done
    }

    public class ProjectTask
    {
        public Guid Id { get; set; }
        public Guid KanbanBoardId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime DueDate { get; set; }
        public TaskStatus Status { get; set; }
        public IList<string> PeopleAssigned { get; set; } = new List<string>();
    }
}