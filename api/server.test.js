const db = require('../database/dbConfig.js');
const Users = require('../users/usersModel.js');
const server = require('./server.js');
const request = require('supertest');

describe('get / from server', () => {
    test('should return json', async () => {
        const res = await request(server).get('/');
        expect(res.type).toBe('application/json');
    })

    test("should return an object api: up", async () => {
        const res = await request(server).get('/');
        expect(res.body).toEqual({api: "up"});
    })
})

describe("register", () => {
    beforeAll(async() => {
        await db('users').truncate();
    })

    test("registers a new user to the server", async () => {
        await Users.add({username: 'fady4', password: 'test'});
        const user = await db('users');
        expect(user).toHaveLength(1);
    });

    test("returns status 201 if new user", async () => {
        const data = { username: "testing15", password: "test"};
        const res = await request(server).post('/api/auth/register').send(data);
        expect(res.statusCode).toBe(201);
    })
})

describe("login", () => {
    beforeAll(async() => {
        await db('users').truncate();
    })    
    test("return 401 if user does not exist, no seed data in database", async () => {
        const data = { username: "abc", password: "test"};
        const res = await request(server).post('/api/auth/login').send(data);
        expect(res.statusCode).toBe(401);
    });
    test("returns 400 is password is not given", async () => {
        const data = {username: "chicken", password: ""};
        const res = await request(server).post('/api/auth/login').send(data);
        expect(res.statusCode).toBe(400);
    })
})

describe("jokes request", () => {
    it("returns 500 if no session is found", async () => {
        const res = await request(server).get("/api/jokes");
        expect(res.statusCode).toBe(500);
    });
    it("returns a JSON object", async () => {
        const res = await request(server).get("/api/jokes");
        expect(res.type).toBe("text/html");
    });
});