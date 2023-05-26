using Microsoft.AspNetCore.Mvc;
//Project Namespaces
using Domain;
using Application.Projects;
using MongoDB.Bson;
using Application.Tasks;

namespace API.Controllers
{
    public class ProjectsController : BaseApiController
    {
        [HttpGet]
        public async Task<ActionResult<List<Project>>> GetProjects()
        {
            return await Mediator.Send(new Application.Projects.List.Query());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Project>> GetProject(ObjectId id)
        {
            return await Mediator.Send(new Application.Projects.Details.Query { Id = id });
        }

        [HttpPost]
        public async Task<IActionResult> CreateProject(Project project)
        {
            return Ok(await Mediator.Send(new Application.Projects.Create.Command { Project = project }));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> EditProject(ObjectId id, Project project)
        {
            project.Id = id;
            return Ok(await Mediator.Send(new Application.Projects.Edit.Command { Project = project }));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProject(ObjectId id)
        {
            return Ok(await Mediator.Send(new Application.Projects.Delete.Command { Id = id }));
        }

        [HttpGet("{id}/kanbanBoard")]
        public async Task<ActionResult<KanbanBoard>> GetKanbanBoard(ObjectId id)
        {
            var project = await Mediator.Send(new Application.Projects.Details.Query { Id = id });
            if (project == null) return NotFound();
            return Ok(project.kanbanBoard);
        }

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
                    TaskColumn = task.TaskColumn
                }
            }));
        }

        [HttpGet("tasks")]
        public async Task<ActionResult<List<ProjectTask>>> GetTasks()
        {
            return await Mediator.Send(new Application.Tasks.List.Query());
        }

        [HttpGet("tasks/{id}")]
        public async Task<ActionResult<ProjectTask>> GetTask(ObjectId id)
        {
            return await Mediator.Send(new Application.Tasks.Details.Query { Id = id });
        }

        [HttpGet("{id}/tasks")]
        public async Task<ActionResult<List<ProjectTask>>> GetTasks(ObjectId id)
        {
            return await Mediator.Send(new Application.Tasks.ListByProject.Query { ProjectId = id });
        }

        [HttpPut("tasks/{id}")]
        public async Task<IActionResult> UpdateTaskStatus(string id, [FromBody] MoveTaskToNewStatus.Command command)
        {
            if (!ObjectId.TryParse(id, out ObjectId objectId))
            {
                return BadRequest("Invalid id format");
            }

            if (command.TaskId != objectId)
            {
                return BadRequest("TaskId in the command does not match the id in the URL");
            }

            await Mediator.Send(command);

            return NoContent();
        }
    }
}