using Microsoft.AspNetCore.Identity;
using AutoMapper;
//Project Namespaces
using Application.DTOs;
using Domain;

public class OwnerResolver : IValueResolver<Project, ProjectDto, Application.Profiles.Profile>
{
    readonly UserManager<AppUser> _userManager;

    public OwnerResolver(UserManager<AppUser> userManager)
    {
        _userManager = userManager;
    }

    public Application.Profiles.Profile Resolve(Project source, ProjectDto destination, Application.Profiles.Profile destMember, ResolutionContext context)
    {
        var user = _userManager.FindByIdAsync(source.OwnerId.ToString()).ConfigureAwait(false).GetAwaiter().GetResult();

        if (user == null)
        {
            // Handle the case when the user is not found
            return null;
        }

        return new Application.Profiles.Profile
        {
            Id = user.Id,
            userName = user.UserName,
            Bio = user.Bio,
        };
    }
}