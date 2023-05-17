import { logout } from "../firebase-app.js";

logout("logout_btn", "index.html");

// Rutas de navegación
const newOrder = document.getElementById("newOrder"); // Realizar una nueva orden
const orders = document.getElementById("orders"); // Lista de órdenes

// Navegación entre páginas
const nav_2 = document.getElementById("nav_2");
nav_2.addEventListener("click", () => {
    window.location.href = "inventory.html"; // Nav a inventario
});

newOrder.addEventListener("click", () => {
    window.location.href = "new_order.html"; // Nueva order
});

orders.addEventListener("click", () => {
    window.location.href = "orders.html"; // Lista de órdenes
});