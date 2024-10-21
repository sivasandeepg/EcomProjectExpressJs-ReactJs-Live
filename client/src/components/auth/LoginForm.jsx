import React, { useState } from 'react';
import axios from 'axios';
import app from '../../config/firebaseConfig'; 
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import  '../../styles/Login.css'; 

const auth = getAuth(app);

const LoginForm = () => {
   const apiUrl = process.env.REACT_APP_API_URL;
   var googleApiUrl = process.env.REACT_APP_GOOGLE_API_URL;
     console.log(googleApiUrl); 
   const [phone, setPhone] = useState('');
   const [otp, setOtp] = useState(''); 
   const [confirmationResult, setConfirmationResult] = useState(null);
   const [error, setError] = useState('');    
   const navigate = useNavigate(); 

   const sendOtp = async () => {
      try {
         const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
            'size': 'invisible',
            'callback': (response) => {},
         }, auth);

         const result = await signInWithPhoneNumber(auth, '+91' + phone, recaptchaVerifier);
         setConfirmationResult(result);

      } catch (error) {
         setError('Recaptcha Error: ' + error.message);
      }  
   }; 
    
   const verifyOtp = async () => {  
      try {
         const result = await confirmationResult.confirm(otp);
         console.log(result);

         const formData = {
            userId: result.user.uid,
            phone: result.user.phoneNumber,
            provider: result.user.providerId, 
            accessToken: result.user.accessToken,
         };

         const saveUser = await axios.post(`${apiUrl}/auth/firebase/save`, formData);
         console.log(saveUser);

         if (saveUser) {
            navigate('/profile');
         }

      } catch (error) {
         console.error(error);
      }
   };

   const handleGoogleLogin = async () => {
      // window.location.href = `${googleApiUrl}/auth/google/login`;
      window.location.href = `https://ecomproject-expressjs-live.onrender.com/auth/login`;   
   };
    
   return (
      <div className="loginContainer">
         <div className="loginBox">
            <p>{error}</p> 
            <h2>Login</h2>
            <div className="formGroup">
               <label>Phone Number:</label>
               <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter Mobile Number"
               />
            </div>
            <div id="recaptcha-container"></div> 
            <button onClick={sendOtp} className="loginButton">Send OTP</button>

            {confirmationResult && (
               <div className="formGroup">
                  <label>OTP:</label>
                  <input 
                     type="text"  
                     value={otp} 
                     onChange={(e) => setOtp(e.target.value)} 
                  />
                  <button onClick={verifyOtp} className="loginButton">Verify OTP</button> 
               </div>
            )}
            
            <button onClick={handleGoogleLogin} className="googleButton">Login with Google</button>
         </div>
      </div>
   );
};

export default LoginForm;
  