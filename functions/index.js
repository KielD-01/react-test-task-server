const functions = require('firebase-functions');
const admin = require('firebase-admin');
const xPress = require('express');
const bodyParser = require('body-parser');
const server = xPress();
const Models = require('./src/Models');
const cors = require('cors');
const _ = require('lodash');
const port = 3223;


/* Use Body Parser to consume JSON Body Requests */
server.use(bodyParser.json());
server.use(cors({origin: true}));

admin.initializeApp();

/* Models */
const TodoLists = new Models.TodoLists(admin);

/* Get a List of To-Do */
server.get('/', (request, response) => {
    const data = TodoLists.get();
    return response.send({data});
});

/* Create a To-Do List */
server.post('/todo', (request, response) => {
    const result = TodoLists.create(request.body.todo, request.body.title);
    return response.send({result});
});

/* Get a Single To-Do List */
server.get('/todo/:id', (request, response) => {
    const data = TodoLists.get(request.params.id);
    return response.send({data});
});

/* Remove / Delete a To-Do List */
server.delete('/todo/:id', (request, response) => {
    const result = TodoLists.remove(request.params.id);
    return response.send({result});
});

/* Create a To-Do item in the List */
server.post('/todo/:listId', (request, response) => {
    const result = new Models.TodoListItems(admin, request.params.listId).create(request.body.text, request.body.completed);
    return response.send({result});
});

/* Update a To-Do item in the List */
server.patch('/todo/:listId/item/:itemId', (request, response) => {
    const result = new Models.TodoListItems(admin, request.params.listId).update(request.params.itemId, request.body);
    return response.send({result});
});

/* Remove a To-Do item from the List */
server.delete('/todo/:listId/item/:itemId', (request, response) => {
    const result = new Models.TodoListItems(admin, request.params.listId).delete(request.params.itemId);
    return response.send({result});
});

exports.api = functions.https.onRequest(server);