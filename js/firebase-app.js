// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import {
    getAuth,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import {
    getFirestore,
    collection,
    getDocs,
    addDoc,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// ! Ocultar las variables de configuración de Firebase

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBLwOeyYbtfaa6N8Jp5vWkRff70IxdFX8M",
    authDomain: "paywallet-e4c84.firebaseapp.com",
    projectId: "paywallet-e4c84",
    storageBucket: "paywallet-e4c84.appspot.com",
    messagingSenderId: "869136245495",
    appId: "1:869136245495:web:88e3525e981a732441a9f2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/* Función para obtener los datos de la colección de Firebase */
export function getDb(collectionName) {
    const collectionRef = collection(db, collectionName); // Obtener la colección
    const object = {}; // Crear un objeto para guardar los documentos
    // Retornar una promesa
    return new Promise((resolve, reject) => {
        getDocs(collectionRef) // Obtener los documentos de la colección
            .then((querySnapshot) => {
                // Recorrer los documentos
                querySnapshot.forEach((doc) => {
                    // Guardar el id como clave y los datos como valor
                    object[doc.id] = doc.data();
                });
                resolve(object); // Retornar un objeto con la colección
            })
            .catch((error) => {
                reject(error); // Retornar el error
            });
    });
}

// Función para agregar un documento a la colección
export function addDocument(collectionName, data) {
    const collectionRef = collection(db, collectionName); // Obtener la colección

    addDoc(collectionRef, data) // Agregar el documento a la colección
        .then(() => {
            alert("Orden completada");
            // window.location.href = "menu.html"; // Redirigir a la página del menú
        })
        .catch((error) => {
            console.error(error); // Manejar el error si ocurre
        });
}

/* Funciones para manejar la sesión del usuario */

// Iniciar sesión
export function login(emailValue, passValue, toast_error) {
    signInWithEmailAndPassword(auth, emailValue, passValue)
        .then(() => {
            /* Si es correcto */
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

/* Botón de regresar página */
export function returnPage(id, location) {
    const btn_return = document.getElementById(id);
    btn_return.addEventListener("click", () => {
        window.location.href = location;
    });
}
