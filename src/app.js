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

const jerseys = [
  {
    id: 1,
    name: "Real Madrid Home Kit",
    price: 90,
    img: "https://assets.adidas.com/images/w_600,f_auto,q_auto/real-madrid-24-home-jersey-white.jpg"
  },
  {
    id: 2,
    name: "Barcelona Away Kit",
    price: 85,
    img: "https://store.fcbarcelona.com/medias/barcelona-away-jersey-24.jpg"
  },
  {
    id: 3,
    name: "Manchester United Home Kit",
    price: 95,
    img: "https://assets.adidas.com/images/w_600,f_auto,q_auto/manchester-united-home-jersey-red.jpg"
  },

  // NEW OPTIONS 👇
  {
    id: 4,
    name: "Liverpool Home Kit",
    price: 90,
    img: "https://images.liverpoolfc.com/liverpool-home-kit-2024.jpg"
  },
  {
    id: 5,
    name: "Chelsea Home Kit",
    price: 88,
    img: "https://images.chelseafc.com/chelsea-home-kit-2024.jpg"
  },
  {
    id: 6,
    name: "Paris Saint-Germain Home Kit",
    price: 92,
    img: "https://store.psg.fr/images/psg-home-jersey-2024.jpg"
  },
  {
    id: 7,
    name: "Bayern Munich Home Kit",
    price: 93,
    img: "https://assets.adidas.com/images/w_600,f_auto,q_auto/bayern-munich-home-jersey-red.jpg"
  },
  {
    id: 8,
    name: "Juventus Home Kit",
    price: 89,
    img: "https://store.juventus.com/images/juventus-home-kit-2024.jpg"
  },
  {
    id: 9,
    name: "Arsenal Home Kit",
    price: 91,
    img: "https://assets.adidas.com/images/w_600,f_auto,q_auto/arsenal-home-jersey-red.jpg"
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

// Place order
app.post('/checkout', (req, res) => {
    const order = {
        id: Date.now(),
        items: cart,
        total: cart.reduce((sum, item) => sum + item.price, 0),
        customer: req.body
    };

    console.log("New Order:", order);

    cart = []; // 🧹 clear cart after checkout

    res.render('confirmation', { order });
});

// -------------------- SERVER --------------------

const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log("⚽ Jersey Store running on port " + port);
});