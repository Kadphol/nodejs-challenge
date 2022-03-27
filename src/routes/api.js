const Joi = require("joi");
const Boom = require("@hapi/boom");
const axios = require("axios");
const { formatter } = require("../formatter");

const childrenSchema = Joi.object({
    id: Joi.number(),
    title: Joi.string(),
    level: Joi.number(),
    children: Joi.array().items(Joi.object().allow(null)).allow(null),
    parent_id: Joi.any().allow(null)
}).label("children object");

const objectSchema = Joi.object({
    id: Joi.number(),
    title: Joi.string(),
    level: Joi.number(),
    children: Joi.array().items(childrenSchema),
    parent_id: Joi.any().allow(null)
})

module.exports = [
    {
        method: ["POST"],
        path: "/api/organize",
        options: {
            description: "Organize JSON payload to format",
            notes: "Get payload with JSON data by moving children into parent objects",
            tags: ["api"],
            response: {
                schema: Joi.array().items(objectSchema).allow(null).label("JSON organized result")
            },
            validate: {
                payload: Joi.object({
                    data: Joi.object().pattern(
                        Joi.string().example("1"),
                        Joi.array().items(objectSchema.label("items"))
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
                }).label("JSON payload")
            }
        },
        handler: function(request, h) {
            let payload = request.payload;
            let data = formatter(payload.data);
            if(data.length) {
                console.log(data);
                return data;
            } else {
                throw Boom.badRequest();
            }
        }
    },
    {
        method: ["GET"],
        path: "/api/github/table",
        options: {
            description: "Get data for datatable",
            notes: "Get data for datatable, can be see parameter from https://datatables.net/manual/server-side",
            tags: ["api"]
        },
        handler: async function(request, h) {
            let draw = parseInt(request.query.draw);
            let page = parseInt(request.query.start)/10 + 1;
            let pageData = await axios.get(`http://localhost:3000/api/github?page=${page}`);
            let items_list = [];
            try{
                pageData.data.items.forEach((e, index)=> {
                    let item = {};
                    item.id = index+(10 * (page-1));
                    item.repo_id = e.id;
                    item.name = e.full_name;
                    item.url = e.html_url;
                    item.count = e.stargazers_count;
                    item.date = e.updated_at;
                    items_list.push(item);
                });
            } catch(e) {
                throw new Boom.internal("Internal Server Error");
            }
            
            let data = {
                draw: draw,
                recordsTotal: pageData.data.total_count,
                recordsFiltered: 1000,
                data: items_list
            };
            return data;
        }
    },
    {
        method: ["GET"],
        path: "/api/github",
        options: {
            description: "Search github repositories with github search api",
            notes: "pagination to Github Search API to find all repositories that match query nodejs",
            tags: ["api"],
            validate: {
                query: Joi.object({
                    page: Joi.number().required().min(1)
                })
            }
        },
        handler: async function(request, h) {
            let param = `q=nodejs&per_page=10&page=${request.query.page}`;
            if(request.query.page > 100) {
                throw new Boom.rangeNotSatisfiable("Only the first 1000 search results are available");
            }
            try {
                let result = await axios.get(`https://api.github.com/search/repositories?${param}`);
                return await result.data;
            } catch (e) {
                throw new Boom.internal("Internal Server Error");
            }
            
        }
    },
    {
        method: ["GET"],
        path: "/api/github/all",
        options: {
            description: "Search github repositories with github search api get all",
            notes: "pagination to Github Search API to find all repositories that match query nodejs",
            tags: ["api"]       
        },
        handler: async function(request, h) {
            let param = `q=nodejs&per_page=100`;
            let result = await axios.get(`https://api.github.com/search/repositories?${param}`);
            return await result.data;
        }
    }
]