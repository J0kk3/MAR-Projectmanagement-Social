import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { observer } from "mobx-react-lite";
import ObjectID from "bson-objectid";
//Stores
import { useStore } from "../../app/stores/store";
//Types & Models
import { KanbanBoard as KanbanBoardModel, Project, TaskStatus as ProjectTaskStatus, Task } from "../../app/models/project";
//Components
import TaskCreationForm from "./TaskCreationForm";
//Styles
import "./KanbanBoard.scss";
import agent from "../../app/api/agent";

const taskStatusTitles: { [ key in ProjectTaskStatus ]: string } =
{
    [ ProjectTaskStatus.ToDo ]: "To Do",
    [ ProjectTaskStatus.InProgress ]: "In Progress",
    [ ProjectTaskStatus.InReview ]: "Review",
    [ ProjectTaskStatus.Done ]: "Done",
};

const allTaskStatuses: ProjectTaskStatus[] = Object.keys( ProjectTaskStatus )
    .map( key => Number( ProjectTaskStatus[ key as keyof typeof ProjectTaskStatus ] ) )
    .filter( value => !isNaN( value ) ) as ProjectTaskStatus[];

const KanbanBoard = () =>
{
    const { id: idString } = useParams<{ id: string; }>();
    const id = useMemo( () =>
    {
        if ( idString )
        {
            try
            {
                return new ObjectID( idString );
            }
            catch ( err )
            {
                console.error( `Invalid ID: ${ idString }` );
                return undefined;
            }
        }


        return undefined;
    }, [ idString ] );

    const { projectStore } = useStore();
    const { loadKanbanBoard, updateTaskInKanbanBoard, loadTasks } = projectStore;

    const [ projectName, setProjectName ] = useState( "" );
    const [ isLoading, setIsLoading ] = useState( false );
    const [ kanbanBoard, setKanbanBoard ] = useState<KanbanBoardModel | null>( null );
    const [ showAddTaskForms, setShowAddTaskForms ] = useState<Record<ProjectTaskStatus, boolean>>(
        {
            [ ProjectTaskStatus.ToDo ]: false,
            [ ProjectTaskStatus.InProgress ]: false,
            [ ProjectTaskStatus.InReview ]: false,
            [ ProjectTaskStatus.Done ]: false
        } );
    const [ allTasks, setAllTasks ] = useState<Task[]>( [] );

    useEffect( () =>
    {
        const loadBoardAndTasks = async () =>
        {
            if ( id )
            {
                setIsLoading( true );
                const loadedBoard = await loadKanbanBoard( id );
                setKanbanBoard( loadedBoard );

                if ( loadedBoard && loadedBoard.projectId )
                {
                    const project = await agent.projects.details( loadedBoard.projectId );
                    setProjectName( project.title );
                }

                const tasks = await loadTasks( id );
                console.log( "Fetched tasks: ", tasks );
                setAllTasks( tasks );
                setIsLoading( false );
            }
        };
        loadBoardAndTasks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ id ] );

    if ( !kanbanBoard )
    {
        return <div>Loading...</div>;
    }

    const onDragEnd = ( result: DropResult ) =>
    {
        const { destination, source, draggableId } = result;

        if ( !destination )
        {
            return;
        }

        const task = kanbanBoard.tasks.find( t => t.id === draggableId );

        if ( task )
        {
            task.taskColumn = destination.droppableId;
            // Using agent to call the API
            agent.tasks.updateTaskStatus(
                {
                    ...task,
                    taskColumn: destination.droppableId,
                } ).then( () =>
                {
                    // If successful, update the local state
                    updateTaskInKanbanBoard( task );
                    setKanbanBoard( { ...kanbanBoard, tasks: [ ...kanbanBoard.tasks ] } );
                } ).catch( error =>
                {
                    console.log( "An error occurred while moving the task: ", error );
                } );
        }
    };

    const getTasksByStatus = ( status: ProjectTaskStatus ) =>
    {
        return allTasks.filter( task => task.taskColumn === String( status ) );
    };

    return (
        <>
            <h1 className="project-title">{ projectName }</h1>
            <DragDropContext onDragEnd={ onDragEnd }>
                <div className="kanban-board">
                    { allTaskStatuses.map( status => (
                        <Droppable droppableId={ String( status ) } key={ String( status ) }>
                            { ( provided, snapshot ) => (
                                <div className="kanban-column" { ...provided.droppableProps } ref={ provided.innerRef }>
                                    <h3>{ taskStatusTitles[ status ] }</h3>
                                    <div className="task-list">
                                        { getTasksByStatus( status ).map( ( task: Task, index: number ) => (
                                            <Draggable key={ task.id } draggableId={ task.id || "fallback" } index={ index }>
                                                { ( provided, snapshot ) => (
                                                    <div
                                                        ref={ provided.innerRef }
                                                        { ...provided.draggableProps }
                                                        { ...provided.dragHandleProps }
                                                    >
                                                        { task.name }
                                                    </div>
                                                ) }
                                            </Draggable>
                                        ) ) }
                                        { provided.placeholder }
                                    </div>
                                    { !showAddTaskForms[ status ] &&
                                        <button className="add-task-button" onClick={ () => setShowAddTaskForms( { ...showAddTaskForms, [ status ]: true } ) }>
                                            Add Task
                                        </button>
                                    }
                                    { showAddTaskForms[ status ] && (
                                        <TaskCreationForm
                                            showCancelButton={ true }
                                            onCancel={ () => setShowAddTaskForms( { ...showAddTaskForms, [ status ]: false } ) }
                                            status={ status }
                                            setShowAddTaskForms={ setShowAddTaskForms }
                                            showAddTaskForms={ showAddTaskForms }
                                            setKanbanBoard={ setKanbanBoard }
                                            kanbanBoard={ kanbanBoard }
                                            setAllTasks={ setAllTasks }
                                            allTasks={ allTasks }
                                        />
                                    ) }
                                </div>
                            ) }
                        </Droppable>
                    ) ) }
                </div>
            </DragDropContext>
        </>
    );
};


export default observer( KanbanBoard );