import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { observer } from "mobx-react-lite";
import ObjectID from "bson-objectid";
//API Agent
import agent from "../../app/api/agent";
//Stores
import { useStore } from "../../app/stores/store";
//Types & Models
import { KanbanBoard as KanbanBoardModel, TaskStatus as ProjectTaskStatus, Task, TaskStatus } from "../../app/models/project";
import { DroppableIdToTaskStatus, TaskStatusMap, TaskStatusToDroppableId } from "../../app/models/enumsMap";
//Components
import TaskCreationForm from "./TaskCreationForm";
import TaskEditForm from "./TaskEditForm";
import Modal from "../../Components/Modal/Modal";
//Styles
import "./KanbanBoard.scss";

enum ModalContent
{
    TaskDetails,
    TaskCreationForm,
    EditTaskForm
}

const allTaskStatuses: ProjectTaskStatus[] = Object.keys( ProjectTaskStatus ) as ProjectTaskStatus[];

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
    const { loadKanbanBoard, updateTaskInKanbanBoard, loadTasks, lastEditedTask } = projectStore;

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
    const [ editTask, setEditTask ] = useState<Task>();

    const TaskStatusStrings: { [ key in TaskStatus ]: string } =
    {
        [ TaskStatus.ToDo ]: "To Do",
        [ TaskStatus.InProgress ]: "In Progress",
        [ TaskStatus.InReview ]: "Review",
        [ TaskStatus.Done ]: "Done",
    };

    const handleTaskCreated = ( newTask: Task ) =>
    {
        if ( kanbanBoard && kanbanBoard.title )
        {
            setKanbanBoard( {
                ...kanbanBoard,
                tasks: [ ...kanbanBoard.tasks, newTask ],
                title: kanbanBoard.title
            } );
            setAllTasks( [ ...allTasks, newTask ] );
        }
        else
        {
            // Handle the case where kanbanBoard or kanbanBoard.title is undefined
        }
    };

    //#region  Modal
    const [ modalVisible, setModalVisible ] = useState( false );
    const [ selectedTask, setSelectedTask ] = useState<Task | null>( null );
    const [ modalContent, setModalContent ] = useState<ModalContent | null>( null );

    const openModal = ( task: Task | null, content: ModalContent ) =>
    {
        setSelectedTask( task );
        setModalContent( content );
        setModalVisible( true );
    };

    const closeModal = () =>
    {
        setSelectedTask( null );
        setModalContent( null );
        setModalVisible( false );
    };

    const handleEdit = ( task: Task ) =>
    {
        setSelectedTask( task );
        setModalContent( ModalContent.EditTaskForm );
        setModalVisible( true );
    };

    const handleEditTask = async ( updatedTask: Task ) =>
    {
        if ( !kanbanBoard )
        {
            console.error( "KanbanBoard is null" );
            return;
        }
        if ( updatedTask.projectId && updatedTask.id )
        {
            try
            {
                // Update the task in the server and capture the response
                const updatedTaskFromServer = await agent.tasks.editTask( updatedTask.projectId, updatedTask.id, updatedTask );

                // We update the task in the state based on the server response
                const newTasks = [ ...allTasks ];
                const taskIndex = newTasks.findIndex( task => task.id === updatedTaskFromServer.id ); // find index of updated task

                if ( taskIndex !== -1 )
                {
                    newTasks[ taskIndex ] = updatedTaskFromServer; // replace old task with updated task
                    setAllTasks( newTasks ); // set the new state
                    reorganizeTasks();

                    // Update the kanbanBoard state as well
                    const updatedKanbanBoardTasks = kanbanBoard.tasks.map( task =>
                        task.id === updatedTaskFromServer.id ? updatedTaskFromServer : task
                    );
                    const updatedKanbanBoardTitle = kanbanBoard.title;
                    setAllTasks( newTasks.map( task => ( { ...task } ) ) ); // Create a new object for each task

                    setKanbanBoard( {
                        ...kanbanBoard,
                        tasks: updatedKanbanBoardTasks.map( task => ( { ...task } ) ), // Create a new object for each task
                        title: updatedKanbanBoardTitle
                    } );

                    // Update the selected task
                    setSelectedTask( updatedTaskFromServer );
                    // Update the editTask state
                    setEditTask( updatedTaskFromServer );
                }
            }
            catch ( error )
            {
                console.error( "Failed to update task: ", error );
            }
        }
    };

    const handleDelete = async ( task: Task ) =>
    {
        try
        {
            if ( id && task.id )
            {
                await agent.tasks.deleteTask( id, task.id );

                // Update local state
                setAllTasks( allTasks.filter( t => t.id !== task.id ) );
                if ( kanbanBoard )
                {
                    setKanbanBoard( {
                        ...kanbanBoard,
                        tasks: kanbanBoard.tasks.filter( t => t.id !== task.id ),
                    } );
                }

                // Close the modal
                closeModal();
            }
            else
            {
                console.error( "id or task.id is undefined" );
            }
        }
        catch ( err )
        {
            console.error( "Failed to delete task:", err );
        }
    };
    //#endregion Modal

    const reorganizeTasks = () =>
    {
        let newAllTasks: Task[] = [];
        allTaskStatuses.forEach( status =>
        {
            newAllTasks = newAllTasks.concat( allTasks.filter( task => task.status === status ) );
        } );
        setAllTasks( newAllTasks );
    };

    useEffect( () =>
    {
        const loadBoardAndTasks = async () =>
        {
            if ( id )
            {
                setIsLoading( true );
                const loadedBoard = await loadKanbanBoard( id! );
                setKanbanBoard( loadedBoard );

                if ( loadedBoard && loadedBoard.projectId )
                {
                    const project = await agent.projects.details( loadedBoard.projectId );
                    setProjectName( project.title );
                }

                const tasks = await loadTasks( id! );
                setAllTasks( tasks );
                setIsLoading( false );
            }
        };
        loadBoardAndTasks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ id ] );

    useEffect( () =>
    {
        if ( lastEditedTask !== undefined )
        {
            console.log( "lastEditedTask changed", lastEditedTask );
            setSelectedTask( lastEditedTask ?? null );
        }
    }, [ lastEditedTask ] );

    if ( !kanbanBoard )
    {
        return <div>Loading...</div>;
    }

    const onDragEnd = async ( result: DropResult ) =>
    {
        const { destination, source, draggableId } = result;

        if ( !destination )
        {
            return;
        }

        const task = kanbanBoard.tasks.find( t => t.id?.toString() === draggableId );

        if ( task )
        {
            const newTask = { ...task, status: getTaskStatusFromDroppableIdString( destination.droppableId ) };

            if ( newTask.id )
            {
                try
                {
                    await agent.tasks.updateTaskStatus(
                        newTask.id.toString(),
                        getTaskStatusFromDroppableIdString( destination.droppableId )
                    );

                    // update task in kanbanBoard
                    const newKanbanBoard = {
                        ...kanbanBoard,
                        tasks: kanbanBoard.tasks.map( ( t ) =>
                            t.id === newTask.id ? newTask : t
                        ),
                    };

                    setKanbanBoard( newKanbanBoard );
                    updateTaskInKanbanBoard( newTask );

                    // Update allTasks
                    const updatedAllTasks = allTasks.map( ( t ) =>
                        t.id === newTask.id ? newTask : t
                    );

                    setAllTasks( updatedAllTasks );
                }
                catch ( error )
                {
                    console.log( "An error occurred while moving the task: ", error );
                }
            }
        }
    };

    const getTasksByStatus = ( status: ProjectTaskStatus ) =>
    {
        return allTasks.filter( task => task.status ? task.status === status : false );
    };

    function getTaskStatusFromDroppableId ( status: TaskStatus )
    {
        return TaskStatusToDroppableId[ status ];
    }

    // Function to convert droppableId back to status
    function getTaskStatusFromDroppableIdString ( droppableId: string ): TaskStatus
    {
        const status = DroppableIdToTaskStatus[ droppableId ];

        if ( !status )
        {
            throw new Error( `Invalid droppableId: ${ droppableId }` );
        }

        return status;
    }

    return (
        <>
            <Modal
                show={ modalVisible }
                closeModal={ () => closeModal() }
            >
                { modalContent === ModalContent.TaskDetails && selectedTask &&
                    <>
                        <h3>{ selectedTask.name }</h3>
                        <p>Description: { selectedTask.description }</p>
                        <p>Due date: { new Date( selectedTask?.dueDate ).toLocaleDateString() }</p>
                        <p>People assigned: { selectedTask.peopleAssigned.join( ", " ) }</p>
                        <p>Status: { selectedTask.status }</p>
                        <button onClick={ () => handleDelete( selectedTask ) }>Delete Task</button>
                        <button onClick={ () => handleEdit( selectedTask ) }>Edit Task</button>
                    </>
                }

                { modalContent === ModalContent.EditTaskForm && selectedTask &&
                    <TaskEditForm
                        task={ selectedTask }
                        onEdit={ handleEditTask }
                        closeModal={ closeModal }
                        editTask={ editTask }
                        setEditTask={ setEditTask }
                    />
                }
            </Modal>
            <h1 className="project-title">{ projectName }</h1>
            <DragDropContext onDragEnd={ onDragEnd }>
                <div className="kanban-board">
                    { allTaskStatuses.map( status =>
                    {
                        return (
                            <Droppable key={ status } droppableId={ getTaskStatusFromDroppableId( status ) }>
                                { ( provided, snapshot ) => (
                                    <div
                                        className={ `kanban-column ${ snapshot.isDraggingOver ? "dragging-over" : "" }` }
                                        { ...provided.droppableProps }
                                        ref={ provided.innerRef }
                                    >
                                        <h3>{ TaskStatusMap[ status ] }</h3>
                                        <div className="task-list">
                                            { getTasksByStatus( status ).map( ( task: Task, index: number ) => (
                                                <Draggable key={ task.id?.toString() || "fallback" } draggableId={ task.id?.toString() || "fallback" } index={ index }>
                                                    { ( provided, snapshot ) => (
                                                        <div
                                                            className={ `task ${ snapshot.isDragging ? "is-dragging" : "" }` }
                                                            ref={ provided.innerRef }
                                                            { ...provided.draggableProps }
                                                        >
                                                            <hr className="task-divider" />
                                                            <div { ...provided.dragHandleProps }>
                                                                <div onClick={ () => openModal( task, ModalContent.TaskDetails ) }>
                                                                    { task.name }
                                                                </div>
                                                            </div>
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
                                                onTaskCreated={ handleTaskCreated }
                                            />
                                        ) }
                                    </div>
                                ) }
                            </Droppable>
                        );
                    } ) }
                </div>
            </DragDropContext >
        </>
    );
};


export default observer( KanbanBoard );