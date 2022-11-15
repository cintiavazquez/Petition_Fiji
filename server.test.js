const supertest = require("supertest");
const app = require("./server.js");
const cookieSession = require("cookie-session");

test("GET /", () => {
    return supertest(app)
        .get("/")
        .then((response) => {
            expect(response.statusCode).toBe(302);
            expect(response.headers.location).toBe("/register");
        });
});

test("GET /login", () => {
    cookieSession.mockSessionOnce({
        user_id: 5,
    });
    return supertest(app)
        .get("/login")
        .then((response) => {
            expect(response.statusCode).toBe(302);
            expect(response.headers.location).toBe("/petition");
        });
});

test("GET /register", () => {
    cookieSession.mockSessionOnce({
        user_id: 5,
    });
    return supertest(app)
        .get("/register")
        .then((response) => {
            expect(response.statusCode).toBe(302);
            expect(response.headers.location).toBe("/petition");
        });
});

test("GET /petition", () => {
    return supertest(app)
        .get("/petition")
        .then((response) => {
            expect(response.statusCode).toBe(302);
            expect(response.headers.location).toBe("/login");
        });
});

test("GET /petition", () => {
    cookieSession.mockSessionOnce({
        user_id: 5,
        signatureId: true,
    });
    return supertest(app)
        .get("/petition")
        .then((response) => {
            expect(response.statusCode).toBe(302);
            expect(response.headers.location).toBe("/thank-you");
        });
});

test("GET /thank-you", () => {
    cookieSession.mockSessionOnce({
        user_id: 5,
        signatureId: null,
    });
    return supertest(app)
        .get("/thank-you")
        .then((response) => {
            expect(response.statusCode).toBe(302);
            expect(response.headers.location).toBe("/petition");
        });
});
