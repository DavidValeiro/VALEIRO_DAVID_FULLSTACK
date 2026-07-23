const Task = require('../models/task');

function createTask(req, res) {
    const { title, description, status } = req.body;
    const newTask = new Task({ title, description, status });
    newTask.save()
        .then(task => res.status(201).json(task))
        .catch(err => res.status(400).json({ message: err.message }));
}

function getTasks(req, res) {
    Task.find()
        .then(tasks => res.json(tasks))
        .catch(err => res.status(500).json({ message: err.message }));
}

function getTaskById(req, res) {
    Task.findById(req.params.id)
        .then(task => {
            if (!task) {
                return res.status(404).json({ message: 'Task not found' });
            }
            res.json(task);
        })
        .catch(err => res.status(500).json({ message: err.message }));
}

function updateTask(req, res) {
    Task.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' })
        .then(updatedTask => {
            if (!updatedTask) {
                return res.status(404).json({ message: 'Task not found' });
            }
            res.json(updatedTask);
        })
        .catch(err => res.status(500).json({ message: err.message }));
}

function deleteTask(req, res) {
    Task.findByIdAndDelete(req.params.id)
        .then(deletedTask => {
            if (!deletedTask) {
                return res.status(404).json({ message: 'Task not found' });
            }
            res.json({ message: 'Task deleted' });
        })
        .catch(err => res.status(500).json({ message: err.message }));
}

module.exports = {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask
};