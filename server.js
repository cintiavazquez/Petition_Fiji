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

const { createSignature, getSignatures } = require("./db");
const { sign } = require("crypto");

app.use(express.static("images"));

app.get("/", (request, response) => {
    console.log(request.body);
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
            response.redirect("/thank-you");
        })
        .catch((error) => {
            console.log("error creating signature", error);
            response.redirect("/");
        });
});

app.get("/thank-you", (request, response) => {
    response.render("thank-you");
});
app.get("/signatures", (request, response) => {
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

app.listen(8080, () => console.log("listening on http://localhost:8080 🎈!"));
