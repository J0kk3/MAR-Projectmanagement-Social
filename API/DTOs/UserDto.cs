using MongoDB.Bson;

namespace API.DTOs
{
    public class UserDto
    {
        public ObjectId Id { get; set; }
        public string userName { get; set; }
        public string Token { get; set; }
        public string Image { get; set; }
    }
}