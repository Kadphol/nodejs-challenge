'use strict';

describe('Server route test', () => {
    describe('GET /', () => {
        let server;

        beforeEach(async () => {
            server = await init();
        });

        afterEach(async () => {
            await server.stop();
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
        })
    });
});