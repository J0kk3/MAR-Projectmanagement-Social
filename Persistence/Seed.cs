using MongoDB.Driver;
//Project Namespaces
using Domain;

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

                var tasks = new List<ProjectTask>
                {
                    new ProjectTask
                    {
                        Name = "ToDo Task 0",
                        Description = "ToDo Task 0 Description",
                        PeopleAssigned = new List<string> { "Jocke", "Sabed" },
                        Status = Domain.TaskStatus.ToDo
                    }
                };

                // Insert the tasks into the ProjectTasks collection and store their Ids
                var taskIds = new List<Guid>();
                foreach (var task in tasks)
                {
                    await ctx.ProjectTasks.InsertOneAsync(task);
                    taskIds.Add(task.Id);
                }

                Console.WriteLine("Inserted kanban board.");
                var kanbanBoardId = Guid.NewGuid();
                var projectId = Guid.NewGuid();

                var kanbanBoard = new KanbanBoard
                {
                    Id = kanbanBoardId,
                    Title = "Kanban Board Title",
                    TasksToDo = new List<ProjectTask>(), // Use the tasks you created before
                    TasksInProgress = new List<ProjectTask>(),
                    TasksInReview = new List<ProjectTask>(),
                    TasksDone = new List<ProjectTask>()
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
                        KanbanBoardId = kanbanBoardId,
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