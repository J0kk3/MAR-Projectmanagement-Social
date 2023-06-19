using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class RegisterDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        [Required]
        [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{7,}$", ErrorMessage = "Password must be at least 7 characters and contain at least one uppercase letter, one lowercase letter, one digit and one special character.")]
        public string Password { get; set; }
        [Required]
        public string UserName { get; set; }
    }
}