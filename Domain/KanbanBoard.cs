namespace Domain
{
    public class KanbanBoard
    {
        public Guid Id { get; set; }
        public Guid ProjectId { get; set; }
        public string Title { get; set; }
        public IList<Task> TasksToDo { get; set; } = new List<Task>();
        public IList<Task> TasksInProgress { get; set; } = new List<Task>();
        public IList<Task> TasksInReview { get; set; } = new List<Task>();
        public IList<Task> TasksDone { get; set; } = new List<Task>();
    }
}