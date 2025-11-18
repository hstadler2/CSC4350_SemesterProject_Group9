import { useState } from 'react'
import placeholder from '../assets/placeholder.png'
import { useNavigate, NavLink } from 'react-router-dom'
import { UserAuth } from '../context/AuthContext'

const Login = () => {

    const [loginData, setLoginData] = useState({email:'', password:''})
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()
    const{signInUser} = UserAuth() // get signInUser from context

    // listens for changes in values, so listens to user input and updates the state
    const handleChange = (e) => {
        setLoginData({...loginData, [e.target.name]: e.target.value})
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        console.log("Login attempted:", loginData)
        
        const result = await signInUser(loginData.email, loginData.password)
        
        setLoading(false)

        if(result.error){
            setError(result.error)

            // timeout to clear error message
            setTimeout(()=>{
                setError("")
            }, 3000) // 3 secs
        } else{
            // if signup successful take to home page where user will see patient or doctor role
            navigate("/")
        }

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

                <button type='submit' className='login-btn'>
                    {loading ? 'Loggin in...' : 'Log-in'}
                </button>

                {error && <p className='error-message'>{error}</p>}

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