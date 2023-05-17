import { logout } from "../firebase-app.js";

const nav_1 = document.getElementById("nav_1");
nav_1.addEventListener("click", () => {
    window.location.href = "menu.html";
});

logout("logout_btn", "index.html");