// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import {
    getAuth,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut,
    onAuthStateChanged,
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

/* Funciones de Firebase */

// Iniciar sesión
export function login(emailValue, passValue, toast_error) {
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

// Cerrar sesión
export function logout(id, location) {
    const logout_btn = document.getElementById(id);
    logout_btn.addEventListener("click", () => {
        signOut(auth)
            .then(() => {
                window.location.href = location;
            })
            .catch((error) => {
                alert(error.message);
            });
    });
}

// Recuperar contraseña
export function recoverPass(modal_email, modal_recoverPass, msg) {
    sendPasswordResetEmail(auth, modal_email)
    .then(() => {
        alert(msg);
        modal_recoverPass.hide();
    })
    .catch((error) => {
        alert(error.message);
    });
}

// Botón de regresar página
export function returnPage(id, location) {
    const btn_return = document.getElementById(id);
    btn_return.addEventListener("click", () => {
        window.location.href = location;
    });
}

// Para probar si el usuario está logeado o no (Eliminar en producción)
export function autenticacion() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // El usuario está autenticado
            console.log("Usuario autenticado:", user.email);
        } else {
            // El usuario no está autenticado
            console.log("Usuario no autenticado");
        }
    });
}