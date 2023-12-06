using Application.Profiles;

namespace Application.Interfaces
{
    public interface IUserProfileService
    {
        Task<Profile> GetProfileById(string id);
        Task<List<Profile>> SearchProfiles(string query);
    }
}