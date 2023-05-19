using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Serializers;
//Project Namespaces
using API.Extensions;
using Persistence;

BsonSerializer.RegisterSerializer(new GuidSerializer(BsonType.Binary));

var builder = WebApplication.CreateBuilder(args);
var mongodbUser = builder.Configuration["mongodbUser"];
var mongodbPw = builder.Configuration["mongodbPw"];
var mongodbCluster = builder.Configuration["mongodbCluster"];

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddApplicationServices(builder.Configuration);

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("CorsPolicy");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;

try
{
    var ctx = services.GetRequiredService<DataContext>();
    await Seed.SeedData(ctx);
}
catch (Exception ex)
{
    var logger = services.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex, "An error occurred during migration");
}

app.Run();