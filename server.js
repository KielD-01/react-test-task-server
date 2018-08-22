const xPress = require('express');
const bodyParser = require('body-parser');
const server = xPress();
const Models = require('./src/Models');
const Libs = {Configurator: require('project-configurator')};
const Configurator = new Libs.Configurator();
const port = 3223;

if (!Configurator.getConfig('config.firebase')) {
    return console.log('Because of no config to the Firebase in the configurator, You can\'t start the server. You can update the configs in `configurator/conf.json`');
}

console.log('Configurations to the FireBase does exists. Setting Up...');

/* Use Body Parser to consume JSON Body Requests */
server.use(bodyParser.json());

/* FireBase Configurations */
const Firebase = require('firebase');
const firebaseDB = Firebase.initializeApp(Configurator.getConfig('config.firebase'));

/* Models */
const TodoLists = new Models.TodoLists(firebaseDB);

/* Get a List of To-Do */
server.get('/api', (request, response) => {
    const data = TodoLists.get();
    return response.send({data});
});

/* Get a Single To-Do */
server.get('/api/todo/:id', (request, response) => {
    const data = TodoLists.get(request.params.id);
    return response.send({data});
});

/* Create a To-Do */
server.post('/api/todo', (request, response) => {
    const result = TodoLists.create(request.body.todo, request.body.title);
    return response.send({result});
});

/* Remove / Delete a To-Do */
server.delete('/api/todo/:id', (request, response) => {
    const result = TodoLists.remove(request.params.id);
    return response({result});
});

/* Server Listener */
server.listen(port, () => {
    console.log(`Server is running at localhost:${port}`);
});