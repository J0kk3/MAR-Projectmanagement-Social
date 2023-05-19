namespace Domain
{
    public class Task
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public IList<string> PeopleAssigned { get; set; } = new List<string>();
    }
}