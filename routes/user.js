const express = require("express");
const router = express.Router();

const {
    createUser,
    login,
    createUserProfile,
    getUserInfo,
    updateUser,
    updateUserNoPass,
    upsertUserProfile,
    getSignatures,
} = require("../db");

const { checkLogin } = require("./middleware");

router.get("/", (request, response) => {
    response.redirect("/register");
});

router.get("/register", (request, response) => {
    if (request.session.user_id) {
        response.redirect("/petition");
        return;
    }
    response.render("register");
});

router.post("/register", (request, response) => {
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
            console.log("result of creating user", result);
            request.session.user_id = result.id;
            request.session.registry = true;
            response.redirect("/profile");
        })
        .catch((error) => {
            console.log("error creating user: ", error);
            if (error.constraint === "users_email_key") {
                response
                    .status(409)
                    .render("register", { duplicate: error.constraint });
            }
        });
});

router.get("/profile", checkLogin, (request, response) => {
    if (!request.session.registry) {
        response.redirect("/profile/edit");
    }
    request.session.registry = null;
    response.render("profile");
});

router.post("/profile", checkLogin, (request, response) => {
    let user_id = request.session.user_id;
    console.log("user_id in /profile", user_id);
    let { age, city, homepage } = request.body;

    if (
        !homepage.startsWith("https://") &&
        !homepage.startsWith("http://") &&
        homepage !== ""
    ) {
        console.log("/profile: url not valid");
        response.render("profile", {
            url_error: "Please provide a valid URL",
        });
        return;
    }

    createUserProfile({ user_id, age, city, homepage })
        .then(() => {
            response.redirect("/petition");
        })
        .catch((error) => {
            console.log("error creating user: ", error);
            response.status(500).render("profile", {
                error: error,
            });
        });
});

router.get("/profile/edit", checkLogin, (request, response) => {
    getUserInfo({ user_id: request.session.user_id })
        .then((userInfo) => {
            response.render("profileEdit", userInfo);
        })
        .catch((error) => {
            console.log("/profile/edit: error retrieving user info", error);
            response.render("500");
        });
});

router.post("/profile/edit", checkLogin, (request, response) => {
    let user_id = request.session.user_id;
    let { first_name, last_name, email, password, age, city, homepage } =
        request.body;

    age = parseInt(age);

    if (
        !homepage.startsWith("https://") &&
        !homepage.startsWith("http://") &&
        homepage !== ""
    ) {
        console.log("/profile/edit: url not valid");
        response.render("profileEdit", {
            url_error: "Please provide a valid URL",
        });
        return;
    }

    upsertUserProfile({ user_id, age, city, homepage })
        .then((result) => {
            console.log("result in upsert user profile:", result);
        })
        .catch((error) =>
            console.log(
                "/profile/edit: could not update user in upsertUserProfile",
                error
            )
        );

    if (password === "") {
        updateUserNoPass({
            first_name,
            last_name,
            email,
            user_id: request.session.user_id,
        })
            .then(() => {
                request.session.edited = true;
                response.redirect("/petition");
            })
            .catch((error) =>
                console.log(
                    "/profile/edit: could not update user in updateUserNoPass ",
                    error
                )
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

router.post("/login", (request, response) => {
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
            console.log("here,", foundUser);
            request.session.user_id = foundUser.id;
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

router.get("/login", (request, response) => {
    if (request.session.user_id) {
        response.redirect("/petition");
        return;
    }
    response.render("login");
});

router.get("/petition", checkLogin, (request, response) => {
    if (request.session.signatureId) {
        response.redirect("/thank-you");
        return;
    }
    getUserInfo({ user_id: request.session.user_id })
        .then(() => {
            getSignatures()
                .then((signatures) => {
                    if (request.session.edited) {
                        request.session.edited = null;
                        response.render("petition", {
                            signatures: signatures.length,
                            edited: true,
                        });
                        return;
                    }
                    response.render("petition", {
                        signatures: signatures.length,
                    });
                })
                .catch((error) => console.log(error));
        })
        .catch((error) => {
            console.log("/petition: error in getUserInfo", error);
        });
});

router.get("/user/logout", (request, response) => {
    request.session = null;
    response.redirect("/");
});

module.exports = router;
