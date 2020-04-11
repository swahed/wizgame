const request = require('supertest');

describe('GET /json', function () {
    let server;
    beforeEach(function () {
        // delete require.cache[require.resolve('../server')];
        server = require('../server');
    });
    afterEach(function (done) {
        server.close(done);
    });
    // it('responds with json', function (done) {
    //     request(server)
    //         .get('/json')
    //         .set('Accept', 'application/json')
    //         .expect('Content-Type', /json/)
    //         .expect(200, done);
    // });
});