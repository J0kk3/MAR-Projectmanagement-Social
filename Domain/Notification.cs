namespace Domain
{
    public class Notification
    {
        public Guid Id { get; set; }
        public Guid TargetUserId { get; set; }  // The ID of the user who will receive the notification
        public string Message { get; set; }  // A message describing the event or change
        public DateTime Time { get; set; }  // The time when the event or change occurred
        public bool IsRead { get; set; }  // Whether the user has read the notification
    }
}