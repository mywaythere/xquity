const request = require("supertest");
const app = require("./api");

describe('test for story getting', () => {
    test ('should return http code 200 when retrieving story', async () => {
        const res = await request(app).get('/stories');

        expect(res.statusCode).toBe(200);
    })
})