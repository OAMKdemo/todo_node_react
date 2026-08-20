import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import todoRouter from './routes/todoRouter.js'
import userRouter from './routes/userRouter.js'

const port = process.env.PORT || 3001

const app = express()
app.use(cors())
app.use(express.json())

app.use('/tasks', todoRouter)
app.use('/users', userRouter)

app.use((err, req, res, next) => {
  const status = err.status || 500

  if (status === 500) {
    console.error(err)
  }

  res.status(status).json({
    error: {
      message: status === 500 ? 'Internal server error' : err.message,
      status,
    },
  })
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
