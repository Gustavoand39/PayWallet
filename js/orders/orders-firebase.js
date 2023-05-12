import { returnPage, logout } from "../firebase-app.js";

// Volver atrás
returnPage("btn_return", "menu.html");

// Cerrar sesion
logout("logout_btn", "index.html");