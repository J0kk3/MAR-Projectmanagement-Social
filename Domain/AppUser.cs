using AspNetCore.Identity.MongoDbCore.Models;
using MongoDbGenericRepository.Attributes;
using MongoDB.Bson;

namespace Domain
{
    [CollectionName("Users")]
    public class AppUser : MongoIdentityUser<ObjectId>
    {
        public string Bio { get; set; }
        public ICollection<ObjectId> ProjectIds { get; set; } = new List<ObjectId>();
        public ICollection<ObjectId> TaskIds { get; set; } = new List<ObjectId>();
    }
}