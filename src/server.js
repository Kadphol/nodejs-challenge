"use strict";

const Hapi = require("@hapi/hapi");
const Inert = require("@hapi/inert");
const Vision = require("@hapi/vision");
const HapiSwagger = require("hapi-swagger");
const Path = require("path");
const Package = require("../package.json");
const routes = require("./routes/api");

const server = new Hapi.Server({
    host: "localhost",
    port: 3000,
    routes: {
        files: {
            relativeTo: Path.join(__dirname, "public")
        }
    }
});

// swagger options 
const swaggerOptions = {
    info: {
        title: "Nodejs Challenge API Documentation",
        version: Package.version
    }
};

// register routes api
server.route(routes);

// initial server for testing
exports.init = async () => {
    await server.initialize();
    return server;
};

/**
 * Register plugin and views engine template to start server
 * @param   {boolean}       start   boolean to start server
 * @returns {Hapi.server}           instance with plupins for testing
 */
exports.start = async (start) => {
    // register plugins
    await server.register([ Inert, Vision,
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        }
    ]);

    // config view engine
    server.views({
        engines: {
            html: require("handlebars")
        },
        relativeTo: __dirname,
        path: "./public",
    });

    // route path for static files
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

    // route path for home page
    server.route({
        method: "GET",
        path: "/",
        handler: function(request, h) {
            return h.view("./index");
        }
    });

    // route path for list page
    server.route({
        method: "GET",
        path: "/list",
        handler: function(request, h) {
            return h.view("./list");
        }
    });

    // Check if start server
    if(start) {
        await server.start();
        console.log(`Server running on ${server.info.uri}`);
    }
    return server
};

// Caught unhandle rejection
process.on("unhandledRejection", (err, origin) => {
    console.error("Caught exception:", err, "Exception origin:", origin);
});
