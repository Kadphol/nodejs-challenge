'use strict';

const Hapi = require('@hapi/hapi');
const { fomatter } = require('./formatter');

const server = new Hapi.Server({
    host: 'localhost',
    port: 3000
});

const init = async () => {
    await server.start();
    console.log('Server running on %s', server.info.uri);
    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            return 'Hello World!'
        }
    });

    server.route({
        method: 'POST',
        path: '/organize',
        handler: function(request, reply) {
            console.log(request.payload);
            console.log(request.raw.req.headers);
            return reply('hello world');
        },
        config: {
            payload: {
                output: 'data',
                parse: false
            }
        }
    })
};
init();
fomatter({"0":
[{"id": 10,
  "title": "House",
  "level": 0,
  "children": [],
  "parent_id": null}],
"1":
[{"id": 12,
  "title": "Red Roof",
  "level": 1,
  "children": [],
  "parent_id": 10},
 {"id": 18,
  "title": "Blue Roof",
  "level": 1,
  "children": [],
  "parent_id": 10},
 {"id": 13,
  "title": "Wall",
  "level": 1,
  "children": [],
  "parent_id": 10}],
"2":
[{"id": 17,
  "title": "Blue Window",
  "level": 2,
  "children": [],
  "parent_id": 12},
 {"id": 16,
  "title": "Door",
  "level": 2,
  "children": [],
  "parent_id": 13},
 {"id": 15,
  "title": "Red Window",
  "level": 2,
  "children": [],
  "parent_id": 12}]});