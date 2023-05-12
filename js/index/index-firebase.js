import { login, recoverPass, autenticacion } from "../firebase-app.js";

const login_btn = document.getElementById("login_btn"); /* Obtener el boton */
login_btn.addEventListener("click", () => {
    // Obtener los valores de los input
    const emailValue = document.getElementById("login_email").value;
    const passValue = document.getElementById("login_pass").value;
    const toast_error = document.getElementById("toast_error"); /* Obtener el toast */

    // Validar que los campos no esten vacios
    if (emailValue === "" || passValue === "") {
        alert("Los campos no pueden estar vacios");
    } else {
        login(emailValue, passValue, toast_error);
    }
});

// Recuperar contraseña
const forgotten_pass = document.getElementById("forgotten_pass"); /* Obtener el enlace de olvidaste tu contraseña */
const modal_recoverPass = document.getElementById("modal_recover_pass"); /* Obtener el modal */
const modal_btn = document.getElementById("modal_btn"); /* Obtener el boton del modal */

forgotten_pass.addEventListener("click", () => {
    modal_recoverPass.show();
});

modal_btn.addEventListener("click", () => {
    const modal_email = document.getElementById("modal_email").value; /* Obtener el valor del input */

    if (modal_email === "") {
        alert("El campo no puede estar vacio");
    } else {
        recoverPass(modal_email, modal_recoverPass, "Se ha enviado un correo de recuperación");
    }
});

autenticacion();