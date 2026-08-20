import { pool } from '../helper/db.js'

const selectAllTasks = () => {
  return pool.query('SELECT id, description FROM task ORDER BY id')
}

const insertTask = (description) => {
  return pool.query(
    'INSERT INTO task (description) VALUES ($1) RETURNING id, description',
    [description],
  )
}

const deleteTaskById = (id) => {
  return pool.query('DELETE FROM task WHERE id = $1', [id])
}

export { selectAllTasks, insertTask, deleteTaskById }
