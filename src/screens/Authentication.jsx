import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUser } from '../context/useUser'

export const AuthenticationMode = Object.freeze({
  SignIn: 'signin',
  SignUp: 'signup',
})

export default function Authentication({ authenticationMode }) {
  const [credentials, setCredentials] = useState({ email: '', password: '' })
  const { signUp, signIn } = useUser()
  const navigate = useNavigate()
  const isSignIn = authenticationMode === AuthenticationMode.SignIn

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      if (isSignIn) {
        await signIn(credentials)
        navigate('/')
      } else {
        await signUp(credentials)
        navigate('/signin')
      }
    } catch (error) {
      alert(error.response?.data?.error?.message ?? error.message)
    }
  }

  const updateCredential = (event) => {
    setCredentials({ ...credentials, [event.target.name]: event.target.value })
  }

  return (
    <main>
      <h1>{isSignIn ? 'Sign in' : 'Sign up'}</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={credentials.email}
          onChange={updateCredential}
          required
        />
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete={isSignIn ? 'current-password' : 'new-password'}
          value={credentials.password}
          onChange={updateCredential}
          required
        />
        <button type="submit">{isSignIn ? 'Sign in' : 'Sign up'}</button>
        <Link to={isSignIn ? '/signup' : '/signin'}>
          {isSignIn ? 'No account? Sign up' : 'Already have an account? Sign in'}
        </Link>
      </form>
    </main>
  )
}
