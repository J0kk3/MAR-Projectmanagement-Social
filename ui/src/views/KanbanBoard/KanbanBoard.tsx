import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { observer } from "mobx-react-lite";
import ObjectID from "bson-objectid";
import { v4 as uuid } from "uuid";
//Stores
import { useStore } from "../../app/stores/store";
//Types & Models
import { KanbanBoard as KanbanBoardModel, TaskStatus as ProjectTaskStatus, Task } from "../../app/models/project";
//Components
import TaskCreationForm from "./TaskCreationForm";

const taskStatusTitles: { [ key in ProjectTaskStatus ]: string } =
{
    [ ProjectTaskStatus.ToDo ]: "To Do",
    [ ProjectTaskStatus.InProgress ]: "In Progress",
    [ ProjectTaskStatus.InReview ]: "Review",
    [ ProjectTaskStatus.Done ]: "Done",
};

const allTaskStatuses: ProjectTaskStatus[] = Object.values( ProjectTaskStatus ).filter( v => typeof v === "string" ) as ProjectTaskStatus[];

const KanbanBoard = () =>
{
    const { id: idString } = useParams<{ id: string; }>();
    let id: ObjectID | undefined;
    if ( idString )
    {
        try
        {
            id = new ObjectID( idString );
        }
        catch ( err )
        {
            console.error( `Invalid ID: ${ idString }` );
        }
    }

    const { projectStore } = useStore();
    const { loadKanbanBoard, updateTaskInKanbanBoard, loadTasks } = projectStore;

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
                setIsLoading(true);
                const loadedBoard = await loadKanbanBoard( id );
                setKanbanBoard( loadedBoard );
                const tasks = await loadTasks( id );
                setAllTasks( tasks );
                setIsLoading(false);
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
            task.status = Number( destination.droppableId );
            updateTaskInKanbanBoard( task );
            setKanbanBoard( { ...kanbanBoard, tasks: [ ...kanbanBoard.tasks ] } );
        }
    };

    const getTasks = ( status: ProjectTaskStatus ) =>
    {
        return allTasks.filter( task => task.status === status );
    };

    return (
        <>
            <DragDropContext onDragEnd={ onDragEnd }>
                { allTaskStatuses.map( status => (
                    <Droppable droppableId={ String( status ) } key={ String( status ) }>
                        { ( provided, snapshot ) => (
                            <div { ...provided.droppableProps } ref={ provided.innerRef }>
                                <h3>{ taskStatusTitles[ status ] }</h3>
                                { getTasks( status ).map( ( task, index ) => (
                                    <Draggable key={ uuid() } draggableId={ task.id || "fallback" } index={ index }>
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
                                <button onClick={ () => setShowAddTaskForms( { ...showAddTaskForms, [ status ]: !showAddTaskForms[ status ] } ) }>
                                    { showAddTaskForms[ status ] ? "Cancel" : "Add Task" }
                                </button>
                                { showAddTaskForms[ status ] && (
                                    <TaskCreationForm
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
            </DragDropContext>
        </>
    );
};

export default observer( KanbanBoard );