// set up ========================
var hapi  = require('hapi');
var server = new hapi.Server(8080, { cors: true });

// configuration =================
var options = { server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } } };  

server.start(function () {
    console.log('Server running at:', server.info.uri);
});

// routes ========================
server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
        directory: {
            path: "./build"
        }
    }
});