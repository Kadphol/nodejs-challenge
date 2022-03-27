"use strict";
const { expect } = require("@hapi/code");
const nock = require("nock");
const input_test = require("./input_test.json");
const output_test = require("./output_test.json");

describe("/api route", () => {
    let server;

    beforeEach(async () => {
        server = await init();
    });

    afterEach(async () => {
        await server.stop();
    });

    describe("POST /organize", () => {
        it("200 response with organized JSON", async () => {
            let options = {
                method: "POST",
                url: "/api/organize",
                payload: {
                    data: input_test
                }
            };

            const res = await server.inject(options);
            expect(res.statusCode).to.equal(200);
            expect(res.payload).to.exist();
            const response = JSON.parse(res.payload);
            expect(response.length).to.equal(output_test.length);
            expect(JSON.stringify(response)).to.equal(JSON.stringify(output_test));
        });
    
        it("400 Bad request payload with wrong format", async () => {
            let options = {
                method: "POST",
                url: "/api/organize",
                payload: {
                    data: {}
                }
            };
    
            const res = await server.inject(options);
            expect(res.statusCode).to.equal(400);
            expect(res.result.error).to.equal("Bad Request");
            expect(res.result.message).to.equal("Bad Request");
        });
    
        it("404 not found", async () => {
            let options = {
                method: "GET",
                url: "/api/organize"
            };
    
            const res = await server.inject(options);
            expect(res.statusCode).to.equal(404);
        });
    });

    describe("GET /github?page=", () => {
        it("200 get result page", async () => {
            // mock api github search response
            nock("https://api.github.com")
                .get("/search/repositories")
                .query({ q: "nodejs", per_page: "10", page: "1" })
                .reply(200, {
                    "incomplete_results": false,
                    "total_counts": 549412,
                    "items": new Array(10).fill({})
                });
            let options = {
                method: "GET",
                url: "/api/github?page=1"
            };

            const res = await server.inject(options);
            expect(res.statusCode).to.equal(200);
            expect(res.payload).to.exist();
            const response = JSON.parse(res.payload);
            expect(response.incomplete_results).to.equal(false);
            expect(response.items).to.have.length(10);
        });

        it("400 Bad request", async () => {
            let options = {
                method: "GET",
                url: "/api/github?page=0"
            };

            const res = await server.inject(options);
            expect(res.statusCode).to.equal(400);
            expect(res.result.error).to.equal("Bad Request");
            expect(res.result.message).to.equal("Invalid request query input");
        })

        it("404 not found", async () => {
            let options = {
                method: "POST",
                url: "/api/github?page=1"
            };

            const res = await server.inject(options);
            expect(res.statusCode).to.equal(404);
            expect(res.result.error).to.equal("Not Found");
            expect(res.result.message).to.equal("Not Found");
        });

        it("exceed amount of page", async () => {
            let options = {
                method: "GET",
                url: "/api/github?page=101"
            };

            const res = await server.inject(options);
            expect(res.statusCode).to.equal(416);
            expect(res.result.error).to.equal("Requested Range Not Satisfiable");
            expect(res.result.message).to.equal("Only the first 1000 search results are available");
        });

        it("500 internal error", async () => {
            let options = {
                method: "GET",
                url: "/api/github?page=10"
            };

            nock("https://api.github.com")
                .get("/search/repositories")
                .query({ q: "nodejs", per_page: "10", page: "10" })
                .reply(500);

            const res = await server.inject(options);
            expect(res.statusCode).to.equal(500);
            expect(res.result.error).to.equal("Internal Server Error");
            expect(res.result.message).to.equal("An internal server error occurred");
        });
    });

    describe("GET /github/all", () => {
        it("200 get result page", async () => {
            // mock api github search response
            nock("https://api.github.com")
                .get("/search/repositories")
                .query({ q: "nodejs", per_page: "100" })
                .reply(200, {
                    "incomplete_results": false,
                    "total_counts": 549412,
                    "items": new Array(100).fill({})
                });
            let options = {
                method: "GET",
                url: "/api/github/all"
            };

            const res = await server.inject(options);
            expect(res.statusCode).to.equal(200);
            expect(res.payload).to.exist();
            const response = JSON.parse(res.payload);
            expect(response.incomplete_results).to.equal(false);
            expect(response.items).to.have.length(100);
        });

        it("404 wrong method", async () => {
            let options = {
                method: "POST",
                url: "/api/github/all"
            };

            const res = await server.inject(options);
            expect(res.statusCode).to.equal(404);
            expect(res.payload).to.exist();
            expect(res.result.error).to.equal("Not Found");
            expect(res.result.message).to.equal("Not Found");
        });
    });

    describe("GET /github/table", () => {
        it("200 get result page for table", async () => {
            let options = {
                method: "GET",
                url: "/api/github/table?draw=1&start=10"
            };

            nock("http://localhost:3000")
                .get("/api/github")
                .query({ page: "2" })
                .reply(200, {
                    "incomplete_results": false,
                    "total_counts": 549412,
                    "items": new Array(10).fill({
                        id: 123,
                        full_name: "test",
                        html_url: "https://api.github.com",
                        stargazers_count: 100,
                        updated_at: "2022-03-26T22:59:26Z"
                    })
                });

            const res = await server.inject(options);
            expect(res.statusCode).to.equal(200);
            expect(res.payload).to.exist();
            const response = JSON.parse(res.payload);
            expect(response.draw).to.equal(1);
            expect(response.data).to.have.length(10);
            expect(response.data[0].id).to.equal(10);
        });

        it("404 wrong method", async () => {
            let options = {
                method: "POST",
                url: "/api/github/table?draw=1&start=10"
            };

            const res = await server.inject(options);
            expect(res.statusCode).to.equal(404);
            expect(res.payload).to.exist();
            expect(res.result.error).to.equal("Not Found");
            expect(res.result.message).to.equal("Not Found");
        });

        it("404 missing query", async () => {
            let options = {
                method: "POST",
                url: "/api/github/table?&start=10"
            };

            const res = await server.inject(options);
            expect(res.statusCode).to.equal(404);
            expect(res.payload).to.exist();
            expect(res.result.error).to.equal("Not Found");
            expect(res.result.message).to.equal("Not Found");
        });

        it("500 no data results", async () => {
            let options = {
                method: "GET",
                url: "/api/github/table?draw=1&start=10"
            };

            nock("http://localhost:3000")
                .get("/api/github")
                .query({ page: "2" })
                .reply(200, {
                    "incomplete_results": false,
                    "total_counts": 549412,
                    "items": 0
                });

            const res = await server.inject(options);
            expect(res.statusCode).to.equal(500);
            expect(res.payload).to.exist();
            expect(res.result.error).to.equal("Internal Server Error");
            expect(res.result.message).to.equal("An internal server error occurred");
        });
    });
});