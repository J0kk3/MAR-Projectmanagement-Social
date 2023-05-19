using MongoDB.Driver;
using Microsoft.Extensions.Configuration;
//project namespaces
using Domain;

namespace Persistence
{
    public class DataContext
    {
        private readonly IMongoDatabase _db;
        private readonly IConfiguration Configuration;

        public DataContext(IConfiguration config)
        {
            var mongodbUser = config["mongodbUser"];
            var mongodbPw = config["mongodbPw"];
            var mongodbCluster = config["mongodbCluster"];
            var connectionString = $"mongodb+srv://{mongodbUser}:{mongodbPw}@{mongodbCluster}.aa0muro.mongodb.net/?retryWrites=true&w=majority";

            var client = new MongoClient(connectionString);
            _db = client.GetDatabase("YourDatabaseName");
        }

        //MongoDB Collections
        public IMongoCollection<Project> Projects => _db.GetCollection<Project>("Projects");
        public IMongoCollection<KanbanBoard> KanbanBoards => _db.GetCollection<KanbanBoard>("KanbanBoards");
    }
}