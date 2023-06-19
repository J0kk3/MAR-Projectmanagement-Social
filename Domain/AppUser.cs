using AspNetCore.Identity.MongoDbCore.Models;
using MongoDbGenericRepository.Attributes;

namespace Domain
{
    [CollectionName("Users")]
    public class AppUser : MongoIdentityUser<string>
    {
        public string DisplayName { get; set; }
        public string Bio { get; set; }
    }
}