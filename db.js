const spicedPg = require("spiced-pg");

//spiced-pg is a simple wrapper around the node-postgres package (aka pg) that was created for use in this course. Using it ensures that you do not create too many database connections and that the process of deploying your project will be fairly straightforward. When you do this, spiced-pg will create a pool of 10 connections to the specified database. These connections will close after 30 seconds of inactivity but will be reopened when activity resumes. If you call the function again with the same string, no new connections will be created.
//👵🏻 old
/* const { DATABASE_USER, DATABASE_PASSWORD } = require("./secrets.json");
const DATABASE_NAME = "petition";
const db = spicedPg(
    `postgres:${DATABASE_USER}:${DATABASE_PASSWORD}@localhost:5432/${DATABASE_NAME}`
); */

let db;
if (!process.env.DATABASE_URL) {
    // we are running locally!
    const { DATABASE_USER, DATABASE_PASSWORD } = require("./secrets.json");
    const DATABASE_NAME = "petition";
    db = spicedPg(
        `postgres:${DATABASE_USER}:${DATABASE_PASSWORD}@localhost:5432/${DATABASE_NAME}`
    );
} else {
    // we are running on Heroku
    db = spicedPg(process.env.DATABASE_URL);
}

//AUTH 🔑
const bcrypt = require("bcryptjs");
// this function generates first a 'salt'
// i.e. a string prepended to the actual hash that makes potential guessing more complicated
// for attackers,
// then hashes the passed password with the generate salt
const hash = (password) =>
    bcrypt.genSalt().then((salt) => bcrypt.hash(password, salt));

// we have to pass 'password' and not 'password_hash' - why? Because we need the passw the users types, and then we hash it and store the result in the db
function createUser({ first_name, last_name, email, password }) {
    return hash(password).then((password_hash) => {
        return db
            .query(
                "INSERT INTO users (first_name, last_name, email, password_hash)  VALUES ($1, $2, $3, $4) RETURNING *",
                [first_name, last_name, email, password_hash]
            )
            .then((result) => result.rows[0]);
    });
}

function createUserProfile({ user_id, age, city, homepage }) {
    if (age === "") {
        age = 0;
    }
    if (city === "" || !homepage === "") {
        city = null;
        homepage = null;
    }
    return db
        .query(
            "INSERT INTO user_profiles (user_id, age, city, homepage)  VALUES ($1, $2, $3, $4) RETURNING *",
            [user_id, age, city, homepage]
        )
        .then((result) => result.rows[0]);
}

function login({ email, password }) {
    return getUserByEmail(email).then((foundUser) => {
        if (!foundUser) {
            return null;
        }

        return bcrypt
            .compare(password, foundUser.password_hash)
            .then((match) => {
                if (match) {
                    return foundUser;
                }
                return null;
            });
    });
}
function getUserByEmail(email) {
    return db
        .query(
            `SELECT * 
        FROM users 
        FULL OUTER JOIN signatures
        ON users.id=signatures.user_id 
        WHERE email=$1`,
            [email]
        )
        .then((result) => result.rows[0]);
}
function getUserById(id) {
    return db
        .query("SELECT * FROM users WHERE id=$1", [id])
        .then((result) => result.rows[0]);
}

function getSignatureByUserID(user_id) {
    return db
        .query("SELECT * FROM signatures WHERE user_id=$1", [user_id])
        .then((result) => {
            if (!result.rows.length) {
                throw new Error("no signature found");
            }
            return result.rows[0];
        });
}

//For the signatures page: we want only users who have signed, and we want both users with the minimal info and with the extra info
function getSignatures() {
    return db
        .query(
            `
        SELECT * FROM users
        JOIN signatures ON signatures.user_id = users.id
        FULL JOIN user_profiles ON user_profiles.user_id = users.id
        WHERE signatures.signature IS NOT NULL
    `
        )
        .then((result) => result.rows);
}

function createSignature({ user_id, signature }) {
    return db
        .query(
            `INSERT INTO signatures (user_id, signature)
    VALUES ($1, $2)
    RETURNING *`,
            [user_id, signature]
        )
        .then((result) => result.rows[0]);
}

//populating the edit profile form
function getUserInfo({ user_id }) {
    return db
        .query(
            `SELECT users.first_name, users.last_name, users.email, user_profiles.*
            FROM users
            FULL JOIN user_profiles
            ON user_profiles.user_id = users.id
            WHERE user_id=$1`,
            [user_id]
        )
        .then((userInfo) => {
            if (!userInfo.rows.length) {
                throw new Error("No info found for this user");
            }
            return userInfo.rows[0];
        });
}

//"upsert" - we want to insert a row if one does not already exist and update it if it does. Postgres has syntax that accomplishes this

function updateUser({ first_name, last_name, email, password, user_id }) {
    return db
        .query(
            `
        UPDATE users SET first_name=$1, last_name=$2, email=$3, password_hash=$4
        WHERE id=$5
        RETURNING *`,
            [first_name, last_name, email, password, user_id]
        )
        .then((userInfo) => userInfo.rows[0]);
}
function updateUserNoPass({ first_name, last_name, email, user_id }) {
    return db
        .query(
            `
        UPDATE users SET first_name=$1, last_name=$2, email=$3
        WHERE id=$4
        RETURNING *`,
            [first_name, last_name, email, user_id]
        )
        .then((userInfo) => userInfo.rows[0]);
}
function upsertUserProfile({ user_id, age, city, homepage }) {
    return db
        .query(
            `
        INSERT INTO user_profiles (user_id, age, city, homepage)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (user_id)
        DO UPDATE SET age = $2, city = $3, homepage = $4`,
            [user_id, age ? age : null, city, homepage]
        )
        .then((userInfo) => userInfo.rows[0]);
}

function deleteSignature({ user_id }) {
    return db
        .query(`DELETE FROM signatures WHERE user_id=$1`, [user_id])
        .then((userInfo) => userInfo.rows[0]);
}

function getSignaturesByCity(city) {
    return db
        .query(
            `
    SELECT * FROM users
    JOIN signatures ON signatures.user_id = users.id
    FULL JOIN user_profiles ON user_profiles.user_id = users.id
    WHERE signatures.signature IS NOT NULL
    AND user_profiles.city ILIKE $1`,
            [city]
        )
        .then((result) => result.rows);
}

module.exports = {
    getSignatures,
    createSignature,
    //getSignaturesByID,
    getSignatureByUserID,
    createUser,
    getUserByEmail,
    login,
    getUserById,
    //getUserList,
    createUserProfile,
    getUserInfo,
    updateUser,
    updateUserNoPass,
    upsertUserProfile,
    deleteSignature,
    getSignaturesByCity,
};
