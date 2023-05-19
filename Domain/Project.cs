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
        public KanbanBoard KanbanBoard { get; set; }
    }

    public enum Visibility
    {
        Public,
        Private
    }
}