using MongoDB.Driver;
//Project Namespaces
using Domain;

namespace Persistence
{
    public class Seed
    {
        public static async System.Threading.Tasks.Task SeedData(DataContext ctx)
        {
            try
            {
                if (await ctx.Projects.CountDocumentsAsync(_ => true) > 0) return;

                Console.WriteLine("Starting to seed data...");

                var kanbanBoard = new KanbanBoard
                {
                    Title = "Kanban Board 0",
                    TasksToDo = new List<Domain.Task>
            {
            new Domain.Task
            {
                Name = "ToDo Task 0",
                Description = "ToDo Task 0 Description",
                PeopleAssigned = new List<string> { "Jocke", "Sabed" }
            }
            },
                    TasksInProgress = new List<Domain.Task>(),
                    TasksInReview = new List<Domain.Task>(),
                    TasksDone = new List<Domain.Task>()
                };

                await ctx.KanbanBoards.InsertOneAsync(kanbanBoard);

                Console.WriteLine("Inserted kanban board.");

                var projects = new List<Project>
            {
                new Project
                {
                    Title = "Project 0",
                    Description = "Project 0 Description",
                    Priority = 3,
                    Owner = "Jocke",
                    Collaborators = new List<string> { "Sabed" },
                    DueDate = DateTime.Now.AddMonths(7),
                    Category = "Project 0 Category",
                    Tags = new List<string> { "Project 0 Tag 1", "Project 0 Tag 2" },
                    Visibility = Visibility.Public,
                    KanbanBoard = kanbanBoard
                },
            };

                //update mongodb collection
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