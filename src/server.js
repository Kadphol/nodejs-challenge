'use strict';

const Hapi = require('@hapi/hapi');
const Joi = require('joi');
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const HapiSwagger = require('hapi-swagger');

const { formatter } = require('./formatter');

const server = new Hapi.Server({
    host: 'localhost',
    port: 3000
});

const swaggerOptions = {
    info: {
        title: 'Nodejs Challenge API Documentation',
        version: '0.0.1'
    }
};

server.route({
    method: 'GET',
    path: '/',
    options: {
        description: 'home page',
        tags: ['api'],
    },
    handler: (request, h) => {
        return 'Hello World!'
    }
});

server.route({
    method: 'POST',
    path: '/organize',
    options: {
        description: 'Organize JSON payload to format',
        notes: 'Get payload with JSON data by moving children into parent objects',
        tags: ['api'],
        validate: {
            payload: Joi.object({
                data: Joi.object().pattern(
                    Joi.string(),
                    Joi.array().items(Joi.object({
                        id: Joi.number(),
                        title: Joi.string(),
                        level: Joi.number(),
                        children: Joi.array().items(Joi.object().allow(null)).allow(null),
                        parent_id: Joi.number().allow(null)
                    })) 
                )
            })
        }
    },
    handler: function(request, h) {
        let payload = request.payload;
        return formatter(payload.data);
    }
});

exports.init = async () => {

    await server.initialize();
    return server;
};

exports.start = async () => {
    await server.register([
        Inert,
        Vision,
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        }
    ]);
    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.error(err);
    process.exit(1);
});
