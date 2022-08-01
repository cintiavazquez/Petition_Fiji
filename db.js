const spicedPg = require("spiced-pg");

//spiced-pg is a simple wrapper around the node-postgres package (aka pg) that was created for use in this course. Using it ensures that you do not create too many database connections and that the process of deploying your project will be fairly straightforward. When you do this, spiced-pg will create a pool of 10 connections to the specified database. These connections will close after 30 seconds of inactivity but will be reopened when activity resumes. If you call the function again with the same string, no new connections will be created.
const { DATABASE_USER, DATABASE_PASSWORD } = require("./secrets.json");
const DATABASE_NAME = "petition";
const db = spicedPg(
    `postgres:${DATABASE_USER}:${DATABASE_PASSWORD}@localhost:5432/${DATABASE_NAME}`
);

function getSignatures() {
    return db
        .query("SELECT * FROM signatures")
        .then((result) => {
            //console.log(result.rows);
            return result.rows;
        })
        .catch((error) => error);
}
function createSignature({ first_name, last_name, signature }) {
    return db
        .query(
            `INSERT INTO signatures (first_name, last_name, signature)
    VALUES ($1, $2, $3)
    RETURNING *`,
            [first_name, last_name, signature]
        )
        .then((result) => result.rows[0])
        .catch((error) => error);
}

module.exports = {
    getSignatures,
    createSignature,
};
