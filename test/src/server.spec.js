'use strict';

const { expect } = require("@hapi/code");

describe('Server route test', () => {
    describe('GET /', () => {
        let server;

        before(async () => {
            server = await start();
        });

        after(async () => {
            await server.stop();
        });

        it("Hapi-Swagger Plugin successfully loads", async () => {
            expect(server.registrations['hapi-swagger']).not.to.be.undefined();
        });

        it("Inert Pulgin successfully loads", async () => {
            expect(server.registrations['@hapi/inert']).not.to.be.undefined();
        });

        it("Vision Pulgin successfully loads", async () => {
            expect(server.registrations['@hapi/vision']).not.to.be.undefined();
        });

        it('200 route sucess', async () => {
            const res = await server.inject({
                method: 'GET',
                url: '/'
            });
            expect(res.statusCode).to.equal(200);
        });

        it('404 route not found', async () => {
            const res = await server.inject({
                method: 'GET',
                url: '/a123'
            });
            expect(res.statusCode).to.equal(404);
            expect(res.result.error).to.equal("Not Found");
            expect(res.result.message).to.equal("Not Found");
        });

        it('static file route', async () => {
            const res = await server.inject({
                method: 'GET',
                url: '/table.js'
            });
            expect(res.statusCode).to.equal(200);
        });
    });
});