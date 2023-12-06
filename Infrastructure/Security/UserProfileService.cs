//Project Namespaces
using Application.Interfaces;
using Application.Profiles;
using Domain;
using MongoDB.Bson;
using MongoDB.Driver;
using Persistence;

namespace Infrastructure.Security
{
    public class UserProfileService : IUserProfileService
    {
        private readonly DataContext _ctx;

        public UserProfileService(DataContext ctx)
        {
            _ctx = ctx;

            // Create text index on UserName and Bio
            var indexKeys = Builders<AppUser>.IndexKeys.Text(u => u.UserName).Text(u => u.Bio);
            var indexOptions = new CreateIndexOptions { Name = "TextIndex" };
            var textIndex = new CreateIndexModel<AppUser>(indexKeys, indexOptions);

            // The following line is to be run only once.
            // _ctx.Users.Indexes.CreateOne(textIndex);
        }

        public Profile ConvertUserToProfile(AppUser user)
        {
            return new Profile
            {
                Id = user.Id,
                userName = user.UserName,
                Bio = user.Bio,
            };
        }

        public async Task<Profile> GetProfileById(string id)
        {
            var user = await _ctx.Users.Find(u => u.Id.ToString() == id).SingleOrDefaultAsync();
            return user != null ? ConvertUserToProfile(user) : null;
        }

        public async Task<List<Profile>> SearchProfiles(string query)
        {
            var filter = Builders<AppUser>.Filter.Regex(u => u.UserName, new BsonRegularExpression(query, "i"));

            var users = await _ctx.Users.Find(filter).ToListAsync();

            return users.ConvertAll(ConvertUserToProfile);
        }
    }
}