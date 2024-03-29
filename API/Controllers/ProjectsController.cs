using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using MongoDB.Bson;
//Project Namespaces
using Domain;
using Application.Tasks;
using Application.DTOs;

namespace API.Controllers
{
    public class ProjectsController : BaseApiController
    {
        // Get all projects.
        [HttpGet]
        public async Task<ActionResult<List<ProjectDto>>> GetProjects()
        {
            return await Mediator.Send(new Application.Projects.List.Query());
        }

        // Get a specific project by its ObjectId.
        [HttpGet("{id}")]
        public async Task<ActionResult<Project>> GetProject(ObjectId id)
        {
            return await Mediator.Send(new Application.Projects.Details.Query { Id = id });
        }

        // Create a new project.
        [HttpPost]
        public async Task<IActionResult> CreateProject(Project project)
        {
            return Ok(await Mediator.Send(new Application.Projects.Create.Command { Project = project }));
        }

        // Edit an existing project by its ObjectId.
        [Authorize(Policy = "IsOwner")]
        [HttpPut("{id}")]
        public async Task<IActionResult> EditProject(ObjectId id, Project project)
        {
            project.Id = id;
            return Ok(await Mediator.Send(new Application.Projects.Edit.Command { Project = project }));
        }

        // Delete a specific project by its ObjectId.
        [Authorize(Policy = "IsOwner")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProject(ObjectId id)
        {
            return Ok(await Mediator.Send(new Application.Projects.Delete.Command { Id = id }));
        }

        // Get the Kanban board of a specific project by its ObjectId.
        [HttpGet("{id}/kanbanBoard")]
        public async Task<ActionResult<KanbanBoard>> GetKanbanBoard(ObjectId id)
        {
            var project = await Mediator.Send(new Application.Projects.Details.Query { Id = id });
            if (project == null) return NotFound();
            return Ok(project.kanbanBoard);
        }

        // Create a new task in a specific project by its ObjectId.
        [HttpPost("{id}/tasks")]
        public async Task<IActionResult> CreateTask(ObjectId id, ProjectTask task)
        {
            return Ok(await Mediator.Send(new Application.Tasks.Create.Command
            {
                Task = new ProjectTask
                {
                    ProjectId = id,
                    Name = task.Name,
                    Description = task.Description,
                    DueDate = task.DueDate,
                    Status = task.Status,
                    PeopleAssigned = task.PeopleAssigned,
                }
            }));
        }

        // Delete a specific task from a specific project, both by their ObjectId.
        [HttpDelete("{projectId}/tasks/{taskId}")]
        public async Task<IActionResult> DeleteTask(ObjectId projectId, ObjectId taskId, [FromQuery] string userId)
        {
            // Convert string userId to ObjectId
            if (!ObjectId.TryParse(userId, out ObjectId objectUserId))
            {
                return BadRequest("Invalid user ID.");
            }
            // Pass objectUserId in the command
            return Ok(await Mediator.Send(new Application.Tasks.Delete.Command
            { ProjectId = projectId, TaskId = taskId, UserId = objectUserId }));
        }

        // Get all tasks across all projects.
        [HttpGet("tasks")]
        public async Task<ActionResult<List<ProjectTask>>> GetTasks()
        {
            return await Mediator.Send(new Application.Tasks.List.Query());
        }

        // Get a specific task from a specific project, both by their ObjectId.
        [HttpGet("{projectId}/tasks/{taskId}")]
        public async Task<ActionResult<ProjectTask>> GetTask(ObjectId projectId, ObjectId taskId)
        {
            return await Mediator.Send(new GetTask.Query { ProjectId = projectId, TaskId = taskId });
        }

        // Get all tasks for a specific project by its ObjectId.
        [HttpGet("{id}/tasks")]
        public async Task<ActionResult<List<ProjectTask>>> GetTasks(ObjectId id)
        {
            return await Mediator.Send(new Application.Tasks.ListByProject.Query { ProjectId = id });
        }

        // Update the status of a specific task by its ObjectId.
        [HttpPut("tasks/{id}")]
        public async Task<IActionResult> UpdateTaskStatus(ObjectId id, [FromBody] MoveTaskToNewStatus.Command command)
        {
            Console.WriteLine($"URL id: {id}, command.TaskId: {command.TaskId}");

            if (command.TaskId != id)
            {
                return BadRequest("TaskId in the command does not match the id in the URL");
            }

            await Mediator.Send(command);

            return NoContent();
        }

        // Edit a specific task from a specific project, both by their ObjectId.
        [HttpPut("{projectId}/tasks/{taskId}/details")]
        public async Task<IActionResult> EditTask(ObjectId projectId, ObjectId taskId, ProjectTask task, [FromQuery] string userId)
        {
            // Convert string userId to ObjectId
            if (!ObjectId.TryParse(userId, out ObjectId objectUserId))
            {
                return BadRequest("Invalid user ID.");
            }

            task.Id = taskId;
            return Ok(await Mediator.Send(new Application.Tasks.Edit.Command
            {
                ProjectId = projectId,
                TaskId = taskId,
                Task = task,
                UserId = objectUserId
            }));
        }

        // Edit the people assigned to a specific task from a specific project, both by their ObjectId.
        [HttpPost("{projectId}/tasks/{taskId}/peopleAssigned")]
        public async Task<IActionResult> EditPeopleAssigned(ObjectId projectId, ObjectId taskId, [FromBody] List<ObjectId> peopleAssignedIds)
        {
            return Ok(await Mediator.Send(new Application.Tasks.UpdatePeopleAssigned.Command { ProjectId = projectId, TaskId = taskId, PeopleAssignedIds = peopleAssignedIds }));
        }
    }
}