//Express Router is like a mini-version of an express app, but it only handles routes. It allows you to use all the routing APIs to configure your routes
/* const express = require("express");
const router = express.Router();
const cookieSession = require("cookie-session");

const { checkLogin, checkSignature } = require("../middleware");
const {
    getSignatures,
    createSignature,
    //getSignaturesByID,
    getSignatureByUserID,
    createUser,
    login,
    getUserById,
    getUserList,
    createUserProfile,
    getUserInfo,
    updateUser,
    updateUserNoPass,
    upsertUserProfile,
    deleteSignature,
} = require("../db");

router.get("/profile", checkLogin, (request, response) => {
    getUserInfo((user_id = request.session.user_id))
        .then((userInfo) => {
            console.log(request.session.user_id);
            console.log("USERINFO", userInfo);
            response.render("profile", userInfo);
        })
        .catch((error) => console.log("error retrieving user info", error));
});

module.exports = router; */
