import { v4 as uuid } from "uuid";
import { makeAutoObservable, runInAction } from "mobx";
//Models & Types
import { KanbanBoard, Project, Task } from "../models/project";
//API Agent
import agent from "../api/agent";

export default class ProjectStore
{
    projectRegistry = new Map<string, Project>();
    kanbanBoardRegistry = new Map<string, KanbanBoard>();
    taskRegistry = new Map<string, Task>();
    selectedProject: Project | undefined = undefined;
    editMode = false;
    editProjectId: string | null = null;
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
            projects.forEach( project =>
            {
                project.dueDate = new Date( project.dueDate );
                this.projectRegistry.set( project.id, project );
            } );
            this.setLoadingInitial( false );
        }
        catch ( err )
        {
            console.log( err );
            this.setLoadingInitial( false );
        }
    };

    loadKanbanBoard = async ( id: string ) =>
    {
        try
        {
            const kanbanBoard = await agent.kanbanBoards.get( id );
            this.kanbanBoardRegistry.set( kanbanBoard.id, kanbanBoard );
            return kanbanBoard;
        }
        catch ( err )
        {
            console.log( err );
        }
        return null;
    };

    loadTasks = async () =>
    {
        try
        {
            const tasks = await agent.tasks.list();
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
        return [];
    };

    updateTaskInKanbanBoard = async ( task: Task ) =>
    {
        this.loading = true;
        try
        {
            await agent.tasks.updateTask( task );
            runInAction( () =>
            {
                const project = this.projectRegistry.get( task.projectId );
                if ( project )
                {
                    let kanbanBoard = { ...project.kanbanBoard };
                    kanbanBoard.tasks = [ ...kanbanBoard.tasks ];
                    kanbanBoard = {
                        ...kanbanBoard,
                        tasks: kanbanBoard.tasks.map( t => t.id === task.id ? task : t ),
                    };
                    project.kanbanBoard = kanbanBoard;
                    this.projectRegistry.set( project.id, project );
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

    selectProject = ( id: string ) =>
    {
        this.selectedProject = this.projectRegistry.get( id );
    };

    cancelSelectedProject = () =>
    {
        this.selectedProject = undefined;
    };

    openForm = ( id?: string ) =>
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
                this.projectRegistry.set( project.id, project );
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
                this.projectRegistry.set( project.id, project );
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

    deleteProject = async ( id: string ) =>
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