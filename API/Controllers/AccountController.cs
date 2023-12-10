using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
//Project Namespaces
using Domain;
using API.DTOs;
using API.Services;
using Application.Profiles;
using Infrastructure.Security;
using Application.Interfaces;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        readonly UserManager<AppUser> _userManager;
        readonly TokenService _tokenService;
        readonly IUserProfileService _userProfileService;
        public AccountController(UserManager<AppUser> userManager, TokenService tokenService, IUserProfileService userProfileService)
        {
            _userProfileService = userProfileService;
            _tokenService = tokenService;
            _userManager = userManager;
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _userManager.FindByEmailAsync(loginDto.Email);

            if (user == null) return Unauthorized();

            var result = await _userManager.CheckPasswordAsync(user, loginDto.Password);

            if (result)
            {
                return CreateUserObject(user);
            }

            return Unauthorized();
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {

            var userWithSameName = await _userManager.FindByNameAsync(registerDto.userName);
            var userWithSameEmail = await _userManager.FindByEmailAsync(registerDto.Email);

            if (userWithSameName != null)
            {
                ModelState.AddModelError("username", "Username is already taken");
                return ValidationProblem();
            }

            if (userWithSameEmail != null)
            {
                ModelState.AddModelError("email", "Email is already taken");
                return ValidationProblem();
            }

            var user = new AppUser
            {
                UserName = registerDto.userName,
                Email = registerDto.Email,
            };

            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if (result.Succeeded)
            {
                return CreateUserObject(user);
            }

            return BadRequest(result.Errors);
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var user = await _userManager.FindByEmailAsync(User.FindFirstValue(ClaimTypes.Email));

            return CreateUserObject(user);
        }

        UserDto CreateUserObject(AppUser user)
        {
            return new UserDto
            {
                Id = user.Id,
                userName = user.UserName,
                Image = null,
                Token = _tokenService.CreateToken(user)
            };
        }

        [HttpGet("search/{query}")]
        public async Task<ActionResult<List<Profile>>> SearchProfiles(string query)
        {
            return await _userProfileService.SearchProfiles(query);
        }

        [HttpGet("user/{id}")]
        public async Task<ActionResult<Profile>> GetUserById(string id)
        {
            return await _userProfileService.GetProfileById(id);
        }
    }
}