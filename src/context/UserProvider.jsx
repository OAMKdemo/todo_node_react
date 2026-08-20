import { useState } from 'react'
import axios from 'axios'
import { UserContext } from './UserContext'

const apiUrl = import.meta.env.VITE_API_URL

export default function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = sessionStorage.getItem('user')
    return storedUser ? JSON.parse(storedUser) : null
  })

  const signUp = async (credentials) => {
    await axios.post(`${apiUrl}/users/signup`, { user: credentials })
  }

  const signIn = async (credentials) => {
    const response = await axios.post(`${apiUrl}/users/signin`, { user: credentials })
    setUser(response.data)
    sessionStorage.setItem('user', JSON.stringify(response.data))
  }

  return (
    <UserContext.Provider value={{ user, signUp, signIn }}>
      {children}
    </UserContext.Provider>
  )
}
