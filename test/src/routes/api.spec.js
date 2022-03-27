'use strict';
const nock = require('nock');
const input_test = require('./input_test.json');
const output_test = require('./output_test.json');

describe('/api route', () => {
    let server;

    beforeEach(async () => {
        server = await init();
    });

    afterEach(async () => {
        await server.stop();
    });

    describe('POST /organize', () => {
        let payload = input_test;
        let expected = output_test;
    
        it('200 response with organized JSON', async () => {
            let options = {
                method: 'POST',
                url: '/api/organize',
                payload: {
                    data: payload
                }
            };
    
            const res = await server.inject(options);
            expect(res.statusCode).to.equal(200);
            expect(res.payload).to.exist();
            const response = JSON.parse(res.payload);
            expect(response.length).to.equal(output_test.length);
            expect(JSON.stringify(response)).to.equal(JSON.stringify(expected));
        });
    
        it('400 Bad request payload with wrong format', async () => {
            let options = {
                method: 'POST',
                url: '/api/organize',
                payload: {
                    data: {}
                }
            };
    
            const res = await server.inject(options);
            expect(res.statusCode).to.equal(400);
            expect(res.result.error).to.equal("Bad Request");
            expect(res.result.message).to.equal("Bad Request");
        });
    
        it('404 not found', async () => {
            let options = {
                method: 'GET',
                url: '/api/organize'
            };
    
            const res = await server.inject(options);
            expect(res.statusCode).to.equal(404);
        });
    });

    describe('GET /github?page=', () => {
        it('200 get result page', async () => {
            // mock api github search response
            nock('https://api.github.com')
                .get('/search/repositories?q=nodejs&per_page=10&page=1')
                .reply(200, {
                    "incomplete_results": false,
                    "total_counts": 549412,
                    "items": new Array(10).fill({})
                });
            let options = {
                method: 'GET',
                url: '/api/github?page=1'
            };

            const res = await server.inject(options);
            expect(res.statusCode).to.equal(200);
            expect(res.payload).to.exist();
            const response = JSON.parse(res.payload);
            expect(response.incomplete_results).to.equal(false);
            expect(response.items).to.have.length(10);
        });

        it('400 Bad request', async () => {
            let options = {
                method: 'GET',
                url: '/api/github?page=0'
            };

            const res = await server.inject(options);
            expect(res.statusCode).to.equal(400);
            expect(res.result.error).to.equal("Bad Request");
            expect(res.result.message).to.equal("Invalid request query input");
        })

        it('404 not found', async () => {
            let options = {
                method: 'POST',
                url: '/api/github?page=1'
            };

            const res = await server.inject(options);
            expect(res.statusCode).to.equal(404);
            expect(res.result.error).to.equal("Not Found");
            expect(res.result.message).to.equal("Not Found");
        });
    });

    describe('GET /github/all', () => {
        it('200 get result page', async () => {
            // mock api github search response
            nock('https://api.github.com')
                .get('/search/repositories?q=nodejs&per_page=100')
                .reply(200, {
                    "incomplete_results": false,
                    "total_counts": 549412,
                    "items": new Array(100).fill({})
                });
            let options = {
                method: 'GET',
                url: '/api/github/all'
            };

            const res = await server.inject(options);
            expect(res.statusCode).to.equal(200);
            expect(res.payload).to.exist();
            const response = JSON.parse(res.payload);
            expect(response.incomplete_results).to.equal(false);
            expect(response.items).to.have.length(100);
        });

        it('404 wrong method', async () => {
            let options = {
                method: 'POST',
                url: '/api/github/all'
            };

            const res = await server.inject(options);
            expect(res.statusCode).to.equal(404);
            expect(res.payload).to.exist();
            expect(res.result.error).to.equal("Not Found");
            expect(res.result.message).to.equal("Not Found");
        })
    });
});