app.set('view engine', 'ejs');
const express = require('express');
const app = express();
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());

// In-memory "database"
let cart = [];
let jerseys = [
    { id: 1, name: "Real Madrid Home Kit", price: 90, img: "https://via.placeholder.com/200" },
    { id: 2, name: "Barcelona Away Kit", price: 85 },
    { id: 3, name: "Manchester United Home Kit", price: 95 }
];

// -------------------- FRONTEND --------------------

// Main page (homepage)
app.get("/", (req, res) => {
    res.render("index", { jerseys });
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
//Cart Route
app.post('/cart/:id', (req, res) => {
    const jersey = jerseys.find(j => j.id == req.params.id);
    if (!jersey) return res.status(404).send("Not found");

    cart.push(jersey);

    res.redirect('/');
});

//View Cart Page
app.get('/cart', (req, res) => {
    res.render('cart', { cart });
});

//Remove From Cart
app.post('/cart/remove/:id', (req, res) => {
    cart = cart.filter(item => item.id != req.params.id);
    res.redirect('/cart');
});

// -------------------- SERVER --------------------

const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log("⚽ Jersey Store running on port " + port);
});