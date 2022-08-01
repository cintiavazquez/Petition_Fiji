//Cookies

//We want to distinsh between people who have already signed and people who haven't
//in pckge json we have cookie parser and session, we are going to use session
// we use it in index.js

//require cookie-session (const cookieSession);
//app use cookie session with secret ("A secret value" - should come from secrets json)and maxAge (how long it should last)
//The secret is used to generate the second cookie used to verify the integrity of the first cookie.
//in the app.get("/"), require session
// if require.session.city_id, redirect to the cities(signatures) page
//to check if it works, delete the cookies
//by visinting the homepage, the session is an empty obj
//the cookie session is stored in the browser
//
//then db
//fn getcitybyid()
//select * cities WHERE id = $1, [id]
//in the get thank you, do getcitiyby id (reque session citiry id).then((city)=> res.render, thy {city})
