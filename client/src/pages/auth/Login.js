import React from 'react'
import LoginForm from '../../components/auth/LoginForm'
 
const Login = (user) => { 

    if (user.role === 'admin') {
        // history.push('/admin/dashboard');
      } else {
        // history.push('/home'); 
      } 
    
  return (
    <div>
    <LoginForm/> 
    </div>
  )
}

export default Login