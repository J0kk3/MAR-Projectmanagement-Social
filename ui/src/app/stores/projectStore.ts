import { v4 as uuid } from "uuid";
import { makeAutoObservable, runInAction } from "mobx";
//Models & Types
import { Project } from "../models/project";
//API Agent
import agent from "../api/agent";

export default class ProjectStore
{
    projects: Project[] = [];
    selectedProject: Project | undefined = undefined;
    editMode = false;
    loading = false;
    loadingInitial = false;

    constructor ()
    {
        makeAutoObservable( this );
    }

    loadProjects = async () =>
    {
        this.setLoadingInitial( true );
        try
        {
            const projects = await agent.projects.list();
            projects.forEach( project =>
            {
                project.dueDate = new Date( project.dueDate );
                this.projects.push( project );
            } );
            this.setLoadingInitial( false );
        }
        catch ( err )
        {
            console.log( err );
            this.setLoadingInitial( false );
        }
    };

    setLoadingInitial = ( state: boolean ) =>
    {
        this.loadingInitial = state;
    };

    selectProject = ( id: string ) =>
    {
        this.selectedProject = this.projects.find( a => a.id === id );
    };

    cancelSelectedProject = () =>
    {
        this.selectedProject = undefined;
    };

    openForm = ( id?: string ) =>
    {
        id ? this.selectProject( id ) : this.cancelSelectedProject();
        this.editMode = true;
    };

    closeForm = () =>
    {
        this.editMode = false;
    };

    createProject = async ( project: Project ) =>
    {
        this.loading = true;
        project.id = uuid();
        try
        {
            await agent.projects.create( project );
            runInAction( () =>
            {
                this.projects.push( project );
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
                this.projects = [ ...this.projects.filter( a => a.id !== project.id ), project ];
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
                this.projects = [ ...this.projects.filter( a => a.id !== id ) ];
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