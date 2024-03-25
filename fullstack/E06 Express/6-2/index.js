const express = require('express') 
const app = express()
const fs = require('fs')

// Middleware function to log requests
const logger = (req, res, next) => {
    // Get the current date and time
    const now = new Date().toISOString()
    // Get the request method and path
    const { method, path } = req
    // Write the request information to a file
    fs.appendFileSync('logs.txt', `${now}: ${method} ${path}\n`)
    // Call the next function
    next()
}

app.use(express.json())
app.use(logger) // Enable the middleware

const port = 3000

app.listen(port,() => {
  console.log('Example app listening on port 3000')
})

let users = 
[
  { 'id':'1', 'name':'Kirsi Kernel' },
  { 'id':'2', 'name':'Matti Mainio' }
]

app.get('/users', (request, response) => {
    response.json(users)
})

app.get('/users/:id', (request, response) => {
    const { id } = request.params
    const user = users.find(user => user.id === id)
    response.json(user)
})

app.delete('/users/:id', (request, response) => {
    const { id } = request.params
    users = users.filter(user => user.id !== id)
    response.status(204).end()
})

app.put('/users/:id', (request, response) => {
    const { id } = request.params
    const { name } = request.query
    const user = users.find(user => user.id === id)
    if (user) {
      user.name = name
      response.status(200).end()
    } else {
      response.status(204).end()
    }
})

app.post('/users/', (request, response) => {
    const maxId = Math.max(...users.map(user => user.id), 0)
    const user = request.body
    user.id = (maxId+1).toString() 
    users = users.concat(user) 
    response.json(user)
})
