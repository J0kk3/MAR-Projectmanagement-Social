using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using MongoDB.Bson;
//project namespaces
using Domain;
using Persistence;
using API.Services;
using Infrastructure.Security;

namespace API.Extensions
{
    public static class IdentityServiceExtensions
    {
        public static IServiceCollection AddIdentityServices(this IServiceCollection services,
            IConfiguration config)
        {
            var ctx = services.BuildServiceProvider().GetService<DataContext>();

            services.AddIdentity<AppUser, MongoRole>(opt =>
            {
                opt.Password.RequireDigit = true;
                opt.Password.RequiredLength = 7;
                opt.Password.RequireNonAlphanumeric = true;
                opt.Password.RequireUppercase = true;
                opt.Password.RequireLowercase = true;
                opt.User.RequireUniqueEmail = true;
            })
            .AddMongoDbStores<AppUser, MongoRole, ObjectId>(ctx.connectionString, "Users")
            .AddDefaultTokenProviders();

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["TokenKey"]));

            services.AddAuthentication(opt =>
            {
                opt.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                opt.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = key,
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                };
            });

            services.AddAuthorization(opt =>
            {
                opt.AddPolicy("IsOwner", policy =>
                {
                    policy.Requirements.Add(new IsOwnerRequirement());
                });
            });

            services.AddTransient<IAuthorizationHandler, IsOwnerRequirementHandler>();

            services.AddScoped<TokenService>();

            return services;
        }
    }
}