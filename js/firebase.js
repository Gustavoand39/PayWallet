/* Errores a corregir/mejorar:
        1. No se puede usar el show porque no está inicializado el modal (recuperar contraseña)
        2. Pasa lo mismo al usar el hide (recuperar contraseña)
        3. Cambiar los alert por un toast o hacerlo con javascript (login y recuperar contraseña)
*/

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import {
    getAuth,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut,
} from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA4noi5SgVaVoWKKMo7Thw-lny4mtNMwT0",
    authDomain: "paywallet-7ed8a.firebaseapp.com",
    projectId: "paywallet-7ed8a",
    storageBucket: "paywallet-7ed8a.appspot.com",
    messagingSenderId: "135314549497",
    appId: "1:135314549497:web:50156cb26cfa3b364c5028",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();

/* Index */
const login_btn = document.getElementById("login_btn"); /* Obtener el boton */
const toast_error = document.getElementById("toast_error"); /* Obtener el toast */

login_btn.addEventListener("click", () => {
    // Obtener los valores de los input
    const emailValue = document.getElementById("login_email").value;
    const passValue = document.getElementById("login_pass").value;

    // Validar que los campos no esten vacios
    if (emailValue === "" || passValue === "") {
        alert("Los campos no pueden estar vacios");
    } else {
        // Iniciar sesion
        signInWithEmailAndPassword(auth, emailValue, passValue)
            .then(() => {
                /* Si es correcto */
                console.log(emailValue, passValue);
                window.location.href = "menu.html";
            })
            .catch(() => {
                /* Si es incorrecto */
                var toast = new bootstrap.Toast(toast_error);
                toast.show();
            });
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
        // Enviar correo de recuperacion
        sendPasswordResetEmail(auth, modal_email)
            .then(() => {
                alert("Correo enviado");
                modal_recoverPass.hide();
            })
            .catch((error) => {
                alert(error.message);
            });
    }
});