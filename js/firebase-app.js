// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    sendPasswordResetEmail,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import {
    getFirestore,
    collection,
    doc,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import {
    getStorage,
    ref,
    deleteObject,
    uploadBytes,
    getDownloadURL,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-storage.js";

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

/* Funciones para manejar las colecciones de Firebase */

// Función para obtener los datos de la colección de Firebase
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

// Función para actualizar un documento
export function updateDocument(collectionName, docId, data) {
    const docRef = doc(db, collectionName, docId);

    updateDoc(docRef, data)
        .then(() => {
            console.log("Documento actualizado exitosamente");
        })
        .catch((error) => {
            console.error(error);
        });
}

// Fución para eliminar un documento
export function deleteDocument(collectionName, docId) {
    const docRef = doc(db, collectionName, docId);

    deleteDoc(docRef)
        .then(() => {
            console.log("Documento eliminado exitosamente");
        })
        .catch((error) => {
            console.error(error);
        });
}

/* Funciones para Firebase Storage */

// Función para subir una imagen a Firebase Storage
export async function uploadImage(file) {
    try {
        // Obtener la referencia al archivo en el bucket de Firebase Storage
        const storage = getStorage();
        const storageRef = ref(storage, file.name);

        // Subir la imagen al almacenamiento
        const snapshot = await uploadBytes(storageRef, file);

        // Obtener la URL de descarga
        const downloadURL = await getDownloadURL(snapshot.ref);

        // Construir la URL completa de la imagen
        const url = new URL(downloadURL);
        const token = url.searchParams.get("token");

        const completeUrl = `https://firebasestorage.googleapis.com${url.pathname}?alt=media&token=${token}`;

        const storageLocation = snapshot.ref.fullPath;

        return {
            completeUrl,
            storageLocation,
        }
    } catch (error) {
        console.error("Error al subir la imagen:", error);
        throw error;
    }
}

// Función para actualizar una imagen
export async function updateImage(file, FileRef) {
    try {
        // Obtener la referencia al archivo en el bucket de Firebase Storage
        const storage = getStorage();
        const storageRef = ref(storage, FileRef);

        // Subir la imagen al almacenamiento
        const snapshot = await uploadBytes(storageRef, file);

        // Obtener la URL de descarga
        const downloadURL = await getDownloadURL(snapshot.ref);

        // Construir la URL completa de la imagen
        const url = new URL(downloadURL);
        const token = url.searchParams.get("token");

        const completeUrl = `https://firebasestorage.googleapis.com${url.pathname}?alt=media&token=${token}`;

        const storageLocation = snapshot.ref.fullPath;

        return {
            completeUrl,
            storageLocation,
        }
    } catch (error) {
        console.error("Error al subir la imagen:", error);
        throw error;
    }
}

// Función para eliminar un archivo de Storage
export function deleteFile(FileRef) {
    const storage = getStorage();
    const storageRef = ref(storage, FileRef);

    deleteObject(storageRef)
        .then(() => {
            console.log("Archivo eliminado exitosamente");
        })
        .catch((error) => {
            console.error(error);
        });
}

/* Funciones para manejar la sesión del usuario */

// Crear cuenta (No es usada por el momento)
export function createAccount(
    email,
    password,
    nombres,
    apellidos,
    nocontrol,
    rfid
) {
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Registro exitoso
            const user = userCredential.user;

            // Guardar el usuario en la colección "usuarios"
            const usuariosCollection = collection(db, "usuarios");
            addDoc(usuariosCollection, {
                correo: user.email,
                nombres: nombres,
                apellidos: apellidos,
                noControl: nocontrol,
                rfid: rfid,
            })
                .then(() => {
                    console.log("Usuario guardado en Firestore correctamente.");
                })
                .catch((error) => {
                    console.error(error);
                });
        })
        .catch((error) => {
            // Manejar errores
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error("Error en el registro:", errorCode, errorMessage);
        });
}

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

// Comprobar autenticación
export function authState() {
    return new Promise((resolve, reject) => {
        const unsubscribe = onAuthStateChanged(
            auth,
            (user) => {
                unsubscribe(); // Detener la escucha de cambios en la autenticación
                resolve(user ? true : false); // Retornar true si el usuario está autenticado, false si no
            },
            reject
        );
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
