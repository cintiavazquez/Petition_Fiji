// express + handlebars setup
const express = require("express");
const app = express();
const path = require("path");
app.use(express.static(path.join(__dirname, "public")));
const { engine } = require("express-handlebars");
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.use(
    express.urlencoded({
        extended: true,
    })
);

const { createSignature, getSignatures, getSignaturesByID } = require("./db");

//const { sign } = require("crypto");

app.use(express.static("images"));
// Cookie session 🍪
const cookieSession = require("cookie-session");
const { SESSION_SECRET } = require("./secrets.json");
//we can use whatever string we want as session secret
//The secret is used to generate the second cookie used to verify the integrity of the first cookie.
app.use(
    cookieSession({
        secret: SESSION_SECRET,
        maxAge: 1000 * 60 * 60 * 24 * 14,
        //this determines how long to store the cookie for
        // In the example above, the cookie will survive two weeks of inactivity.
    })
);

app.get("/", (request, response) => {
    console.log("request body", request.body);
    //🍪
    console.log("request session", request.session);
    //the first time we visit the page, the cookie session will be an empty obj

    if (request.session.signatureId) {
        response.redirect(
            "/thank-you" /* , { id: require.session.signatureId } */
        );
        return;
    }

    response.redirect("/registration");
});

app.get("/registration", (request, response) => {
    console.log(request.body);
    response.render("homepage");
});

app.post("/registration", (request, response) => {
    console.log("POST /", request.body);

    // then redirect to the /thank-you page
    // catch any error, and redirect to the form page in that case
    const { first_name, last_name, signature } = request.body;

    if (!first_name.length || !last_name.length || !signature.length) {
        console.log("Error: not all fields were filled");
        const error = "error";
        response.render("homepage", {
            error: error,
        });
        return;
    }

    createSignature({ first_name, last_name, signature })
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

app.get("/thank-you", (request, response) => {
    if (!request.session.signatureId) {
        response.redirect("/");
        return;
    }
    //🍪
    console.log("request.session.signatureId", request.session.signatureId);
    getSignaturesByID(request.session.signatureId)
        .then((user) => {
            console.log("user", user);
            response.render("thank-you", { user });
        })
        .catch((error) => console.log("Error getting signature by ID", error));
});
app.get("/signatures", (request, response) => {
    if (!request.session.signatureId) {
        response.redirect("/");
        return;
    }
    getSignatures()
        .then((signees) => {
            console.log(signees);
            response.render("signatures", {
                signees: signees,
            });
        })
        .catch((error) => {
            console.log("error displaying signatures", error);
            response.status(404);
        });
});

app.listen(8081, () => console.log("listening on http://localhost:8081 🎈!"));
