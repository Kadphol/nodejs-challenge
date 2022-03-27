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

const swaggerOptions = {
    info: {
        title: "Nodejs Challenge API Documentation",
        version: Package.version
    }
};

server.route(routes);

exports.init = async () => {
    await server.initialize();
    return server;
};

exports.start = async (start) => {
    await server.register([ Inert, Vision,
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        }
    ]);
    server.views({
        engines: {
            html: require("handlebars")
        },
        relativeTo: __dirname,
        path: "./public",
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
                return h.view("./index");
            }
        }
    );

    server.route(
        {
            method: "GET",
            path: "/list",
            handler: function(request, h) {
                return h.view("./list");
            }
        }
    );

    if(start) {
        await server.start();
        console.log(`Server running on ${server.info.uri}`);
    }
    return server
};

process.on("unhandledRejection", (err, origin) => {
    console.error("Caught exception:", err, "Exception origin:", origin);
});
