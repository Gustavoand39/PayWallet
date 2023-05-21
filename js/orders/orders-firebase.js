import { returnPage, logout, authState } from "../firebase-app.js";

async function initializeApp() {
    if (!(await authState())) {
        window.location.href = "index.html";
    } // Esperar a que se complete la autenticación

    // Volver atrás
    returnPage("btn_return", "menu.html");

    // Cerrar sesion
    logout("logout_btn", "index.html");
}

initializeApp().catch((error) => {
    // Manejar errores
    console.error("Error al inicializar la aplicación:", error);
});