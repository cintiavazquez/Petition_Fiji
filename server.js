// express + handlebars setup
const express = require("express");
const app = express();
const path = require("path");
const { engine } = require("express-handlebars");
app.engine("handlebars", engine());
app.set("view engine", "handlebars");

const helmet = require("helmet");

const cookieSession = require("cookie-session");
// const { userInfo } = require("os");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require("./secrets");
}

const signatureRoute = require("./routes/signatures");
const userRoute = require("./routes/user");

app.use(helmet());

app.use(express.static(path.join(__dirname, "public")));

app.use(
    express.urlencoded({
        extended: true,
    })
);

app.use(
    cookieSession({
        //secret: process.env.SESSION_SECRET,
        secret: secrets.SESSION_SECRET,
        maxAge: 1000 * 60 * 60 * 24 * 14,
        //the cookie will survive two weeks of inactivity.
    })
);

app.use(signatureRoute, userRoute);

const port = process.env.PORT || 8080;
if (require.main == module) {
    app.listen(port, () =>
        console.log(`Listening on http://localhost:${port} 🎈`)
    );
}

module.exports = app;
