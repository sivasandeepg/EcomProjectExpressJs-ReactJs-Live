const passport = require('passport');
const { generateToken } = require('../../utils/jwtHelper'); 
const config = require('../../config/secretkeys'); 
 
// Google Login - Initiates the Google OAuth flow
exports.googleLogin = (req, res, next) => {
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
};


 
// Google Callback - After the user is authenticated via Google
exports.googleCallback = (req, res, next) => {
  passport.authenticate('google', { failureRedirect: '/login' }, (err, user, info) => {
    if (err) {
      console.error('Error during Google authentication:', err);
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=server_error`);
    }
    if (!user) {
      console.error('No user found during Google authentication');
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=user_not_found`);
    }

    // Log in the user using Passport's login method
    req.logIn(user, (err) => {
      if (err) {
        console.error('Error during user login:', err);
        return res.redirect(`${process.env.FRONTEND_URL}/login?error=login_error`);
      }

      // Generate JWT token
      const token = generateToken(user);
      req.session.user = user; // Store user in the session

      // Redirect user back to frontend with the token in URL parameters
      const redirectUrl = `${process.env.FRONTEND_URL}/auth/callback?token=${token}`; 
      return res.redirect(redirectUrl);
    });
  })(req, res, next);
};
  
    

// Get the current authenticated user
exports.currentUser = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized, please log in' });
  }
  // Return sanitized user data
  const { id, email } = req.user; 
  res.json({ user: { id, email } });
};
 
    

// Logout the user and clear the session
exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      console.error('Error during logout:', err);
      return next(err);
    }
    res.redirect('/');
  });
};
   