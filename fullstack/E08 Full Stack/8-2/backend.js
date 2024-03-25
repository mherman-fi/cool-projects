const express = require('express') 
const cors = require('cors')
const app = express()
const port = 3000

// Cors - allow connection from different domains and ports
app.use(cors())

// Convert json string to json object (from request)
app.use(express.json())

// Mongo
const mongoose = require('mongoose')
const mongoDB = 'mongodb+srv://michael:12345@cluster0.6zrrdun.mongodb.net/test'
mongoose.set('strictQuery', false);
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true})
const db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
  console.log("Database connected")
})

// Mongoose Schema and Model
// Schema
const todoSchema = new mongoose.Schema({
    text: { type: String, required: true } 
  })
  
  // Model
  const Todo = mongoose.model('Todo', todoSchema, 'todos')
  
  // Routes
  // Post
  app.post('/todos', async (request, response) => {
    const { text } = request.body
    const todo = new Todo({
      text: text
    })
    const savedTodo = await todo.save()
    response.json(savedTodo)  
  })

  // Get
  app.get('/todos/:id', async (request, response) => {
    const todo = await Todo.findById(request.params.id)
    if (todo) response.json(todo)
    else response.status(404).end()
  })

  // Put
  app.put('/todos/:id', async (request, response) => {
    const updatedTodo = await Todo.findByIdAndUpdate(
      request.params.id,
      { text: request.body.text },
      { new: true }
    )
    if (updatedTodo) response.json(updatedTodo)
    else response.status(404).end()
  })

  // Delete
  app.delete('/todos/:id', async (request, response) => {
    try {
      const id = request.params.id;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        response.status(400).json({ message: "Invalid ID" });
        return;
      }
      const deletedTodo = await Todo.findByIdAndRemove(id);
      if (deletedTodo) {
        response.json(deletedTodo);
      } else {
        response.status(404).json({ message: "Todo not found" });
      }
    } catch (error) {
      console.error(error);
      response.status(500).json({ message: "Server error" });
    }
  });
 
// Todos-route
app.get('/todos/', async(request, response) => {
    const todos = await Todo.find ({})
    response.json(todos)
    console.log(todos)
})

// App listen port 3000
app.listen(port, () => {
    console.log('App listening on port 3000')
  })