const express = require('express');
const app = express();

app.use(express.json());

let tasks = [];

// Create Task
app.post('/tasks', (req, res) => {
    const task = { id: Date.now(), name: req.body.name };
    tasks.push(task);
    res.status(201).send(task);
});

// Get Tasks
app.get('/tasks', (req, res) => {
    res.send(tasks);
});

// Update Task
app.put('/tasks/:id', (req, res) => {
    const task = tasks.find(t => t.id == req.params.id);
    if (!task) return res.status(404).send("Not found");

    task.name = req.body.name;
    res.send(task);
});

// Delete Task
app.delete('/tasks/:id', (req, res) => {
    tasks = tasks.filter(t => t.id != req.params.id);
    res.send("Deleted");
});

const PORT = process.env.PORT || 80;
app.listen(PORT, () => console.log(`Running on port ${PORT}`));