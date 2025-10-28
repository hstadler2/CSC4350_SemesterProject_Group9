import React, { useState } from 'react'
import placeholder from '../assets/placeholder.png'
import { useNavigate, NavLink } from 'react-router-dom'

const Login = () => {

    const [loginData, setLoginData] = useState({email:'', password:''})
    
    const navigate = useNavigate()

    // listens for changes in values, so listens to user input and updates the state
    const handleChange = (e) => {
        setLoginData({...loginData, [e.target.name]: e.target.value})
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log("Login attempted:", loginData) //send data to backend
    }

  return (
    <div className='login-container'>
        <div className='login-box'>
            <img src={placeholder} alt="logo" className="logo"/>
            <h2>Welcome!</h2>
            <p>Login to your account</p>

            <form onSubmit={handleSubmit}>
                <label>Email</label>
                <input
                    type='email'
                    name='email'
                    placeholder='Enter your email'
                    value={loginData.email}
                    onChange={handleChange}
                    required
                />

                <label>Password</label>
                <input
                    type='password'
                    name='password'
                    placeholder='Enter your password'
                    value={loginData.password}
                    onChange={handleChange}
                    required
                />

                <button type='submit' className='login-btn'>Log-in</button>

                <p className='signup-link'>
                    Don't have an account?
                    <NavLink to='/signup'>Sign Up</NavLink>
                </p>

            </form>
        </div>
    </div>
  )
}

export default Login