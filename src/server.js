'use strict';

const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const HapiSwagger = require('hapi-swagger');
const Path = require('path');
const routes = require('./routes');

const server = new Hapi.Server({
    host: 'localhost',
    port: 3000,
    routes: {
        files: {
            relativeTo: Path.join(__dirname, 'public')
        }
    }
});

const swaggerOptions = {
    info: {
        title: 'Nodejs Challenge API Documentation',
        version: '0.0.1'
    }
};

server.route(routes);

exports.init = async () => {
    await server.initialize();
    return server;
};

exports.start = async () => {
    await server.register([ Inert, Vision,
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        }
    ]);
    server.views({
        engines: {
            html: require('handlebars')
        },
        relativeTo: __dirname,
        path: './public',
    });

    server.route({
        method: "GET",
        path: "/{path*}",
        handler: {
            directory: {
                path: ".",
                redirectToSlash: true,
                index: true
            },
        },
    });

    server.route(
        {
            method: "GET",
            path: "/",
            handler: function(request, h) {
                try{
                    return h.view('./index', { title: "test"});
                } catch(e) {
                    console.error(e);
                }
            }
        }
    );

    await server.start();
};

process.on('unhandledRejection', (err, origin) => {
    console.error('Caught exception:', err, 'Exception origin:', origin);
});
