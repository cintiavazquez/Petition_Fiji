const {
    getCities,
    getCitiesByCountry,
    getCitiesByName,
    createCity,
} = require("./db");

createCity({ name: "Tralalacity", population: 1, country: "Tralalaland" }).then(
    (newCity) => {
        console.log("new city:", newCity);
        getCities().then((cities) => {
            console.log(cities);
        });
    }
);

createCity({ name: "Madrid", population: 2000000, country: "Spain" }).then(
    (newCity) => console.log
);
