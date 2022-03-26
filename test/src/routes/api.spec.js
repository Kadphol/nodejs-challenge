'use strict';
const { expect } = require('@hapi/code');
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

    describe('GET /github/{page}', () => {
        it('200 get result page', async () => {
            let options = {
                method: 'GET',
                url: '/api/github/1'
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
                url: '/api/github/a'
            };

            const res = await server.inject(options);
            expect(res.statusCode).to.equal(400);
            expect(res.result.error).to.equal("Bad Request");
            expect(res.result.message).to.equal("Invalid request params input");
        })

        it('404 not found', async () => {
            let options = {
                method: 'POST',
                url: '/api/github/1'
            };

            const res = await server.inject(options);
            expect(res.statusCode).to.equal(404);
        });
    });
});