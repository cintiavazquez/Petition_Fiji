const {
    getCities,
    getCitiesByCountry,
    getCitiesByName,
    createCity,
    //login,
} = require("./db");

/* createCity({ name: "Tralalacity", population: 1, country: "Tralalaland" }).then(
    (newCity) => {
        console.log("new city:", newCity);
        getCities().then((cities) => {
            console.log(cities);
        });
    }
);

createCity({ name: "Madrid", population: 2000000, country: "Spain" }).then(
    (newCity) => console.log
); */

// AUTH

//successful case
/* const loggedUser = login({
    email: "user_2@example.com",
    password: "password_2",
}); */

// unsuccessful case #1 - email not found in db - will return null
/* const loggedUserNoMail = login({
    email: "user_99@example.com",
    password: "...",
}); */

// // unsuccessful case #2 - wrong password -will return null
/* const loggedUserNoPass = login({
    email: "user_2@example.com",
    password: "password_99",
}); */

//console.log("logged", loggedUser, loggedUserNoMail, loggedUserNoPass);

//NEW DB SETUP: now instead of one table, we have 2 in the setup.sql!
//here we test creating an user
//if we try to create the same user twice, we get "newUser error: duplicate key value violates unique constraint "users_email_key""
const { createUser, getUserByEmail, login } = require("../db.js");

/* createUser({
    first_name: "yo",
    last_name: "yo",
    email: "yo@yo.com",
    password: "yo",
})
    .then((newUser) => {
        console.log("newUser", newUser);
    })
    .catch((error) => {
        console.log("error creating user", error);
    });
 */
/* getUserByEmail("yo@yo.com").then((foundUser) => {
    console.log("foundUser", foundUser);
}); */

login({
    email: "yo@yo.com",
    password: "yo",
}).then((foundUser) => {
    console.log("foundUser", foundUser);
});
