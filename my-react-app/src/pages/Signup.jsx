import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

// TODO: DETERMINE ROLE; only allow patients to sign up
// * figure out how to create doctor account. Should it be made manually or made here?

const Signup = () => {

    const [signupData, setSignupData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword:''
    })

    const navigate = useNavigate()

    const handleChange = (e) => {
        setSignupData({...signupData, [e.target.name]: e.target.value})
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        // make sure passwords match
        if (signupData.password !== signupData.confirmPassword){
            alert("passwords do not match!")
            return
        }

        const newUser = {
            ...signupData,
            role:'patient' //default role for those that signup
        }

        console.log("Signup data:", newUser)

        // switch to login page when account is created
        alert("Account was created successfully")
        navigate('/login')

        // TODO: connect to backend
    }

    return (
    <div className='signUp-container'>
            <div className='signup-box'>
                <h2>Create Account</h2>
    
                <form onSubmit={handleSubmit}>
                    <label>First Name</label>
                    <input
                        type='text'
                        name='firstname'
                        placeholder='First name'
                        value={signupData.firstName}
                        onChange={handleChange}
                    />

                    <label>Last Name</label>
                    <input
                        type='text'
                        name='lastname'
                        placeholder='Last name'
                        value={signupData.lastName}
                        onChange={handleChange}
                    />

                    <label>Email</label>
                    <input
                        type='email'
                        name='email'
                        placeholder='Enter your email'
                        value={signupData.email}
                        onChange={handleChange}
                        required
                    />
    
                    <label>Password</label>
                    <input
                        type='password'
                        name='password'
                        placeholder='Enter your password'
                        value={signupData.password}
                        onChange={handleChange}
                        required
                    />

                    <label>Confirm Password</label>
                    <input
                        type='password'
                        name='confirmPassword'
                        placeholder='Retype password'
                        value={signupData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
    
                    <button type='submit' className='login-btn'>Sign-up</button> 
                
                <p className='login-link'>
                    Already have an account?
                    <NavLink to={'/login'}>Login</NavLink>
                </p>
                </form>
            </div>
        </div>
  )
}

export default Signup