import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'
import Row from './components/Row'
import { useUser } from './context/useUser'

const apiUrl = import.meta.env.VITE_API_URL

function App() {
  const [task, setTask] = useState('')
  const [tasks, setTasks] = useState([])
  const { user } = useUser()

  useEffect(() => {
    axios.get(`${apiUrl}/tasks`)
      .then((response) => setTasks(response.data))
      .catch((error) => {
        alert(error.response?.data?.error?.message ?? error.message)
      })
  }, [])

  const addTask = async (event) => {
    event.preventDefault()
    const description = task.trim()

    if (!description) return

    try {
      const response = await axios.post(
        `${apiUrl}/tasks`,
        { task: { description } },
        { headers: { Authorization: `Bearer ${user.token}` } },
      )
      setTasks((currentTasks) => [...currentTasks, response.data])
      setTask('')
    } catch (error) {
      alert(error.response?.data?.error?.message ?? error.message)
    }
  }

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${apiUrl}/tasks/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      setTasks((currentTasks) => currentTasks.filter((item) => item.id !== id))
    } catch (error) {
      alert(error.response?.data?.error?.message ?? error.message)
    }
  }

  return (
    <main id="container">
      <h1>Todos</h1>
      <form onSubmit={addTask}>
        <label htmlFor="task">New task</label>
        <input
          id="task"
          placeholder="Add new task"
          value={task}
          onChange={(event) => setTask(event.target.value)}
        />
        <button type="submit">Add</button>
      </form>
      <ul>
        {tasks.map((item) => (
          <Row task={item} key={item.id} onDelete={deleteTask} />
        ))}
      </ul>
    </main>
  )
}

export default App
