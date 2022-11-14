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

try {
    const editFade = document.querySelector("p.editFade");
    const editLoad = document.querySelector("div.editLoad");

    let width = editLoad.offsetWidth;

    setTimeout(() => {
        editFade.style.opacity = 0;
    }, 2000);

    setInterval(() => {
        if (width === 0) {
            return;
        }
        decreaseWidth();
    }, 8);

    function decreaseWidth() {
        width--;
        editLoad.style.width = width + "px";
    }
} catch (error) {
    console.log(error);
}
