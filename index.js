var header = document.querySelector("header");

window.addEventListener("scroll", () => {
    window.scrollY > 100 ? header.classList.add("backdrop") : header.classList.remove("backdrop");
});