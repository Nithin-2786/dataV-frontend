import React, { useState } from 'react'
import '../styles.css'
import './login.css'
import Navbar from './Navbar'
import CustomGlobe from './globe'
import { useNavigate } from 'react-router-dom'

function LoginSignup({ onLogin }) {
  const isLoggedInStorage = sessionStorage.getItem('isLoggedIn') === 'true'
  const [isLoggedIn, setIsLoggedIn] = useState(isLoggedInStorage)
  const [isSignUp, setIsSignUp] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [popupMessage, setPopupMessage] = useState('')
  const navigate = useNavigate()

  const toggleForm = () => {
    setIsSignUp(!isSignUp)
  }

  const showPopupMessage = (message) => {
    setPopupMessage(message)
    setTimeout(() => {
      setPopupMessage('')
    }, 5000)
  }

  const handleLoginSuccess = (token, username) => {
    setIsLoggedIn(true)
    sessionStorage.setItem('isLoggedIn', 'true')
    sessionStorage.setItem('accessToken', token)
    sessionStorage.setItem('username', username)
    showPopupMessage('Login successful')
  }

  const handleSubmit1 = (event) => {
    event.preventDefault()
    const userData = {
      username,
      password,
    }
    fetch('https://datav-backend-1.onrender.com/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
      .then((response) => {
        if (response.ok) {
          return response.json()
        } else {
          throw new Error('Login failed. Incorrect username or password.')
        }
      })
      .then((data) => {
        if (data.accesstoken) {
          handleLoginSuccess(data.accesstoken, username)
        } else {
          throw new Error('Login failed. Incorrect username or password.')
        }
      })
      .catch((error) => {
        console.error('Error:', error.message)
        showPopupMessage(error.message)
      })
  }

  const handleRegistrationSuccess = () => {
    showPopupMessage('Registration successful')
    setTimeout(() => {
      window.location.reload()
    }, 3000)
  }

  const handleRegistrationFailure = () => {
    showPopupMessage('Registration failed')
  }

  const Redirect = (event) => {
    event.preventDefault()
    const userData = {
      username,
      email,
      password,
    }

    fetch('https://datav-backend-1.onrender.com/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
      .then((response) => {
        if (response.ok) {
          handleRegistrationSuccess()
        } else {
          handleRegistrationFailure()
        }
      })
      .catch((error) => {
        console.log('Error:', error)
        handleRegistrationFailure()
      })
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    sessionStorage.removeItem('isLoggedIn')
    sessionStorage.removeItem('accessToken')
  }

  return (
    <div>
      <Navbar />
      <div className="headline-container">
        <h1 className="headline-text">HYAIR </h1>
      </div>
      {popupMessage && <div style={styles.popup}>{popupMessage}</div>}
      <div className="login-signup-container">
        <div className="globe-container">
          <CustomGlobe />
        </div>
        {!isLoggedIn ? (
          <div className="form-container">
            <div className="form-header">{/* Header content */}</div>
            <div className="form">
              {isSignUp && (
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              )}
              <div className="form-group">
                <label htmlFor="username">Username</label> <br />
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {!isSignUp && (
                <div className="form-group">
                  <button
                    type="submit"
                    className="submit-btn"
                    onClick={handleSubmit1}
                  >
                    Sign In
                  </button>
                </div>
              )}
              <div className="form-footer">
                {!isSignUp ? (
                  <p>
                    Don't have an account?{' '}
                    <button
                      type="button"
                      className="toggle-btn"
                      onClick={toggleForm}
                    >
                      Create an Account
                    </button>
                  </p>
                ) : (
                  <div>
                    <button
                      type="submit"
                      className="submit-btn"
                      onClick={Redirect}
                    >
                      Sign Up
                    </button>
                    <p>
                      Already have an account?{' '}
                      <button
                        type="button"
                        className="toggle-btn"
                        onClick={toggleForm}
                      >
                        Log In
                      </button>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="welcome-container">
            <p>Hello {username}!</p>
            <button onClick={() => navigate('/')}>Go to Home</button>
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  popup: {
    position: 'fixed',
    top: '10px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: 'rgba(0, 10, 39, 0.685)',
    color: '#ffffff',
    padding: '10px 20px',
    borderRadius: '5px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    zIndex: 1000,
    transition: 'opacity 0.3s ease',
    fontWeight: 'bold',
    textAlign: 'center',
  }
}

export default LoginSignup
