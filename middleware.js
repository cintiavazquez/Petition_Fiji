function checkLogin(request, response, next) {
    if (!request.session.user_id) {
        response.redirect("/login");
        return;
    }
    next();
}

module.exports = { checkLogin };
