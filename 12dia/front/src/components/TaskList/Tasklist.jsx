import Button from "../Button/Button";
import Task from "../Task/Task";
import './Tasklist.css';

function TaskList() {
        fetch('http://localhost:3000/tasks')
        .then(response => response.json())
        .then(data => {
            tasks = data;
        })

        let tasks = [
        {
            title: "Design landing page",
            description: "Create the hero section and responsive layout.",
            dueDate: "2024-06-30",
            priority: "High",
            status: "In Progress"
        },
        {
            title: "Build login form",
            description: "Add validation and connect to auth API.",
            dueDate: "2024-07-02",
            priority: "Medium",
            status: "Pending"
        },
        {
            title: "Optimize images",
            description: "Compress assets and add proper image formats.",
            dueDate: "2024-07-04",
            priority: "Low",
            status: "Done"
        },
        {
            title: "Write unit tests",
            description: "Cover task rendering and button interactions.",
            dueDate: "2024-07-05",
            priority: "High",
            status: "In Progress"
        },
        {
            title: "Deploy to staging",
            description: "Publish the latest build to the staging environment.",
            dueDate: "2024-07-06",
            priority: "Medium",
            status: "Pending"
        }
    ];

  return (
    <>
    <div className="task-list-container">
        <div className="task-list">
            {tasks.map((task, index) => (
                <Task key={index} task={task} />
            ))}
        </div>
        <div className="task-list-actions">
            <Button value="Add Task" onClick={() => console.log("Add Task clicked")} />
        </div>
    </div>
    </>
  );
}

export default TaskList;