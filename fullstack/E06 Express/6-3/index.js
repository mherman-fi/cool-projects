const express = require('express') 
const app = express()
const fs = require('fs')
const path = require('path')

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
app.use(express.urlencoded({extended: true} ))
app.use(logger) // Enable middleware
app.set('views', path.join(__dirname, './views')); // Specify views folder
app.set('view engine', 'ejs');

const port = 3000

app.listen(port,() => {
  console.log('Example app listening on port 3000')
})

let users = 
[
  { 'id':'1', 'name':'Kirsi Kernel' },
  { 'id':'2', 'name':'Matti Mainio' }
]

app.get('/', (request, response) => { 
    response.render('userlist', { users: users });
    response.redirect('/userlist');
});

app.get('/userlist', (request, response) => { 
    response.render('userlist', { users: users });
})

app.get('/adduser', (request, response) => {
    response.render('adduser');
});

app.post('/users', (request, response) => {
    const maxId = Math.max(...users.map(user => user.id), 0);
    const user = {
        id: (maxId + 1).toString(),
        name: request.body.name
    };
    console.log(user);
    users.push(user);
    response.redirect('/userlist');

})

app.delete('/users/:id', (request, response) => {
    const { id } = request.params;
    users = users.filter(user => user.id !== id)
    response.status(204).end();
})

app.put('/users/:id', (request, response) => {
    const { id } = request.params;
    const { name } = request.query;
    const user = users.find(user => user.id === id)
    if (user) {
      user.name = name;
      response.status(200).end();
    } else {
      response.status(204).end();
    }
})