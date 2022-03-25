'use strict';

const Lab = require('@hapi/lab');
const { expect } = require('@hapi/code');
const { afterEach, beforeEach, describe, it } = exports.lab = Lab.script();
const { init } = require('../../src/server');
const input_test = require('./input_test.json');
const output_test = require('./output_test.json');

describe('Server route test', () => {
    describe('GET /', () => {
        let server;

        beforeEach(async () => {
            server = await init();
        });

        afterEach(async () => {
            await server.stop();
        });

        it('response with 200', async () => {
            const res = await server.inject({
                method: 'GET',
                url: '/'
            });
            expect(res.statusCode).to.equal(200);
        });
    });

    describe('POST /organize', () => {
        let server;
        let payload = input_test;
        let expected = output_test;

        beforeEach(async () => {
            server = await init();
        });

        afterEach(async () => {
            await server.stop();
        });

        it('response with organized JSON', async () => {
            let options = {
                method: 'POST',
                url: '/organize',
                payload: {
                    data: payload
                }
            };

            server.inject(options, (response) => {
                expect(response).to.have.property('status', 200);
                expect(response.payload).to.exist();
                expect(response.payload.length).to.equal(output_test.length);
                expect(JSON.stringify(response.payload)).to.equal(JSON.stringify(output_test));
            })
        })
    });
});