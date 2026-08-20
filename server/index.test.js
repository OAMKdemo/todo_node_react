import { expect } from 'chai'
import { getToken, initializeTestDb, insertTestUser } from './helper/test.js'

const apiUrl = 'http://localhost:3001'

before(async () => {
  await initializeTestDb()
})

describe('Task API', () => {
  const token = getToken('task-test@example.com')

  it('gets all tasks', async () => {
    const response = await fetch(`${apiUrl}/tasks`)
    const data = await response.json()

    expect(response.status).to.equal(200)
    expect(data).to.be.an('array').that.is.not.empty
    expect(data[0]).to.include.all.keys(['id', 'description'])
  })

  it('creates a task', async () => {
    const newTask = { description: 'Test task' }
    const response = await fetch(`${apiUrl}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ task: newTask }),
    })
    const data = await response.json()

    expect(response.status).to.equal(201)
    expect(data).to.include.all.keys(['id', 'description'])
    expect(data.description).to.equal(newTask.description)
  })

  it('deletes a task', async () => {
    const response = await fetch(`${apiUrl}/tasks/1`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await response.json()

    expect(response.status).to.equal(200)
    expect(data).to.have.property('id', 1)
  })

  it('rejects a task without a description', async () => {
    const response = await fetch(`${apiUrl}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ task: { description: '   ' } }),
    })

    expect(response.status).to.equal(400)
  })

  it('rejects creating a task without a token', async () => {
    const response = await fetch(`${apiUrl}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task: { description: 'Unauthorized task' } }),
    })

    expect(response.status).to.equal(401)
  })
})

describe('User API', () => {
  const user = { email: 'existing@example.com', password: 'password123' }

  before(async () => {
    await insertTestUser(user)
  })

  it('signs up a new user', async () => {
    const newUser = { email: 'new@example.com', password: 'password123' }
    const response = await fetch(`${apiUrl}/users/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: newUser }),
    })
    const data = await response.json()

    expect(response.status).to.equal(201)
    expect(data).to.include.all.keys(['id', 'email'])
    expect(data.email).to.equal(newUser.email)
  })

  it('signs in with valid credentials', async () => {
    const response = await fetch(`${apiUrl}/users/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user }),
    })
    const data = await response.json()

    expect(response.status).to.equal(200)
    expect(data).to.include.all.keys(['id', 'email', 'token'])
    expect(data.email).to.equal(user.email)
  })

  it('rejects an incorrect password', async () => {
    const response = await fetch(`${apiUrl}/users/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: { ...user, password: 'wrong-password' } }),
    })

    expect(response.status).to.equal(401)
  })
})
