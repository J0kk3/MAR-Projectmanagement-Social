namespace Domain
{
    public class Project
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public int Priority { get; set; }
        public string Owner { get; set; }
        public IList<string> Collaborators { get; set; }
        public DateTime DueDate { get; set; }
        public string Category { get; set; }
        public IList<string> Tags { get; set; } = new List<string>();
        public Visibility Visibility { get; set; }
        public ProjectStatus Status { get; set; }
        public Guid KanbanBoardId { get; set; }
        public KanbanBoard kanbanBoard { get; set; }
    }

    public class KanbanBoard
    {
        public Guid Id { get; set; }
        public Guid ProjectId { get; set; }
        public string Title { get; set; }
        public IList<ProjectTask> TasksToDo { get; set; }
        public IList<ProjectTask> TasksInProgress { get; set; }
        public IList<ProjectTask> TasksInReview { get; set; }
        public IList<ProjectTask> TasksDone { get; set; }
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
}