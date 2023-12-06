using MongoDB.Driver;
//Project Namespaces
using Domain;
using MongoDB.Bson;
using Microsoft.AspNetCore.Identity;

namespace Persistence
{
    public class Seed
    {
        public static async Task SeedData(DataContext ctx, UserManager<AppUser> userManager)
        {
            if (!userManager.Users.Any())
            {
                var users = new List<AppUser>
                {
                    new AppUser
                    {
                        Id = ObjectId.GenerateNewId(),
                        UserName  = "Jocke",
                        UserNameLower = "jocke",
                        Email = "test@testsson.com",
                        Bio = "I'm a test user",
                    },
                    new AppUser
                    {
                        Id = ObjectId.GenerateNewId(),
                        UserName = "Sabed",
                        UserNameLower = "sabed",
                        Email = "sabed@cowork.com",
                        Bio = "I'm a test user",
                    }
                };

                foreach (var user in users)
                {
                    await userManager.CreateAsync(user, "Pa$$w0rd!");
                }
            };

            try
            {
                if (await ctx.Projects.CountDocumentsAsync(_ => true) > 0) return;

                Console.WriteLine("Starting to seed data...");

                var projectId = ObjectId.GenerateNewId();

                var jockeId = userManager.Users.First(u => u.UserNameLower == "jocke").Id;
                var sabedId = userManager.Users.First(u => u.UserNameLower == "sabed").Id;

                var tasks = new List<ProjectTask>
                {
                    new ProjectTask
                    {
                        Id = ObjectId.GenerateNewId(),
                        ProjectId = projectId,
                        OwnerId = jockeId,
                        Name = "ToDo Task 0",
                        Description = "ToDo Task 0 Description",
                        DueDate = DateTime.Now.AddMonths(1),
                        PeopleAssigned = new List<ObjectId> { jockeId, sabedId },
                        Status = Domain.TaskStatus.ToDo,
                    }
                };

                Console.WriteLine("Created tasks.");

                var kanbanBoard = new KanbanBoard
                {
                    ProjectId = projectId,
                    Title = "Kanban Board Title",
                    Tasks = tasks
                };

                var projects = new List<Project>
                {
                    new Project
                    {
                        Id = projectId,
                        Title = "Project 0",
                        Description = "Project 0 Description",
                        Priority = 3,
                        OwnerId = jockeId,
                        CollaboratorIds = new List<ObjectId> { sabedId },
                        DueDate = DateTime.Now.AddMonths(7),
                        Category = "Project 0 Category",
                        Tags = new List<string> { "Project 0 Tag 1", "Project 0 Tag 2" },
                        Visibility = Visibility.Public,
                        Status = ProjectStatus.Active,
                        kanbanBoard = kanbanBoard
                    }
                };

                await ctx.Projects.InsertManyAsync(projects);

                Console.WriteLine("Inserted projects.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exception while seeding data: {ex.Message}");
                Console.WriteLine(ex.StackTrace);
            }
        }
    }
}