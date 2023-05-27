/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { makeAutoObservable, runInAction } from "mobx";
import ObjectID from "bson-objectid";
//Models & Types
import { Project, Task } from "../models/project";
//API Agent
import agent from "../api/agent";

export default class ProjectStore
{
    projectRegistry = new Map<ObjectID, Project>();
    taskRegistry = new Map<string, Task>();
    selectedProject: Project | undefined = undefined;
    editMode = false;
    editProjectId: ObjectID | null = null;
    loading = false;
    loadingInitial = true;

    constructor ()
    {
        makeAutoObservable( this );
    }

    get projectsByDate ()
    {
        return Array.from( this.projectRegistry.values() ).sort( ( a, b ) => a.dueDate.getTime() - b.dueDate.getTime() );
    }

    loadProjects = async () =>
    {
        try
        {
            const projects = await agent.projects.list();

            runInAction( () =>
            {
                projects.forEach( project =>
                {
                    project.dueDate = new Date( project.dueDate );
                    this.projectRegistry.set( project.id!, project );
                } );
                this.setLoadingInitial( false );
            } );
        }
        catch ( err )
        {
            console.log( err );
            runInAction( () =>
            {
                this.setLoadingInitial( false );
            } );
        }
    };

    loadKanbanBoard = async ( projectId: ObjectID ) =>
    {
        this.loading = true;

        let project = this.projectRegistry.get( projectId );
        if ( !project && projectId !== undefined )
        {
            try
            {
                project = await agent.projects.details( projectId );
                if ( project )
                {
                    project.dueDate = new Date( project.dueDate );
                    this.projectRegistry.set( project.id!, project );
                }
            }
            catch ( err )
            {
                console.log( err );
            }
            finally
            {
                // stop loading regardless of success or error
                this.loading = false;
            }
        }
        else
        {
            // stop loading if the project already exists in the registry
            this.loading = false;
        }
        return project?.kanbanBoard || null;
    };

    loadTasks = async ( projectId: ObjectID ) =>
    {
        this.loading = true;
        try
        {
            const tasks = await agent.tasks.getTasksByProject( projectId );
            tasks.forEach( task =>
            {
                if ( task.id !== undefined )
                {
                    this.taskRegistry.set( task.id, task );
                }
                else
                {
                    console.error( "Task ID is undefined" );
                }
            } );
            return tasks;
        }
        catch ( err )
        {
            console.log( err );
        }
        finally
        {
            this.loading = false;
        }
        return [];
    };

    updateTaskInKanbanBoard = async ( task: Task ) =>
    {
        if ( task.projectId === undefined )
        {
            console.error( "Task projectId is undefined" );
            return;
        }

        this.loading = true;
        try
        {
            await agent.tasks.updateTaskStatus( task.id!, task.taskColumn );
            runInAction( () =>
            {
                const project = this.projectRegistry.get( task.projectId );
                if ( project )
                {
                    let kanbanBoard = { ...project.kanbanBoard };
                    kanbanBoard.tasks = [ ...kanbanBoard.tasks ];
                    kanbanBoard =
                    {
                        ...kanbanBoard,
                        tasks: kanbanBoard.tasks.map( t => t.id === task.id ? task : t ),
                    };
                    project.kanbanBoard = kanbanBoard;
                    this.projectRegistry.set( project.id!, project );
                }
            } );
        }
        catch ( err )
        {
            console.log( err );
        }
    };

    createTaskInKanbanBoard = async ( task: Task ) =>
    {
        if ( task.projectId === undefined )
        {
            console.error( "Task projectId is undefined" );
            return undefined;
        }

        this.loading = true;
        if ( task.projectId === undefined )
        {
            console.error( "ProjectId is undefined" );
            this.loading = false;
            return undefined;
        }
        try
        {
            const createdTask = await agent.tasks.addTask( task.projectId, task );
            runInAction( () =>
            {
                console.log( "Created task: ", createdTask );
                if ( createdTask.id !== undefined )
                {
                    this.taskRegistry.set( createdTask.id, createdTask );
                }
                else
                {
                    console.error( "Created task ID is undefined" );
                }
                this.loading = false;
            } );
            return createdTask;
        }
        catch ( err )
        {
            console.log( err );
            runInAction( () =>
            {
                this.loading = false;
            } );
            return undefined;
        }
    };

    setLoadingInitial = ( state: boolean ) =>
    {
        this.loadingInitial = state;
    };

    selectProject = ( id: ObjectID ) =>
    {
        this.selectedProject = this.projectRegistry.get( id );
    };

    cancelSelectedProject = () =>
    {
        this.selectedProject = undefined;
    };

    openForm = ( id?: ObjectID ) =>
    {
        id ? this.selectProject( id ) : this.cancelSelectedProject();
        this.editMode = true;
        this.editProjectId = id || null;
    };

    closeForm = () =>
    {
        this.editMode = false;
        this.editProjectId = null;
    };

    createProject = async ( project: Project ) =>
    {
        this.loading = true;
        try
        {
            await agent.projects.create( project );
            runInAction( () =>
            {
                this.projectRegistry.set( project.id!, project );
                this.editMode = false;
                this.loading = false;
            } );
        }
        catch ( err )
        {
            console.log( err );
            runInAction( () =>
            {
                this.loading = false;
            } );
        }
    };

    updateProject = async ( project: Project ) =>
    {
        this.loading = true;
        try
        {
            await agent.projects.update( project );
            runInAction( () =>
            {
                this.projectRegistry.set( project.id!, project );
                this.selectedProject = project;
                this.editMode = false;
                this.loading = false;
            } );
        }
        catch ( err )
        {
            console.log( err );
            runInAction( () =>
            {
                this.loading = false;
            } );
        }
    };

    deleteProject = async ( id: ObjectID ) =>
    {
        this.loading = true;
        try
        {
            await agent.projects.delete( id );
            runInAction( () =>
            {
                this.projectRegistry.delete( id );
                if ( this.selectedProject?.id === id ) this.cancelSelectedProject();
                this.loading = false;
            } );
        }
        catch ( err )
        {
            console.log( err );
            runInAction( () =>
            {
                this.loading = false;
            } );
        }
    };
}