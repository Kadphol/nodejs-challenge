const Joi = require('joi');
const Boom = require('@hapi/boom');
const axios = require('axios');
const { formatter } = require('../formatter');

module.exports = [
    {
        method: ['POST'],
        path: '/api/organize',
        options: {
            description: 'Organize JSON payload to format',
            notes: 'Get payload with JSON data by moving children into parent objects',
            tags: ['api'],
            response: {
                schema: Joi.array().items(Joi.object({
                    id: Joi.number().example(10),
                    title: Joi.string().example("TEST"),
                    level: Joi.number().example(0),
                    children: Joi.array().items(Joi.object().allow(null)).allow(null).example([{
                        id: 11,
                        title: "TESTCHILD",
                        level: 1,
                        children: [],
                        parent_id: 10
                    }]),
                    parent_id: Joi.number().allow(null).example(null)
                }))
            },
            validate: {
                payload: Joi.object({
                    data: Joi.object().pattern(
                        Joi.string().example("1"),
                        Joi.array().items(Joi.object({
                            id: Joi.number().required(),
                            title: Joi.string().required(),
                            level: Joi.number().required(),
                            children: Joi.array().items(Joi.object().allow(null)).allow(null).required(),
                            parent_id: Joi.number().allow(null).required()
                        }))
                    ).example({
                        "0": [
                            {
                                id: 10,
                                title: "House",
                                level: 0,
                                children: [],
                                parent_id: null
                            }
                        ],
                        "1": [
                            {
                                id: 12,
                                title: "Red roof",
                                level: 1,
                                children: [],
                                parent_id: 10
                            },
                            {
                                id: 18,
                                title: "Blue roof",
                                level: 1,
                                children: [],
                                parent_id: 10
                            }
                        ]
                    })
                })
            }
        },
        handler: function(request, h) {
            let payload = request.payload;
            let data = formatter(payload.data);
            if(data.length) {
                return h.response(data).code(200);
            } else {
                throw Boom.badRequest();
            }
        }
    },
    {
        method: ['GET'],
        path: '/api/github',
        options: {
            description: 'Search github repositories with github search api',
            notes: 'pagination to Github Search API to find all repositories that match query nodejs',
            tags: ['api'],
            validate: {
                query: Joi.object({
                    page: Joi.number().min(1)
                })
            }
        },
        handler: async function(request, h) {
            let param = `q=nodejs&per_page=10&page=${request.query.page}`;
            let result = await axios.get(`https://api.github.com/search/repositories?${param}`);
            return await result.data;
        }
    },
    {
        method: ['GET'],
        path: '/api/github/all',
        options: {
            description: 'Search github repositories with github search api get all',
            notes: 'pagination to Github Search API to find all repositories that match query nodejs',
            tags: ['api']
        },
        handler: async function(request, h) {
            let param = `q=nodejs&per_page=100`;
            let result = await axios.get(`https://api.github.com/search/repositories?${param}`);
            return await result.data;
        }
    }
]