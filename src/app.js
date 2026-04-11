const express = require('express');
const app = express();

app.use(express.json());

// In-memory "database"
let jerseys = [
    { id: 1, name: "Real Madrid Home Kit", price: 90 },
    { id: 2, name: "Barcelona Away Kit", price: 85 },
    { id: 3, name: "Manchester United Home Kit", price: 95 }
];

// -------------------- FRONTEND --------------------

// Main page (homepage)
app.get("/", (req, res) => {
    let html = `
        <h1>⚽ Soccer Jersey Store</h1>
        <p>Welcome to our microservice-powered jersey shop!</p>
        <h2>Available Jerseys:</h2>
        <ul>
            ${jerseys.map(j => `<li>${j.name} - $${j.price}</li>`).join("")}
        </ul>
        <p>API Endpoint: <a href="/jerseys">/jerseys</a></p>
    `;
    res.send(html);
});

// -------------------- API --------------------

// Get all jerseys
app.get('/jerseys', (req, res) => {
    res.json(jerseys);
});

// Get one jersey
app.get('/jerseys/:id', (req, res) => {
    const jersey = jerseys.find(j => j.id == req.params.id);
    if (!jersey) return res.status(404).send("Jersey not found");
    res.json(jersey);
});

// Add jersey
app.post('/jerseys', (req, res) => {
    const newJersey = {
        id: Date.now(),
        name: req.body.name,
        price: req.body.price
    };
    jerseys.push(newJersey);
    res.status(201).json(newJersey);
});

// Update jersey
app.put('/jerseys/:id', (req, res) => {
    const jersey = jerseys.find(j => j.id == req.params.id);
    if (!jersey) return res.status(404).send("Not found");

    jersey.name = req.body.name;
    jersey.price = req.body.price;

    res.json(jersey);
});

// Delete jersey
app.delete('/jerseys/:id', (req, res) => {
    jerseys = jerseys.filter(j => j.id != req.params.id);
    res.send("Deleted");
});

// -------------------- SERVER --------------------

const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log("⚽ Jersey Store running on port " + port);
});