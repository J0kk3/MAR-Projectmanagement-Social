using MongoDB.Bson;

namespace Application.Profiles
{
    public class Profile
    {
        public ObjectId Id { get; set; }
        public string userName { get; set; }
        public string Bio { get; set; }
        public string Image { get; set; }
    }
}