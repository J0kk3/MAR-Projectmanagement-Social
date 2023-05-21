//the kanban board will be a drag and drop board that will allow the user to move tasks from one column to another
const KanbanBoard = () =>
{
    return (
        <>
            <h1>Kanban Board</h1>
            <section>
                <div>
                    <h3>Todo</h3>
                </div>
                <div>
                    <h3>In Progress</h3>
                </div>
                <div>
                    <h3>Review</h3>
                </div>
                <div>
                    <h3>Done</h3>
                </div>
            </section>
            <section>
                <div>
                    <button>Add Task</button>
                </div>
                <div>
                    <button>Add Task</button>
                </div>
                <div>
                    <button>Add Task</button>
                </div>
            </section>
        </>
    );
};

export default KanbanBoard;