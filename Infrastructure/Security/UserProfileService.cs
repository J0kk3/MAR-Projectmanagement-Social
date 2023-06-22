//Project Namespaces
using Application.Interfaces;
using Application.Profiles;
using Domain;
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
        }

        public Profile ConvertUserToProfile(AppUser user)
        {
            return new Profile
            {
                userName = user.UserName,
                Bio = user.Bio,
            };
        }

        public async Task<Profile> GetProfileById(string id)
        {
            var user = await _ctx.Users.Find(u => u.Id.ToString() == id).SingleOrDefaultAsync();
            return user != null ? ConvertUserToProfile(user) : null;
        }
    }
}