import React from 'react';
import './Task.css';
import Button from "../Button/Button";

function Task({ task }) {

    return (
        <div className="task-item">
            <div className="task-content">
                <h2 className="task-title">{task.title}</h2>
                <p className="task-description">{task.description}</p>
                <p className="task-due-date">Due Date: {task.dueDate}</p>
                <p className="task-priority">Priority: {task.priority}</p>
                <p className="task-status">Status: {task.status}</p>
            </div>
            <div className="task-actions">
                <Button value="Delete" onClick={() => console.log("Delete clicked")} />
            </div>
        </div>
    );
}

export default Task;