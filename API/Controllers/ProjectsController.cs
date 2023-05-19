using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
//Project Namespaces
using Persistence;
using Domain;

namespace API.Controllers
{
    public class ProjectsController : BaseApiController
    {
        private readonly DataContext _ctx;
        public ProjectsController(DataContext ctx)
        {
            _ctx = ctx;
        }

        [HttpGet]
        public async Task<ActionResult<List<Project>>> GetProjects()
        {
            return await _ctx.Projects.Find(p => true).ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Project>> GetProject(Guid id)
        {
            return await _ctx.Projects.Find(p => p.Id == id).FirstOrDefaultAsync();
        }
    }
}