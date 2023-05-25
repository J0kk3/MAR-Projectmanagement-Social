using MongoDB.Driver;
//Project Namespaces
using Domain;
using MongoDB.Bson;

namespace Persistence
{
    public class Seed
    {
        public static async Task SeedData(DataContext ctx)
        {
            try
            {
                if (await ctx.Projects.CountDocumentsAsync(_ => true) > 0) return;

                Console.WriteLine("Starting to seed data...");

                var projectId = ObjectId.GenerateNewId();

                var tasks = new List<ProjectTask>
                {
                    new ProjectTask
                    {
                        Id = ObjectId.GenerateNewId(),
                        ProjectId = projectId,
                        Name = "ToDo Task 0",
                        Description = "ToDo Task 0 Description",
                        DueDate = DateTime.Now.AddMonths(1),
                        PeopleAssigned = new List<string> { "Jocke", "Sabed" },
                        Status = Domain.TaskStatus.ToDo,
                        TaskColumn = "ToDo"
                    }
                };

                Console.WriteLine("Created tasks.");

                var kanbanBoardId = ObjectId.GenerateNewId();

                var kanbanBoard = new KanbanBoard
                {
                    Id = kanbanBoardId,
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
                        Owner = "Jocke",
                        Collaborators = new List<string> { "Sabed" },
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