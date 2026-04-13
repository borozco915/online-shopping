const express = require('express');
const path = require('path');
app.use(express.static('public'));
const app = express();

// ✅ CORRECT ORDER
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());

// In-memory "database"
let cart = [];

const jerseys = [
  
    {
    id: 1,
    name: "Real Madrid Home Kit",
    price: 90,
    img: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=600&q=60"
  },
  {
    id: 2,
    name: "Barcelona Away Kit",
    price: 85,
    img: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=600&q=60"
  },
  {
    id: 3,
    name: "Manchester United Home Kit",
    price: 95,
    img: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=60"
  },
  {
    id: 4,
    name: "Liverpool Home Kit",
    price: 90,
    img: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=600&q=60"
  },
  {
    id: 5,
    name: "Chelsea Home Kit",
    price: 88,
    img: "https://images.unsplash.com/photo-1511886929837-354d827aae26?auto=format&fit=crop&w=600&q=60"
  },

  {
  id: 6,
  name: "Paris Saint-Germain Home Kit",
  price: 92,
  img: "https://images.unsplash.com/photo-1600180758890-6b94519a8ba6?auto=format&fit=crop&w=600&q=60"
},
{
  id: 7,
  name: "Bayern Munich Home Kit",
  price: 93,
  img: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=600&q=60"
},
{
  id: 8,
  name: "Juventus Home Kit",
  price: 89,
  img: "https://images.unsplash.com/photo-1599058917765-a780eda07a3e?auto=format&fit=crop&w=600&q=60"
},
{
  id: 9,
  name: "Arsenal Home Kit",
  price: 91,
  img: "https://images.unsplash.com/photo-1511886929837-354d827aae26?auto=format&fit=crop&w=600&q=60"
}
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

let orders = [];

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

// Checkout page
app.get('/checkout', (req, res) => {
    res.render('checkout', { cart });
});

//Order Page 
app.get('/orders', (req, res) => {
    res.render('orders', { orders });
});

//Admin Portal
app.get('/admin', (req, res) => {

    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

    res.render('admin', {
        orders,
        totalRevenue,
        totalOrders: orders.length,
        totalProducts: jerseys.length
    });
});

app.get('/admin/orders/:id', (req, res) => {
    const order = orders.find(o => o.id == req.params.id);
    res.render('order-details', { order });
});

app.post('/admin/orders/delete/:id', (req, res) => {
    orders = orders.filter(o => o.id != req.params.id);
    res.redirect('/admin');
});

// Place order
app.post('/checkout', (req, res) => {
    const order = {
    id: Date.now(),
    items: [...cart], // 👈 clone cart
    total: cart.reduce((sum, item) => sum + item.price, 0),
    customer: req.body,
    date: new Date()
};

orders.push(order); // 👈 SAVE ORDER

cart = [];

res.render('confirmation', { order });

    console.log("New Order:", order);

    cart = []; // 🧹 clear cart after checkout

    res.render('confirmation', { order });
});



// -------------------- SERVER --------------------

const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log("⚽ Jersey Store running on port " + port);
});