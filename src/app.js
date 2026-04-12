const express = require('express');
const app = express();

app.use(express.json());

// In-memory "database"
let jerseys = [
    { id: 1, name: "Real Madrid Home Kit", price: 90, img: "https://via.placeholder.com/200" },
    { id: 2, name: "Barcelona Away Kit", price: 85 },
    { id: 3, name: "Manchester United Home Kit", price: 95 }
];

// -------------------- FRONTEND --------------------

// Main page (homepage)
app.get("/", (req, res) => {
    let html = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Soccer Jersey Store</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    </head>
    <body class="bg-light">

        <!-- Navbar -->
        <nav class="navbar navbar-dark bg-dark">
            <div class="container-fluid">
                <span class="navbar-brand mb-0 h1">⚽ Jersey Store</span>
            </div>
        </nav>

        <div class="container mt-4">

            <!-- Header -->
            <div class="text-center mb-5">
                <h1 class="fw-bold">Soccer Jersey Marketplace</h1>
                <p class="text-muted">Powered by your microservice 🚀</p>
            </div>

            <!-- Jerseys Grid -->
            <div class="row">
                ${jerseys.map(j => `
                    <div class="col-md-4">
                        <div class="card shadow-sm mb-4">
                            <div class="card-body text-center">
                                <h5 class="card-title">${j.name}</h5>
                                <p class="card-text text-success fw-bold">$${j.price}</p>
                                <button class="btn btn-primary">Buy Now</button>
                            </div>
                        </div>
                    </div>
                `).join("")}
            </div>

            <!-- API Section -->
            <div class="mt-5 text-center">
                <h5>API Endpoint</h5>
                <a href="/jerseys" class="btn btn-outline-secondary">View JSON Data</a>
            </div>

        </div>

    </body>
    </html>
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

//const port = process.env.PORT || 8080;

//app.listen(port, () => {
//    console.log("⚽ Jersey Store running on port " + port);
//});