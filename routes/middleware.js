function checkLogin(request, response, next) {
    if (!request.session.user_id) {
        response.redirect("/login");
        return;
    }
    next();
}

function checkSignature(request, response, next) {
    if (!request.session.signatureId) {
        response.redirect("/petition");
        return;
    }
    next();
}

module.exports = { checkLogin, checkSignature };
