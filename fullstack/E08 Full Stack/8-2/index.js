// Global update
let updateMode = false
let updateID

function init() {
  let infoText = document.getElementById('infoText')
  infoText.innerHTML = 'Loading todos...'
  loadTodos()
}

async function loadTodos() {
  // change ip and port if needed
  const todos = await (await fetch('http://localhost:3000/todos')).json()
  console.log(todos)
  showTodos(todos)
}

function createTodoListItem(todo) {
  // create a new  LI element
  let li = document.createElement('li')
  // create a new id attribute
  let li_attr = document.createAttribute('id')
  // add todo id value to attribute
  li_attr.value = todo._id
  // add attribute to LI element
  li.setAttributeNode(li_attr)
  // add a new text node with todo text
  let text = document.createTextNode(todo.text)
  // add text node to LI element
  li.appendChild(text)
  
  createAllButtons(li, todo)
  return li

}
// Create generic button
function genericButton(cssAttr, text, onClick) {
  let span = document.createElement('span')
  let span_attr = document.createAttribute('class')
  span_attr.value = cssAttr 
  span.setAttributeNode(span_attr)
  let text2 = document.createTextNode(text)
  span.appendChild(text2)
  span.onclick = onClick
  return span
}
// Create edit button
function editButton(todo) {
  let editButton = genericButton('edit', ' e ', function() { updateTodo(todo._id) } )
  return editButton
}

// Create delete button
function deleteButton(todo) {
  let deleteButton = genericButton('delete', ' x ', function() { removeTodo(todo._id) } )
  return deleteButton
}

function createAllButtons(li, todo) {
  let spanEdit = editButton(todo)
  li.appendChild(spanEdit)
  let spanDelete = deleteButton(todo)
  li.appendChild(spanDelete)
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

async function updateTodo(id) {
  updateMode = true
  let createUpdateButton = document.getElementById('saveEditBtn')
  createUpdateButton.className = 'button-update'
  createUpdateButton.innerText = 'Save'
  updateID = id
  const response = await fetch('http://localhost:3000/todos/'+updateID)
  let li = await response.json()
  let update_li = document.getElementById('newTodo')
  update_li.value = li.text
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
  // Default adding state
  if(!updateMode) {  
  const data = { 'text': newTodo.value }
  if(newTodo.value === "") return 
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
}
else {
  let createUpdateButton = document.getElementById('saveEditBtn')
  createUpdateButton.className = 'button'
  createUpdateButton.innerText = 'Add'
  let li = document.getElementById(updateID)
  li.innerText = newTodo.value
  
  const data = { text: newTodo.value }
  const response = await fetch('http://localhost:3000/todos/'+updateID, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
    })
    let updatedTodo = await response.json()
    createAllButtons(li, updatedTodo)
    updateMode = false
}

  let infoText = document.getElementById('infoText')
  infoText.innerHTML = ''
  newTodo.value = ''
}

