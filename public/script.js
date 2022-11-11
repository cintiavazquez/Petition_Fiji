try {
    const buttonLink = document.querySelector("[data-js='button-link']");
    buttonLink.addEventListener("click", () => {
        window.location = "/petition";
    });
} catch (error) {
    console.log(error);
}

try {
    const buttonMenu = document.querySelector("[data-js='button-menu']");
    const hamburgerMenu = document.querySelector("[data-js='hamburger-menu']");
    buttonMenu.addEventListener("mouseover", () => {
        hamburgerMenu.classList.add("active");
    });
    buttonMenu.addEventListener("click", (event) => {
        event.stopPropagation();
        hamburgerMenu.classList.toggle("active");
    });
} catch (error) {
    console.log(error);
}

document.body.addEventListener("click", () => {
    try {
        const hamburgerMenu = document.querySelector(
            "[data-js='hamburger-menu']"
        );
        hamburgerMenu.classList.remove("active");
    } catch (error) {
        console.log(error);
    }
});
