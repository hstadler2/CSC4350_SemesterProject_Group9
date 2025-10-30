import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { UserAuth } from '../context/AuthContext'

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
    
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    const {signUpNewUser} = UserAuth()

    const handleChange = (e) => {
        setSignupData({...signupData, [e.target.name]: e.target.value})
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        // make sure passwords match
        if (signupData.password !== signupData.confirmPassword){
            setError("passwords do not match!")
            setLoading(false)
            return
        }

        // call signUpNewUser func
        const result = await signUpNewUser(
            signupData.email,
            signupData.password,
            {
                firstName: signupData.firstName,
                lastName: signupData.lastName,
                role:'patient'
            }
        )
        setLoading(false)

        if (result.success) {
            // switch to login page when account is created
            alert("Account was created successfully")
            navigate('/login')
        } else{
            setError(result.error.message || "Failed to create account")
        }
    }

    return (
    <div className='signUp-container'>
            <div className='signup-box'>
                <h2>Create Account</h2>
    
                <form onSubmit={handleSubmit}>
                    <label>First Name</label>
                    <input
                        type='text'
                        name='firstName'
                        placeholder='First name'
                        value={signupData.firstName}
                        onChange={handleChange}
                    />

                    <label>Last Name</label>
                    <input
                        type='text'
                        name='lastName'
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
    
                    <button type='submit' disabled={loading} className='login-btn'>
                        {loading ? 'Signing up...' : 'Sign-Up'}
                        </button> 
                    {error && <p className='error-message'>{error}</p>}

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