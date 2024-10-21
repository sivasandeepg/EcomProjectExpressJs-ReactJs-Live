const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cookieParser = require('cookie-parser');
require('dotenv').config();

//Import routes
//customer
const AuthRoutes = require('./routes/auth/AuthRoutes');
const isAuthenticatedRoutes = require('./routes/auth/isAuthenticatedRoutes');
const productRoutes = require('./routes/customer/productRoutes');
const CartRoutes = require('./routes/customer/CartRoutes'); 
const paymentRoutes = require('./routes/customer/paymentRoutes');
const addressRoutes = require('./routes/customer/addressRoutes'); 
const orderRoutes = require('./routes/customer/orderRoutes'); 
//vendor
const VendorAuthRoutes = require('./routes/auth/VendorAuthRoutes'); 
const VendorProductsRoutes = require('./routes/vendor/VendorProductsRoutes');
const VendorProductCategoriesRoutes = require('./routes/vendor/VendorProductCategoriesRoutes');
const VendorOrdersRoutes = require('./routes/vendor/VendorOrdersRoutes');
//Import dotenv 
const {PORT, MONGO_URI, SESSION_SECRET,  } = require('./config/secretkeys');
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
  origin: ['http://localhost:3000', 'http://192.168.8.100:3000']
}));    
// Other middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add cookie-parser middleware
app.use(cookieParser());  
 
    
// Session middleware setup
app.use(session({
  name: 'ecommerce.sid', // custome  
  secret: SESSION_SECRET, // Use a strong secret
  resave: false, // Prevents session from being saved back to the store if unmodified
  saveUninitialized: false, // Don't create a session until something is stored
  store: MongoStore.create({
    mongoUrl: MONGO_URI,
    collectionName: 'sessions',
    ttl: 14 * 24 * 60 * 60, // 14 days
    autoRemove: 'native'
  }),
  cookie: {
    maxAge: 86400000, // 1 day
    secure: false, // Set true if using HTTPS
    httpOnly: true,
    sameSite: 'lax', 

  }
}));  
  
//session id test 
app.get('/', (req, res) => {
  req.session.viewCount = (req.session.viewCount || 0) + 1; // Increment view count
  const sessionId = req.session.id; // Get the session ID 
  res.send(`You visited this page ${req.session.viewCount} times. Session ID: ${sessionId}`);
});

  

// Initialize Passport and use Passport sessions
app.use(passport.initialize());
app.use(passport.session());

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
 
// Use the router for admin products and authentication
// vendor
app.use('/api/vendor/auth/', VendorAuthRoutes);
app.use('/api/admin/products', VendorProductsRoutes);
app.use('/api/admin/ProductCategories', VendorProductCategoriesRoutes);
app.use('/api/vendor/vendorOrders', VendorOrdersRoutes);  
//customer 
app.use('/auth/google', AuthRoutes);
app.use('/auth', isAuthenticatedRoutes);
app.use('/api/addresses', addressRoutes); 
app.use('/api/products', productRoutes);
app.use('/api/cart', CartRoutes); 
app.use('/api/payment', paymentRoutes);
app.use('/api/orders', orderRoutes); 


  
// Start server 
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
  