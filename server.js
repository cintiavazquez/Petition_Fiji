// express + handlebars setup
const express = require("express");
const app = express();
const path = require("path");
app.use(express.static(path.join(__dirname, "public")));
const { engine } = require("express-handlebars");
app.engine("handlebars", engine());
app.set("view engine", "handlebars");

const {
    getSignatures,
    createSignature,
    //getSignaturesByID,
    getSignatureByUserID,
    createUser,
    getUserByEmail,
    login,
    getUserById,
    getUserList,
    createUserProfile,
    getUserInfo,
    updateUser,
    updateUserNoPass,
    upsertUserProfile,
    deleteSignature,
    getSignaturesByCity,
} = require("./db");

// Cookie session 🍪
const cookieSession = require("cookie-session");
const { userInfo } = require("os");

//let { SESSION_SECRET } = require("./secrets.json");
let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require("./secrets"); // secrets.json is in .gitignore
}

//we can use whatever string we want as session secret
//The secret is used to generate the second cookie used to verify the integrity of the first cookie.

//Ⓜ️ middleware, not implemented yet

/* function checkLogin(request, response, next) {
    if (!request.session.user_id) {
        console.log("not logged in!");
        response.redirect("/login");
        return;
    }
    console.log("logged in!");
    next();
} */

/* function checkSignature(request, response, next) {
    getSignatureByUserId(request.session.userID).then((signature) => {
        if (!signature) {
            console.log('no signature!');
            response.redirect('/');
            return;
        }
        next();
    });
} */

app.use(
    express.urlencoded({
        extended: true,
    })
);
//app.use(express.static("images"));

app.use(
    cookieSession({
        //secret: process.env.SESSION_SECRET,
        secret: secrets.SESSION_SECRET,
        maxAge: 1000 * 60 * 60 * 24 * 14,
        //this determines how long to store the cookie for
        // In the example above, the cookie will survive two weeks of inactivity.
    })
);

app.get("/", (request, response) => {
    response.redirect("/register");
});

app.get("/register", (request, response) => {
    if (request.session.user_id) {
        response.redirect("/petition");
        return;
    }
    response.render("register");
});

app.post("/register", (request, response) => {
    const { first_name, last_name, email, password } = request.body;

    if (
        !first_name.length ||
        !last_name.length ||
        !email.length ||
        !password.length
    ) {
        console.log("Error: not all fields were filled");
        const error = "error";
        response.render("register", {
            error: error,
        });
        return;
    }

    createUser({ first_name, last_name, email, password })
        .then((result) => {
            if (result.constraint === "users_email_key") {
                console.log("HERE !!!!!!!!!!!!!!!");
                response.status(400).render("/register");
                //, {duplicate: result.constraint,});
                return;
            }
            //🍪
            request.session.user_id = result.id;
            response.redirect("/profile");
        })
        .catch((error) => {
            console.log("error creating user: ", error);
            response.status(500);
        });
});

app.get("/profile", (request, response) => {
    if (!request.session.user_id) {
        response.redirect("/login");
        return;
    }
    response.render("profile");
});

app.post("/profile", (request, response) => {
    if (!request.session.user_id) {
        response.redirect("/login");
        return;
    }

    let user_id = request.session.user_id;
    let { age, city, homepage } = request.body;

    createUserProfile({ user_id, age, city, homepage })
        .then((result) => {
            console.log("created user profile: ", result);
            response.redirect("/petition");
        })
        .catch((error) => {
            console.log("error creating user: ", error);
            response.status(500).render("/profile", {
                error: error,
            });
        });
});

app.get("/profile/edit", (request, response) => {
    if (!request.session.user_id) {
        response.redirect("/login");
    }
    getUserInfo({ user_id: request.session.user_id })
        .then((userInfo) => {
            console.log("USERINFO", userInfo);
            response.render("profileEdit", userInfo);
        })
        .catch((error) => {
            console.log("/profile/edit: error retrieving user info", error);
            response.render("500");
        });
});

app.post("/profile/edit", (request, response) => {
    // when I edit I need to update the user table and the profile table
    if (!request.session.user_id) {
        response.redirect("/login");
    }
    let user_id = request.session.user_id;
    let { first_name, last_name, email, password, age, city, homepage } =
        request.body;

    age = parseInt(age);

    upsertUserProfile({ user_id, age, city, homepage })
        .then((result) => {
            console.log(result);
        })
        .catch((error) =>
            console.log("could not update user in upsertUserProfile", error)
        );

    if (password === "") {
        updateUserNoPass({
            first_name,
            last_name,
            email,
            user_id: request.session.user_id,
        })
            .then((result) => {
                console.log("update no password", result);
                response.redirect("/petition");
            })
            .catch((error) =>
                console.log("could not update user in updateUserNoPass ", error)
            );
        return;
    }
    updateUser({
        first_name,
        last_name,
        email,
        password,
        user_id: request.session.user_id,
    })
        .then(() => {
            response.redirect("/petition");
        })
        .catch((error) => console.log("could not update user", error));
});

app.post("/login", (request, response) => {
    const { email, password } = request.body;

    if (!email.length || !password.length) {
        const error = "error";
        response.render("login", {
            error: error,
        });
        return;
    }

    login({
        email,
        password,
    })
        .then((foundUser) => {
            request.session.user_id = foundUser.user_id;
            request.session.signatureId = !!foundUser.signature;
            response.redirect("/petition");
        })
        .catch((error) => {
            console.log("error logging in", error);
            response.render("login", {
                error: error,
            });
        });
});

app.get("/login", (request, response) => {
    //console.log("req body in register", request.body);
    if (request.session.user_id) {
        response.redirect("/petition");
        return;
    }
    response.render("login");
});

app.post("/petition", (request, response) => {
    let user_id = request.session.user_id;

    if (!request.session.user_id) {
        response.redirect("/login");
        return;
    }

    const { signature } = request.body;

    if (!signature.length) {
        console.log("Error: you did not sign!");
        const error = "error";
        response.render("petition", {
            error: error,
        });
        return;
    }

    createSignature({ user_id, signature })
        .then((result) => {
            console.log("created signature: ", result);
            //🍪
            request.session.signatureId = result.id;
            response.redirect("/thank-you");
        })
        .catch((error) => {
            console.log("error creating signature", error);
            response.redirect("/");
        });
});

app.get("/petition", (request, response) => {
    if (!request.session.user_id) {
        response.redirect("/login");
        return;
    }
    console.log("sig id in petition", request.session.signatureId);

    if (request.session.signatureId) {
        response.redirect("/thank-you");
        return;
    }
    getUserInfo({ user_id: request.session.user_id })
        .then(() => {
            response.render("petition");
        })
        .catch((error) => {
            createUserProfile({ user_id: request.session.user_id })
                .then(() => response.render("petition"))
                .catch(
                    (error) => ("/petition: error creating user profile", error)
                );
        });
});

app.get("/thank-you", (request, response) => {
    if (!request.session.user_id) {
        response.redirect("/login");
        return;
    }
    if (!request.session.signatureId) {
        response.redirect("/petition");
        return;
    }
    //🍪
    // console.log("request.session.signatureId", request.session.signatureId);

    getUserById(request.session.user_id)
        .then((foundUser) => foundUser)
        .then((foundUser) =>
            getSignatureByUserID(request.session.user_id)
                .then((result) => {
                    console.log(result, "RESULT");
                    response.render("thank-you", {
                        signature: result.signature,
                        foundUser,
                    });
                    console.log(foundUser);
                })
                .catch((error) => {
                    console.log("Error getting signature by ID", error);
                    response.render("500");
                })
        )
        .catch((error) => console.log("error retrieving user", error));

    /* getSignaturesByID(request.session.signatureId)
        .then((user) => {
            console.log("user", user);
            response.render("thank-you", { user });
        })
        .catch((error) => console.log("Error getting signature by ID", error)); */
});

app.post("/thank-you", (request, response) => {
    let user_id = request.session.user_id;
    deleteSignature({ user_id })
        .then(() => {
            request.session.signatureId = null;
            response.redirect("/petition");
        })
        .catch((error) => console.log("error deleting the signature!", error));
});

app.post("/logout", (request, response) => {
    request.session = null;
    response.redirect("/");
});

app.get("/signatures", (request, response) => {
    if (!request.session.user_id) {
        response.redirect("/login");
        return;
    }
    if (!request.session.signatureId) {
        response.redirect("/petition");
        return;
    }

    getSignatures()
        .then((signees) => {
            console.log("signees", signees);
            response.render("signatures", {
                signees: signees,
            });
        })
        .catch((error) => {
            console.log("error displaying signatures", error);
            response.status(404);
        });
});

app.get("/petition/:city", (request, response) => {
    let city = request.params.city;
    if (!request.session.user_id) {
        response.redirect("/login");
        return;
    }
    if (!request.session.signatureId) {
        response.redirect("/petition");
        return;
    }

    getSignaturesByCity(city)
        .then((signees) => {
            response.render("cities", {
                signees: signees,
                city,
            });
        })
        .catch((error) => {
            console.log("error displaying signers", error);
            response.status(404);
        });
});

//app.listen(8081, () => console.log("listening on http://localhost:8081 🎈!"));
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on http://localhost:${port} 🎈`));
