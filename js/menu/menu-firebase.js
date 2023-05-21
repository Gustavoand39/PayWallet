import { logout, authState } from "../firebase-app.js";

async function initializeApp() {
    if (!(await authState())) {
        window.location.href = "index.html";
    } // Esperar a que se complete la autenticación

    /* Código para cargar el contenido de la página */

    // Rutas de navegación
    logout("logout_btn", "index.html"); // Cerrar sesión

    const newOrder = document.getElementById("newOrder"); // Realizar una nueva orden
    const orders = document.getElementById("orders"); // Lista de órdenes

    // Navegación entre páginas
    const nav_2 = document.getElementById("nav_2");
    nav_2.addEventListener("click", () => {
        window.location.href = "inventory.html"; // Navbar inventario
    });

    newOrder.addEventListener("click", () => {
        window.location.href = "new_order.html"; // Nueva order
    });

    orders.addEventListener("click", () => {
        window.location.href = "orders.html"; // Lista de órdenes
    });
}

initializeApp().catch((error) => {
    // Manejar errores
    console.error("Error al inicializar la aplicación:", error);
});
