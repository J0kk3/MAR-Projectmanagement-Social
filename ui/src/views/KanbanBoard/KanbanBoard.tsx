import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { observer } from "mobx-react-lite";
import ObjectID from "bson-objectid";
//API Agent
import agent from "../../app/api/agent";
//Stores
import { useStore } from "../../app/stores/store";
//Types & Models
import { KanbanBoard as KanbanBoardModel, TaskStatus, Task } from "../../app/models/project";
import { DroppableIdToTaskStatus, TaskStatusToDroppableId } from "../../app/models/enumsMap";
import { ModalContent } from "../../app/models/taskEnums";
//Components
import TaskEditForm from "./TaskEditForm";
import Modal from "../../Components/Modal/Modal";
import KanbanColumn from "./KanbanColumn/KanbanColumn";
import TaskDetails from "./Task/TaskDetails";
//Styles
import "./KanbanBoard.scss";

const allTaskStatuses: TaskStatus[] = Object.keys( TaskStatus ) as TaskStatus[];

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

    const { projectStore, userStore } = useStore();
    const { loadKanbanBoard, updateTaskInKanbanBoard, loadTasks, lastEditedTask, createTaskInKanbanBoard } = projectStore;
    const { user } = userStore;

    const [ projectName, setProjectName ] = useState( "" );
    const [ isLoading, setIsLoading ] = useState( false );
    const [ kanbanBoard, setKanbanBoard ] = useState<KanbanBoardModel | null>( null );
    const [ showAddTaskForms, setShowAddTaskForms ] = useState<Record<TaskStatus, boolean>>(
        {
            [ TaskStatus.ToDo ]: true,
            [ TaskStatus.InProgress ]: true,
            [ TaskStatus.InReview ]: true,
            [ TaskStatus.Done ]: true
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
        if ( updatedTask.projectId && updatedTask.id && user )
        {
            try
            {
                // Update the task in the server and capture the response
                const { id: userId } = user;
                const updatedTaskFromServer = await agent.Tasks.editTask( userId.toString(), updatedTask.projectId, updatedTask.id, updatedTask );

                console.log( "Updated task from server: ", updatedTaskFromServer );

                // We update the task in the state based on the server response
                const newTasks = [ ...allTasks ];
                const taskIndex = newTasks.findIndex( task => task.id === updatedTaskFromServer.id ); // find index of updated task

                if ( taskIndex !== -1 )
                {
                    newTasks[ taskIndex ] = updatedTaskFromServer; // replace old task with updated task
                    setAllTasks( newTasks ); // set the new state
                    reorganizeTasks();

                    // Update the kanbanBoard state as well
                    const updatedKanbanBoardTasks = kanbanBoard.tasks.map( ( task ) =>
                        task.id === updatedTaskFromServer.id ? updatedTaskFromServer : task
                    );
                    const updatedKanbanBoardTitle = kanbanBoard.title;

                    console.log( "Updated Kanban board tasks: ", updatedKanbanBoardTasks );

                    setKanbanBoard(
                        {
                            ...kanbanBoard,
                            tasks: updatedKanbanBoardTasks.map( task => ( { ...task } ) ),
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
            if ( id && task.id && user )
            {
                // await agent.Tasks.deleteTask( id, task.id );
                const { id: userId } = user;
                await agent.Tasks.deleteTask( userId.toString(), id, task.id );

                // Update local state
                setAllTasks( allTasks.filter( t => t.id !== task.id ) );
                if ( kanbanBoard )
                {
                    setKanbanBoard(
                        {
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
                console.log( "Before loadKanbanBoard" );
                const loadedBoard = await loadKanbanBoard( id );
                console.log( "After loadKanbanBoard", loadedBoard );
                setKanbanBoard( loadedBoard );

                if ( loadedBoard && loadedBoard.projectId )
                {
                    const project = await agent.Projects.details( loadedBoard.projectId );
                    setProjectName( project.title );
                }

                console.log( "Before loadTasks" );
                const tasks = await loadTasks( id );
                console.log( "After loadTasks", tasks );
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
            const newTask: Task = { ...task, status: getTaskStatusFromDroppableIdString( destination.droppableId ) };

            if ( newTask.id )
            {
                try
                {
                    await agent.Tasks.updateTaskStatus(
                        newTask.id,
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
                    const updatedAllTasks: Task[] = allTasks.map( ( t ) =>
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

    const getTasksByStatus = ( status: TaskStatus ) =>
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
            <Modal show={ modalVisible } closeModal={ closeModal }>
                { modalContent === ModalContent.TaskDetails && selectedTask && (
                    <TaskDetails task={ selectedTask } handleDelete={ handleDelete } handleEdit={ handleEdit } />
                ) }

                { modalContent === ModalContent.EditTaskForm && selectedTask && (
                    <TaskEditForm
                        task={ selectedTask }
                        onEdit={ handleEditTask }
                        closeModal={ closeModal }
                        editTask={ editTask }
                        setEditTask={ setEditTask }
                    />
                ) }
            </Modal>

            <h1 className="project-title">{ projectName }</h1>
            <DragDropContext onDragEnd={ onDragEnd }>
                <div className="kanban-board">
                    { allTaskStatuses.map( ( status ) => (
                        <KanbanColumn
                            status={ status }
                            getTasksByStatus={ getTasksByStatus }
                            getTaskStatusFromDroppableId={ getTaskStatusFromDroppableId }
                            showAddTaskForms={ showAddTaskForms }
                            setShowAddTaskForms={ setShowAddTaskForms }
                            kanbanBoard={ kanbanBoard }
                            setKanbanBoard={ setKanbanBoard }
                            allTasks={ allTasks }
                            setAllTasks={ setAllTasks }
                            openModal={ openModal }
                            key={ status }
                        />
                    ) ) }
                </div>
            </DragDropContext>
        </>
    );
};


export default observer( KanbanBoard );