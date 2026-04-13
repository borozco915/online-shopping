const express = require('express');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory "database"
let cart = [];
let wishlist = [];
let savedForLater = [];
let orders = [];

function findJersey(id) {
    return jerseys.find(jersey => jersey.id === Number(id));
}

function addUniqueItem(collection, jersey) {
    const exists = collection.some(item => item.id === jersey.id);

    if (!exists) {
        collection.push(jersey);
    }
}

const jerseys = [
  {
    id: 1,
    name: "Real Madrid Home Kit",
    price: 90,
    img: "/images/jerseys/madrid.png",
    sizes: ["S", "M", "L", "XL"],
    description: "Classic white home jersey with breathable match-day fabric.",
    badge: "Best Seller",
    fit: "Regular fit with lightweight stretch through the shoulders.",
    material: "100% recycled polyester with moisture-wicking finish.",
    shipping: "Ships in 1-2 business days with free delivery over $120.",
    sizeGuide: [
      { size: "S", chest: "34-36 in", length: "27 in" },
      { size: "M", chest: "38-40 in", length: "28 in" },
      { size: "L", chest: "42-44 in", length: "29 in" },
      { size: "XL", chest: "46-48 in", length: "30 in" }
    ],
    reviews: [
      { author: "Marco", rating: 5, comment: "The fabric feels premium and the crest details really stand out." },
      { author: "Daniel", rating: 4, comment: "Comfortable for match days and fits true to size." }
    ]
  },
  {
    id: 2,
    name: "Barcelona Away Kit",
    price: 85,
    img: "/images/jerseys/barcelona.png",
    sizes: ["S", "M", "L", "XL"],
    description: "Bold away colors with a lightweight athletic fit.",
    badge: "New Arrival",
    fit: "Athletic cut designed to sit close without feeling tight.",
    material: "Performance mesh blend for all-day comfort.",
    shipping: "Ships next business day with tracked standard delivery.",
    sizeGuide: [
      { size: "S", chest: "35-37 in", length: "27 in" },
      { size: "M", chest: "38-40 in", length: "28 in" },
      { size: "L", chest: "41-43 in", length: "29 in" },
      { size: "XL", chest: "44-46 in", length: "30 in" }
    ],
    reviews: [
      { author: "Luis", rating: 5, comment: "The away colorway looks even better in person." },
      { author: "Nina", rating: 4, comment: "Lightweight and breathable, perfect for summer wear." }
    ]
  },
  {
    id: 3,
    name: "Manchester United Home Kit",
    price: 95,
    img: "/images/jerseys/united.png",
    sizes: ["M", "L", "XL", "XXL"],
    description: "Signature red home shirt built for stadium energy.",
    badge: "Fan Favorite",
    fit: "Relaxed supporter fit with extra room in the body.",
    material: "Soft-touch knit with ventilated side panels.",
    shipping: "Ships in 1-2 business days and includes easy returns.",
    sizeGuide: [
      { size: "M", chest: "39-41 in", length: "28 in" },
      { size: "L", chest: "42-44 in", length: "29 in" },
      { size: "XL", chest: "45-47 in", length: "30 in" },
      { size: "XXL", chest: "48-50 in", length: "31 in" }
    ],
    reviews: [
      { author: "Chris", rating: 5, comment: "Looks sharp and the fit is spot on for layering." },
      { author: "Avery", rating: 4, comment: "Great quality, just a slightly roomier cut than I expected." }
    ]
  },
  {
    id: 4,
    name: "Liverpool Home Kit",
    price: 90,
    img: "/images/jerseys/liverpool.png",
    sizes: ["S", "M", "L", "XL"],
    description: "Streamlined home strip with soft-touch performance fabric.",
    badge: "Match Day Pick",
    fit: "Modern straight fit with a clean drape through the torso.",
    material: "Featherweight performance weave with soft interior feel.",
    shipping: "Ships in 2 business days; expedited delivery available.",
    sizeGuide: [
      { size: "S", chest: "35-37 in", length: "27 in" },
      { size: "M", chest: "38-40 in", length: "28 in" },
      { size: "L", chest: "41-43 in", length: "29 in" },
      { size: "XL", chest: "44-46 in", length: "30 in" }
    ],
    reviews: [
      { author: "Ethan", rating: 5, comment: "The stitching and color are excellent." },
      { author: "Maya", rating: 4, comment: "Comfortable enough to wear all day, not just to games." }
    ]
  },
  {
    id: 5,
    name: "Chelsea Home Kit",
    price: 88,
    img: "/images/jerseys/chelsea.png",
    sizes: ["S", "M", "L", "XL"],
    description: "Modern royal blue jersey with a relaxed supporter fit.",
    badge: "Club Classic",
    fit: "Supporter fit with soft structure and easy movement.",
    material: "Quick-dry fabric with breathable shoulder panels.",
    shipping: "Ships in 1-3 business days with live order tracking.",
    sizeGuide: [
      { size: "S", chest: "34-36 in", length: "27 in" },
      { size: "M", chest: "37-39 in", length: "28 in" },
      { size: "L", chest: "40-42 in", length: "29 in" },
      { size: "XL", chest: "43-45 in", length: "30 in" }
    ],
    reviews: [
      { author: "James", rating: 4, comment: "Solid fit and the blue has a great finish." },
      { author: "Tori", rating: 5, comment: "One of my favorite kits this season." }
    ]
  },

  {
    id: 6,
    name: "Paris Saint-Germain Home Kit",
    price: 92,
    img: "/images/jerseys/psg.png",
    sizes: ["M", "L", "XL"],
    description: "Paris-inspired home jersey with a sleek modern silhouette.",
    badge: "Premium Pick",
    fit: "Tailored fit with a clean silhouette and flexible sleeves.",
    material: "Smooth knit shell with breathable side mesh.",
    shipping: "Ships next business day with priority delivery available.",
    sizeGuide: [
      { size: "M", chest: "38-40 in", length: "28 in" },
      { size: "L", chest: "41-43 in", length: "29 in" },
      { size: "XL", chest: "44-46 in", length: "30 in" }
    ],
    reviews: [
      { author: "Noah", rating: 5, comment: "The silhouette is clean and the fabric feels premium." },
      { author: "Jules", rating: 4, comment: "Looks stylish enough to wear casually." }
    ]
  },
  {
    id: 7,
    name: "Bayern Munich Home Kit",
    price: 93,
    img: "/images/jerseys/bayern.png",
    sizes: ["S", "M", "L", "XL"],
    description: "Structured fit and high-contrast trim for a premium look.",
    badge: "Top Rated",
    fit: "Structured athletic fit with balanced stretch.",
    material: "High-performance polyester knit with matte finish.",
    shipping: "Ships in 1-2 business days and qualifies for free returns.",
    sizeGuide: [
      { size: "S", chest: "35-37 in", length: "27 in" },
      { size: "M", chest: "38-40 in", length: "28 in" },
      { size: "L", chest: "41-43 in", length: "29 in" },
      { size: "XL", chest: "44-46 in", length: "30 in" }
    ],
    reviews: [
      { author: "Felix", rating: 5, comment: "Great details and an excellent fit through the chest." },
      { author: "Sam", rating: 4, comment: "Very comfortable, especially for training sessions." }
    ]
  },
  {
    id: 8,
    name: "Juventus Home Kit",
    price: 89,
    img: "/images/jerseys/juventus.png",
    sizes: ["S", "M", "L"],
    description: "Minimal striped design with breathable all-day comfort.",
    badge: "Minimalist Choice",
    fit: "Classic straight fit that sits easily over a tee.",
    material: "Soft breathable fabric with moisture control.",
    shipping: "Ships within 48 hours with secure standard delivery.",
    sizeGuide: [
      { size: "S", chest: "34-36 in", length: "27 in" },
      { size: "M", chest: "37-39 in", length: "28 in" },
      { size: "L", chest: "40-42 in", length: "29 in" }
    ],
    reviews: [
      { author: "Gianni", rating: 5, comment: "Simple, sharp, and really easy to style." },
      { author: "Reese", rating: 4, comment: "Breathable fabric and clean design." }
    ]
  },
  {
    id: 9,
    name: "Arsenal Home Kit",
    price: 91,
    img: "/images/jerseys/arsenal.png",
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: "North London-inspired home shirt with a slightly tapered fit.",
    badge: "Supporter Essential",
    fit: "Slightly tapered through the waist with comfortable shoulder room.",
    material: "Flexible knit body with breathable side vents.",
    shipping: "Ships in 1-2 business days and includes tracked updates.",
    sizeGuide: [
      { size: "S", chest: "35-37 in", length: "27 in" },
      { size: "M", chest: "38-40 in", length: "28 in" },
      { size: "L", chest: "41-43 in", length: "29 in" },
      { size: "XL", chest: "44-46 in", length: "30 in" },
      { size: "XXL", chest: "47-49 in", length: "31 in" }
    ],
    reviews: [
      { author: "Harper", rating: 5, comment: "Excellent fit and the badge work looks great." },
      { author: "Ben", rating: 4, comment: "Good all-around jersey with a flattering cut." }
    ]
  }
];

app.use((req, res, next) => {
    res.locals.cart = cart;
    res.locals.wishlist = wishlist;
    res.locals.savedForLater = savedForLater;
    res.locals.searchTerm = req.query.search || '';
    next();
});

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
    const search = (req.query.search || '').trim();

    if (search) {
        filtered = jerseys.filter(j =>
            j.name.toLowerCase().includes(search.toLowerCase())
        );
    }

    res.render('jerseys', { jerseys: filtered, search });
});

app.get('/product/:id', (req, res) => {
    const jersey = findJersey(req.params.id);

    if (!jersey) {
        return res.status(404).send('Product not found');
    }

    const relatedJerseys = jerseys
        .filter(item => item.id !== jersey.id)
        .slice(0, 3);

    const averageRating = jersey.reviews.reduce((sum, review) => sum + review.rating, 0) / jersey.reviews.length;

    res.render('product-detail', {
        jersey,
        relatedJerseys,
        averageRating
    });
});

app.get('/wishlist', (req, res) => {
    res.render('wishlist', { jerseys: wishlist, title: 'Wishlist', emptyMessage: 'Your wishlist is empty.' });
});

app.get('/saved', (req, res) => {
    res.render('wishlist', {
        jerseys: savedForLater,
        title: 'Saved For Later',
        emptyMessage: 'You have not saved any jerseys for later yet.'
    });
});

app.post('/wishlist/:id', (req, res) => {
    const jersey = findJersey(req.params.id);

    if (jersey) {
        addUniqueItem(wishlist, jersey);
    }

    res.redirect(req.get('referer') || '/store');
});

app.post('/saved/:id', (req, res) => {
    const jersey = findJersey(req.params.id);

    if (jersey) {
        addUniqueItem(savedForLater, jersey);
    }

    res.redirect(req.get('referer') || '/store');
});

app.post('/wishlist/remove/:id', (req, res) => {
    wishlist = wishlist.filter(item => item.id !== Number(req.params.id));
    res.redirect('/wishlist');
});

app.post('/saved/remove/:id', (req, res) => {
    savedForLater = savedForLater.filter(item => item.id !== Number(req.params.id));
    res.redirect('/saved');
});

// -------------------- CART --------------------

app.post('/cart/:id', (req, res) => {
    const jersey = findJersey(req.params.id);
    const selectedSize = req.body.size || jersey.sizes[0];

    const item = cart.find(i => i.id == jersey.id && i.size === selectedSize);

    if (item) {
        item.qty = (item.qty || 1) + 1;
    } else {
        cart.push({ ...jersey, size: selectedSize, qty: 1 });
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
        total: cart.reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0),
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
