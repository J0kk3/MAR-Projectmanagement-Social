using AspNetCore.Identity.MongoDbCore.Models;
using MongoDB.Bson;
using MongoDbGenericRepository.Attributes;

namespace Domain
{
    [CollectionName("Roles")]
    public class MongoRole : MongoIdentityRole<ObjectId>
    {
        public MongoRole() : base()
        {
        }

        public MongoRole(string roleName) : base(roleName)
        {
        }
    }
}