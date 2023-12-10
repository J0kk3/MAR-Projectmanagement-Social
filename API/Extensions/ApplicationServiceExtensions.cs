using MediatR;
using Microsoft.AspNetCore.Identity;
//Project Namespaces
using Application.Core;
using Application.Projects;
using Persistence;
using Domain;
using Application.Interfaces;
using Infrastructure.Security;
using System.Net.NetworkInformation;

namespace API.Extensions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services,
            IConfiguration config)
        {
            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen();

            // services.AddSingleton<DataContext>();
            services.AddScoped<DataContext>();
            services.AddSingleton<IPasswordHasher<AppUser>, PasswordHasher<AppUser>>();

            var ctx = services.BuildServiceProvider().GetService<DataContext>();

            services.AddCors(options =>
            {
                options.AddPolicy("CorsPolicy", policy =>
                {
                    policy.AllowAnyHeader().AllowAnyMethod().WithOrigins("http://localhost:3000");
                });
            });

            services.AddMediatR(cfg =>
            {
                cfg.RegisterServicesFromAssembly(typeof(List.Handler).Assembly);
            });
            //Locate all the mapping profiles in the Application project
            services.AddAutoMapper(typeof(MappingProfiles).Assembly);
            services.AddHttpContextAccessor();
            services.AddScoped<ICurrentUserService, CurrentUserService>();
            services.AddScoped<IUserProfileService, UserProfileService>();

            return services;
        }
    }
}