using Application.Profiles;

namespace Application.Interfaces
{
    public interface IUserProfileService
    {
        Task<Profile> GetProfileById(string id);
    }
}