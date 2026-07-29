import './Tasklist.css';

function Tasklist() {

    let tasks = [
        { name: "Task 1", completed: false },
        { name: "Task 2", completed: true },
        { name: "Task 3", completed: false }
    ];

    return (
        <div className="task-list">
            <h2>Task List</h2>
            {!tasks.length && <p>No tasks available</p>}
            <ul>
                {tasks.map((task, index) => (
                    <li key={index} className={`task-item ${task.completed ? "completed" : "pending"}`}>
                        <h3>{task.name}</h3>
                        <p className={task.completed ? "completed" : "pending"}>
                            {task.completed ? "Completed" : "Pending"}
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Tasklist;