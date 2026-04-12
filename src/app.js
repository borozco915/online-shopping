const express = require('express');
const path = require('path');

const app = express();

// ✅ CORRECT ORDER
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());

// In-memory "database"
let cart = [];

let jerseys = [
    {
    id: 1,
    name: "Real Madrid Home Kit",
    price: 90,
    img: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb"
  },
    {
    id: 2,
    name: "Barcelona Away Kit",
    price: 85,
    img: "https://images.unsplash.com/photo-1599058917212-d750089bc07e"
  },
    { id: 3, name: "Manchester United Home Kit", price: 95 }
];

// -------------------- FRONTEND --------------------

app.get("/", (req, res) => {
    res.render("index", { jerseys, cart, query: req.query });
});

// -------------------- API --------------------

app.get('/jerseys', (req, res) => {
    res.json(jerseys);
});

app.get('/store', (req, res) => {
    let filtered = jerseys;

    if (req.query.search) {
        filtered = jerseys.filter(j =>
            j.name.toLowerCase().includes(req.query.search.toLowerCase())
        );
    }

    res.render('jerseys', { jerseys: filtered });
});

// -------------------- CART --------------------

app.post('/cart/:id', (req, res) => {
    const jersey = jerseys.find(j => j.id == req.params.id);
    if (!jersey) return res.status(404).send("Not found");

   const item = cart.find(i => i.id == jersey.id);

if (item) {
    item.qty = (item.qty || 1) + 1;
} else {
    const item = cart.find(i => i.id == jersey.id);

if (item) {
    item.qty = (item.qty || 1) + 1;
} else {
    cart.push({ ...jersey, qty: 1 });
}
}
    res.redirect('/?added=true');
});

app.get('/cart', (req, res) => {
    res.render('cart', { cart });
});

app.post('/cart/remove/:id', (req, res) => {
    cart = cart.filter(item => item.id != req.params.id);
    res.redirect('/cart');
});

// -------------------- SERVER --------------------

const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log("⚽ Jersey Store running on port " + port);
});