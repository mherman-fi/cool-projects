const express = require('express') 
const mongoose = require('mongoose')
const app = express()
app.use(express.json())
const port = 3000

// connection string
const mongoDB = 'mongodb+srv://michael:*****@cluster0.6zrrdun.mongodb.net/test'

// connect mongodb
mongoose.set('strictQuery', false);
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true})
const db = mongoose.connection

// check connection - ok or error
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
  console.log("Database connected")
})

// new schema
const userSchema = new mongoose.Schema({
    name: String
})

const personSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, min: 0 },
    email: String
})

// new model
const User = mongoose.model('User', userSchema, 'users')

// delete user via GET Postman request to get JSON data from server
// Use DELETE request to delete one user from server
app.delete('/users/:id', async(request, response) => {
    const deleteUser = await User.findByIdAndRemove(request.params.id)
        if (deleteUser)
            response.json(deleteUser)
        else response.status(204).end()
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

// create new user
// POST request to Postman server to see same JSON data returned from server side
app.post('/users', async (request, response) => {
    // Get name from request
    const { name } = request.body
  
    // Create a new user
    const user = new User({
      name: name
    })
  
    // Save to db and send back to caller
    const savedUser = await user.save()
    response.json(savedUser)  
  })
//GET request to server side to check old and new users are available server-side
app.get('/users', async (request, response) => {
    // Get name from request
    const user = await User.find ({})
    response.json(user)
    console.log(user)
})
app.listen(port,() => {
console.log("Listening to port 3000")
})
