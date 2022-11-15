const express = require("express");
const router = express.Router();
const {
    getSignatures,
    createSignature,
    getSignatureByUserID,
    getUserById,
    deleteSignature,
    getSignaturesByCity,
} = require("../db");
const { checkLogin, checkSignature } = require("./middleware");

router.post("/petition", checkLogin, (request, response) => {
    let user_id = request.session.user_id;

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

router.get("/thank-you", checkLogin, checkSignature, (request, response) => {
    getUserById(request.session.user_id)
        .then((foundUser) =>
            getSignatureByUserID(request.session.user_id)
                .then((result) => {
                    if (request.session.edited) {
                        request.session.edited = null;
                        response.render("thank-you", {
                            signature: result.signature,
                            foundUser,
                            edited: true,
                        });
                        return;
                    }
                    response.render("thank-you", {
                        signature: result.signature,
                        foundUser,
                    });
                })
                .catch((error) => {
                    console.log("Error getting signature by ID", error);
                    response.render("500");
                })
        )
        .catch((error) => console.log("error retrieving user", error));
});

router.post(
    "/signatures/delete",
    checkLogin,
    checkSignature,
    (request, response) => {
        let user_id = request.session.user_id;
        deleteSignature({ user_id })
            .then(() => {
                request.session.signatureId = null;
                response.redirect("/petition");
            })
            .catch((error) =>
                console.log(
                    "/signatures/delete error deleting the signature",
                    error
                )
            );
    }
);

router.get("/signatures", checkLogin, (request, response) => {
    getSignatures()
        .then((signees) => {
            response.render("signatures", {
                signees: signees,
            });
        })
        .catch((error) => {
            console.log("/signatures: error displaying signatures", error);
            response.status(404);
        });
});

router.get("/petition/:city", checkLogin, (request, response) => {
    let city = request.params.city;

    getSignaturesByCity(city)
        .then((signees) => {
            response.render("cities", {
                signees: signees,
                city,
            });
        })
        .catch((error) => {
            console.log("/petition/:city: error displaying signers", error);
            response.status(404);
        });
});

module.exports = router;
