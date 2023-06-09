using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
//Project Namespaces
using Domain;
using API.DTOs;
using API.Services;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly TokenService _tokenService;
        public AccountController(UserManager<AppUser> userManager, TokenService tokenService)
        {
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

        private UserDto CreateUserObject(AppUser user)
        {
            return new UserDto
            {
                Id = user.Id,
                userName = user.UserName,
                Image = null,
                Token = _tokenService.CreateToken(user)
            };
        }
    }
}