const express = require('express') 
const app = express()
app.use(express.json())
const port = 3000

app.listen(port,() => {
  console.log('Example app listening on port 3000')
})

let users = 
[
  { 'id':'1', 'name':'Kirsi Kernel' },
  { 'id':'2', 'name':'Matti Mainio' }
]
// get all users: GET request to http://localhost:3000/users/ via Postman
app.get('/users', (request, response) => {
    response.json(users)
})

// get user: Test GET request to http://localhost:3000/users/1 with via Postman
app.get('/users/:id', (request, response) => {
    // Note: Can be done in different ways 
    // const id = request.params.id
    const { id } = request.params
    const user = users.find(user => user.id === id)
    response.json(user)
})

// delete user via GET Postman request to get JSON data from the server
// Use DELETE request to delete one of the users from server.
app.delete('/users/:id', (request, response) => {
    const { id } = request.params
    users = users.filter(user => user.id !== id)
    // Send "204 no content" status code
    response.status(204).end()
})

// update user data via GET request in Postman to http://localhost:3000/users/
app.put('/users/:id', (request, response) => {
    //const id = request.params.id
    const { id } = request.params
    // const name = request.query.name
    const { name } = request.query
    const user = users.find(user => user.id === id)
    if (user) {
      user.name = name
      response.status(200).end()
  } else {
      if(!response.headersSent){
          response.status(204).end()
      }
  }
  
})

// create a new user
// POST request to Postman server to see the same JSON data returned from the server side
app.post('/users/', (request, response) => {
    const maxId = Math.max(...users.map(user => user.id), 0)
    const user = request.body
    user.id = (maxId+1).toString() 
    users = users.concat(user) 
    response.json(user)
})

//GET request to server side to check old and new users are available server-side


  