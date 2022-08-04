//connection to DB
//and DB functions that should be exported
const { log } = console;

const spicedPg = require("spiced-pg");
//spiced-pg is a simple wrapper around the node-postgres package (aka pg) that was created for use in this course. Using it ensures that you do not create too many database connections and that the process of deploying your project will be fairly straightforward. When you do this, spiced-pg will create a pool of 10 connections to the specified database. These connections will close after 30 seconds of inactivity but will be reopened when activity resumes. If you call the function again with the same string, no new connections will be created.

//The object that is returned from the call above has a single method, query, that you can use to query your database.

const { DATABASE_USER, DATABASE_PASSWORD } = require("../secrets.json");

log(DATABASE_USER, DATABASE_PASSWORD);

const DATABASE_NAME = "geography";
//this will be petition

//

const db = spicedPg(
    `postgres:${DATABASE_USER}:${DATABASE_PASSWORD}@localhost:5432/${DATABASE_NAME}`
);
//db.query("SELECT * FROM cities").then((result)=> {console.log(result.rows)})
//db.query("SELECT * FROM cities" WHERE population > 3000000).then((result)=> {console.log(result.rows)})
//to make it general, wrap into fn:

function getCities() {
    return db
        .query("SELECT * FROM cities")
        .then((result) => result.rows)
        .catch((error) => error);
}

function getCitiesByCountry(country) {
    return db
        .query("SELECT * FROM cities WHERE country = $1", [country])
        .then((result) => console.log("cities by country", result.rows))
        .catch((error) => error);
}

function getCitiesByName(city) {
    return db
        .query(`SELECT * FROM cities WHERE name = $1`, [city])
        .then((result) => console.log("db: result rows", result.rows[0]));
    //because we want the obj inside without the array around it
}

function createCity({ name, population, country }) {
    return db
        .query(
            `INSERT INTO cities (name, population, country)
    VALUES ($1, $2, $3)
    RETURNING *`,
            [name, population, country]
        )
        .then((result) => result.rows[0]);
}

//getCities();
//getCitiesByCountry("Germany");
//getCitiesByName("Bremen");

// AUTH
const users = [
    {
        id: 1,
        name: "User One",
        email: "user_1@example.com",
        password: "password_1",
    },
    {
        id: 2,
        name: "User Two",
        email: "user_2@example.com",
        password: "password_2",
    },
    {
        id: 3,
        name: "User Three",
        email: "user_3@example.com",
        password: "password_3",
    },
];

function login({ email, password }) {
    const foundUser = users.find((user) => user.email === email);

    if (!foundUser) {
        console.log("no email match");
        return null;
    }

    if (foundUser.password !== password) {
        console.log("no password match");
        return null;
    }

    return foundUser;
}

module.exports = {
    getCities,
    getCitiesByCountry,
    getCitiesByName,
    createCity,
    login,
};
