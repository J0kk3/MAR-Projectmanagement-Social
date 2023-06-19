using AspNetCore.Identity.MongoDbCore.Models;
using MongoDbGenericRepository.Attributes;

namespace Domain
{
    [CollectionName("Roles")]
    public class MongoRole : MongoIdentityRole<string>
    {
        // Add additional properties here if needed
    }
}