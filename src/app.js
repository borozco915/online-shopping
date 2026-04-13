const express = require('express');
const path = require('path');
const app = express();

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
    img: "/images/jerseys/madrid.png"
  },
  {
    id: 2,
    name: "Barcelona Away Kit",
    price: 85,
    img: "/images/jerseys/barcelona.png"
  },
  {
    id: 3,
    name: "Manchester United Home Kit",
    price: 95,
    img: "/images/jerseys/united.png"  },
  {
    id: 4,
    name: "Liverpool Home Kit",
    price: 90,
    img: "/images/jerseys/liverpool.png"
  },
  {
    id: 5,
    name: "Chelsea Home Kit",
    price: 88,
    img: "/images/jerseys/chelsea.png"
  },

  {
  id: 6,
  name: "Paris Saint-Germain Home Kit",
  price: 92,
  img: "/images/jerseys/psg.png"},
{
  id: 7,
  name: "Bayern Munich Home Kit",
  price: 93,
  img: "/images/jerseys/bayern.png"
},
{
  id: 8,
  name: "Juventus Home Kit",
  price: 89,
  img: "/images/jerseys/juventus.png"
},
{
  id: 9,
  name: "Arsenal Home Kit",
  price: 91,
  img: "/images/jerseys/arsenal.png"}
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

    const item = cart.find(i => i.id == jersey.id);

    if (item) {
        item.qty = (item.qty || 1) + 1;
    } else {
        cart.push({ ...jersey, qty: 1 });
    }

    res.redirect('/');
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
        items: [...cart],
        total: cart.reduce((sum, item) => sum + item.price, 0),
        customer: req.body,
        date: new Date()
    };

    orders.push(order);
    cart = [];

    console.log("New Order:", order);

    res.render('confirmation', { order });
});


// -------------------- SERVER --------------------

const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`⚽ Jersey Store running on port ${port}`);
});
