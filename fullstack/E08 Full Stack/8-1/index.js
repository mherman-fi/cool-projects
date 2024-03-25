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

  // Delete
  app.delete('/todos/:id', async (request, response) => {
    const deletedTodo = await Todo.findByIdAndRemove(request.params.id)
    if (deletedTodo) response.json(deletedTodo)
    else response.status(404).end()
  })
 
// Todos-route
app.get('/todos/', async(request, response) => {
    const todos = await Todo.find ({})
    response.json(todos)
    console.log(todos)
})
function init() {
  let infoText = document.getElementById('infoText')
  infoText.innerHTML = 'Loading todos...'
  loadTodos()
}
async function loadTodos() {
  // change ip and port if needed
  let response = await fetch('http://localhost:3000/todos')
  let todos = await response.json()
  console.log(todos)
  showTodos(todos)
}

function createTodoListItem(todo) {
  // create a new  LI element
  let li = document.createElement('li')
  // create a new id attribute
  let li_attr = document.createAttribute('id')
  // add todo id value to attribute
  li_attr.value= todo._id
  // add attribute to LI element
  li.setAttributeNode(li_attr)
  // add a new text node with todo text
  let text = document.createTextNode(todo.text)
  // add text node to LI element
  li.appendChild(text)
  // create a new SPAN element, x char -> delete todo
  let span = document.createElement('span')
  // create a new attribute
  let span_attr = document.createAttribute('class')
  // add delete value (look css)
  span_attr.value = 'delete'
  // add attribute to SPAN element 
  span.setAttributeNode(span_attr)
  // create a text node with x text
  let x = document.createTextNode(' x ')
  // add text node to SPAN element 
  span.appendChild(x)
  // add event listener to SPAN element, onclick event call removeTodo function
  span.onclick = function() { removeTodo(todo._id) }
  // add SPAN element to LI element
  li.appendChild(span)
  // return created LI element 
  // will be following formula: <li>Call Esa!<span class="remove">x</span></li>
  return li
}

function showTodos(todos) {
  let todosList = document.getElementById('todosList')
  let infoText = document.getElementById('infoText')
  // no todos
  if (todos.length === 0) {
    infoText.innerHTML = 'No Todos'
  } else {    
    todos.forEach(todo => {
        let li = createTodoListItem(todo)        
        todosList.appendChild(li)
    })
    infoText.innerHTML = ''
  }
}

async function removeTodo(id) {
  const response = await fetch('http://localhost:3000/todos/'+id, {
    method: 'DELETE'
  })
  let responseJson = await response.json()
  let li = document.getElementById(id)
  li.remove()

  let todosList = document.getElementById('todosList')
  if (!todosList.hasChildNodes()) {
    let infoText = document.getElementById('infoText')
    infoText.innerHTML = 'No Todos'
  }
}

async function addTodo() {
  let newTodo = document.getElementById('newTodo')
  const data = { 'text': newTodo.value }
  const response = await fetch('http://localhost:3000/todos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  let todo = await response.json()
  let todosList = document.getElementById('todosList')
  let li = createTodoListItem(todo)
  todosList.appendChild(li)

  let infoText = document.getElementById('infoText')
  infoText.innerHTML = ''
  newTodo.value = ''
}

// App listen port 3000
app.listen(port, () => {
  console.log('App listening on port 3000')
})
