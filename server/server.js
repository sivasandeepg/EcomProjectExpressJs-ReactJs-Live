const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cookieParser = require('cookie-parser');
require('dotenv').config();

// Import routes
const AuthRoutes = require('./routes/auth/AuthRoutes');
const isAuthenticatedRoutes = require('./routes/auth/isAuthenticatedRoutes');
const productRoutes = require('./routes/customer/productRoutes');
const CartRoutes = require('./routes/customer/CartRoutes');
const paymentRoutes = require('./routes/customer/paymentRoutes');
const addressRoutes = require('./routes/customer/addressRoutes');
const orderRoutes = require('./routes/customer/orderRoutes');
const VendorAuthRoutes = require('./routes/auth/VendorAuthRoutes');
const VendorProductsRoutes = require('./routes/vendor/VendorProductsRoutes');
const VendorProductCategoriesRoutes = require('./routes/vendor/VendorProductCategoriesRoutes');
const VendorOrdersRoutes = require('./routes/vendor/VendorOrdersRoutes');
const { PORT, MONGO_URI, SESSION_SECRET, FRONTEND_URL, LOCAL_FRONTEND_URL } = require('./config/secretkeys');
require('./config/passport');

// MongoDB Connection
mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
  credentials: true,
  origin: [ FRONTEND_URL,LOCAL_FRONTEND_URL,] // Update this with your client URL on Render
}));
 
// Other middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add cookie-parser middleware
app.use(cookieParser());

// Session middleware setup
app.use(session({
  name: 'ecommerce.sid',
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: MONGO_URI,
    collectionName: 'sessions',
    ttl: 14 * 24 * 60 * 60, // 14 days
    autoRemove: 'native'
  }),
  cookie: {
    maxAge: 86400000, // 1 day
    secure: process.env.NODE_ENV === 'production', // Set true if using HTTPS
    httpOnly: true,
    sameSite: 'lax',
  }
}));

// Session ID test
app.get('/', (req, res) => {
  req.session.viewCount = (req.session.viewCount || 0) + 1;
  const sessionId = req.session.id;
  res.send(`You visited this page ${req.session.viewCount} times. Session ID: ${sessionId}`);
});

// Initialize Passport and use Passport sessions
app.use(passport.initialize());
app.use(passport.session());

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Use the router for admin products and authentication
app.use('/api/vendor/auth/', VendorAuthRoutes);
app.use('/api/admin/products', VendorProductsRoutes);
app.use('/api/admin/ProductCategories', VendorProductCategoriesRoutes);
app.use('/api/vendor/vendorOrders', VendorOrdersRoutes);
app.use('/auth', AuthRoutes);        
app.use('/auth/verify', isAuthenticatedRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', CartRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/orders', orderRoutes);

// // Serve the static files from the React app
// app.use(express.static(path.join(__dirname, 'client/build')));

// // The "catchall" handler: for any request that doesn't
// // match one above, send back React's index.html file.
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
// });  

// Start server 
const port = process.env.PORT || PORT; // Use Render's port or fallback to local
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
