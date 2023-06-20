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
    taskRegistry = new Map<ObjectID, Task>();
    selectedProject: Project | undefined = undefined;
    editMode = false;
    editProjectId: ObjectID | null = null;
    loading = false;
    loadingInitial = true;
    lastEditedTask: Task | undefined = undefined;

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
            const projects = await agent.Projects.list();

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
                project = await agent.Projects.details( projectId );
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
            const tasks = await agent.Tasks.getTasksByProject( projectId );
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
            await agent.Tasks.updateTaskStatus( task.id!.toString(), task.status );
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

    editTask = async ( projectId: ObjectID, taskId: ObjectID, task: Task ) =>
    {
        try
        {
            const updatedTask = await agent.Tasks.editTask( projectId, taskId, task );
            runInAction( () =>
            {
                this.taskRegistry.set( taskId, updatedTask );
                this.lastEditedTask = updatedTask; // Update the lastEditedTask state

                // also update the task in the kanbanBoard
                const project = this.projectRegistry.get( projectId );
                if ( project )
                {
                    let kanbanBoard = { ...project.kanbanBoard };
                    kanbanBoard.tasks = [ ...kanbanBoard.tasks ];
                    kanbanBoard =
                    {
                        ...kanbanBoard,
                        tasks: kanbanBoard.tasks.map( t => t.id === taskId ? updatedTask : t ),
                    };
                    project.kanbanBoard = kanbanBoard;
                    this.projectRegistry.set( projectId, project );
                }
            } );
        }
        catch ( error )
        {
            console.log( error );
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
            const createdTask = await agent.Tasks.addTask( task.projectId, task );
            runInAction( () =>
            {
                console.log( "Created task: ", createdTask );
                if ( createdTask.id !== undefined )
                {
                    this.taskRegistry.set( createdTask.id, createdTask );

                    // Update the task in the project's kanbanBoard
                    const project = this.projectRegistry.get( task.projectId );
                    if ( project )
                    {
                        const kanbanBoard = { ...project.kanbanBoard };
                        kanbanBoard.tasks = [ ...kanbanBoard.tasks, createdTask ];
                        project.kanbanBoard = kanbanBoard;
                        this.projectRegistry.set( project.id!, project );
                    }
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
            await agent.Projects.create( project );
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
            await agent.Projects.update( project );
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
            await agent.Projects.delete( id );
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