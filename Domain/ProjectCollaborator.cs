using MongoDB.Bson;

namespace Domain
{
    public class ProjectCollaborator
    {
        public ObjectId Id { get; set; }
        public virtual AppUser AppUser { get; set; }
        public ObjectId UserId { get; set; }
        public ObjectId ProjectId { get; set; }
        public bool IsOwner { get; set; }
    }
}