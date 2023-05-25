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
    getDoc,
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
    // Obtener la referencia a la colección
    const collectionRef = collection(db, collectionName);
    // Objeto para guardar los datos de la colección
    const object = {};

    // Retornar una promesa
    return new Promise((resolve, reject) => {
        // Obtener los documentos de la colección
        getDocs(collectionRef)
            .then((querySnapshot) => {
                // Recorrer los documentos
                querySnapshot.forEach((doc) => {
                    // Guardar el id como clave y los datos como valor
                    object[doc.id] = doc.data();
                });
                // Retornar el objeto con los datos
                resolve(object); 
            })
            .catch((error) => {
                // Manejar el error si ocurre
                reject(error);
            });
    });
}

// Función para obtener los datos de un documento de la colección de Firebase
export async function getDocument(collectionName, docId) {
    // Obtener la referencia al documento
    const docRef = doc(db, collectionName, docId);

    try {
        // Obtener los datos del documento
        const docSnap = await getDoc(docRef);
        // Verificar si el documento existe
        if (docSnap.exists()) {
            // Retornar los datos del documento
            return docSnap.data();
        } else {
            // Retornar un error
            throw new Error("El documento no existe");
        }
    } catch (error) {
        throw error; // Retornar el error
    }
}

// Función para agregar un documento a la colección
export function addDocument(collectionName, data) {
    // Retornar una promesa
    return new Promise((resolve, reject) => {
        // Obtener la referencia a la colección
        const collectionRef = collection(db, collectionName);

        // Agregar el documento a la colección
        addDoc(collectionRef, data)
            .then(() => {
                // Resolver la promesa
                alert("Orden completada");
                resolve();
            })
            .catch((error) => {
                // Manejar el error si ocurre
                console.error(error);
                reject(error);
            });
    });
}

// Función para actualizar un documento
export function updateDocument(collectionName, docId, data) {
    // Retornar una promesa
    return new Promise((resolve, reject) => {
        // Obtener la referencia al documento
        const docRef = doc(db, collectionName, docId);

        // Actualizar el documento
        updateDoc(docRef, data)
            .then(() => {
                // Resolver la promesa
                resolve();
            })
            .catch((error) => {
                // Manejar el error si ocurre
                reject(error);
            });
    });
}

// Fución para eliminar un documento
export function deleteDocument(collectionName, docId) {
    // Retornar una promesa
    return new Promise((resolve, reject) => {
        // Obtener la referencia al documento
        const docRef = doc(db, collectionName, docId);

        // Eliminar el documento
        deleteDoc(docRef)
            .then(() => {
                // Resolver la promesa
                resolve();
            })
            .catch((error) => {
                // Manejar el error si ocurre
                reject(error);
            });
    });
}

/* Funciones para Firebase Storage */

// Función para subir una imagen a Firebase Storage
export async function uploadImage(file) {
    try {
        // Obtener la referencia al archivo en el bucket de Firebase Storage
        const storage = getStorage();
        // Crear una referencia con el nombre del archivo
        const storageRef = ref(storage, file.name);

        // Subir la imagen al almacenamiento
        const snapshot = await uploadBytes(storageRef, file);

        // Obtener la URL de descarga
        const downloadURL = await getDownloadURL(snapshot.ref);

        // Construir la URL de la imagen
        const url = new URL(downloadURL);
        // Obtener el token de la imagen
        const token = url.searchParams.get("token");

        // Construir la URL completa de la imagen
        const completeUrl = `https://firebasestorage.googleapis.com${url.pathname}?alt=media&token=${token}`;

        // Obtener la ubicación del archivo en el bucket
        const storageLocation = snapshot.ref.fullPath;

        // Retornar la URL completa y la ubicación del archivo
        return {
            completeUrl,
            storageLocation,
        };
    } catch (error) {
        throw error;
    }
}

// Función para actualizar una imagen
export async function updateImage(file, FileRef) {
    try {
        // Obtener la referencia al archivo en el bucket de Firebase Storage
        const storage = getStorage();
        // Crear una referencia con el nombre del archivo
        const storageRef = ref(storage, FileRef);

        // Subir la imagen al almacenamiento
        const snapshot = await uploadBytes(storageRef, file);

        // Obtener la URL de descarga
        const downloadURL = await getDownloadURL(snapshot.ref);

        // Construir la URL de la imagen
        const url = new URL(downloadURL);
        // Obtener el token de la imagen
        const token = url.searchParams.get("token");

        // Construir la URL completa de la imagen
        const completeUrl = `https://firebasestorage.googleapis.com${url.pathname}?alt=media&token=${token}`;

        // Obtener la ubicación del archivo en el bucket
        const storageLocation = snapshot.ref.fullPath;

        // Retornar la URL completa y la ubicación del archivo
        return {
            completeUrl,
            storageLocation,
        };
    } catch (error) {
        throw error;
    }
}

// Función para eliminar un archivo de Storage
export function deleteFile(FileRef) {
    return new Promise((resolve, reject) => {
        // Obtener la referencia al archivo
        const storage = getStorage();
        // Crear una referencia con el nombre del archivo
        const storageRef = ref(storage, FileRef);

        // Eliminar el archivo
        deleteObject(storageRef)
            .then(() => {
                // Resolver la promesa
                resolve();
            })
            .catch((error) => {
                // Manejar el error si ocurre
                reject(error);
            });
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
    return new Promise((resolve, reject) => {
        // Crear la cuenta de usuario
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Obtener el usuario
                const user = userCredential.user;

                // Agregar el usuario a la colección de usuarios
                const usuariosCollection = collection(db, "usuarios");
                // Agregar el documento
                addDoc(usuariosCollection, {
                    correo: user.email,
                    nombres: nombres,
                    apellidos: apellidos,
                    noControl: nocontrol,
                    rfid: rfid,
                })
                    .then(() => {
                        // Resolver la promesa
                        resolve();
                    })
                    .catch((error) => {
                        // Manejar el error si ocurre
                        reject(error);
                    });
            });
    });
}

// Iniciar sesión
export function login(emailValue, passValue, toast_error) {
    signInWithEmailAndPassword(auth, emailValue, passValue)
        .then(() => {
            // Si es correcto redireccionar al menú
            window.location.href = "menu.html";
        })
        .catch(() => {
            // Si es incorrecto mostrar un mensaje de error
            var toast = new bootstrap.Toast(toast_error);
            toast.show();
        });
}

// Comprobar autenticación
export function authState() {
    // Retornar una promesa
    return new Promise((resolve, reject) => {
        // Escuchar cambios en la autenticación
        const unsubscribe = onAuthStateChanged(
            auth,
            (user) => {
                // Detener la escucha
                unsubscribe();
                // Resolver la promesa
                resolve(user ? true : false);
            },
            reject
        );
    });
}

// Cerrar sesión
export function logout(id, location) {
    // Obtener el botón de cerrar sesión
    const logout_btn = document.getElementById(id);
    // Agregar el evento click
    logout_btn.addEventListener("click", () => {
        // Cerrar sesión
        signOut(auth)
            .then(() => {
                // Redireccionar a la página de inicio
                window.location.href = location;
            })
            .catch((error) => {
                // Mostrar el error si ocurre
                alert(error.message);
            });
    });
}

// Recuperar contraseña
export function recoverPass(modal_email, modal_recoverPass, msg) {
    sendPasswordResetEmail(auth, modal_email)
        .then(() => {
            // Mostrar mensaje de éxito
            alert(msg);
            modal_recoverPass.hide();
        })
        .catch((error) => {
            // Mostrar el error si ocurre
            alert(error.message);
        });
}

/* Botón de regresar página */
export function returnPage(id, location) {
    // Obtener el botón de regresar
    const btn_return = document.getElementById(id);
    // Agregar el evento click
    btn_return.addEventListener("click", () => {
        // Redireccionar a la página indicada
        window.location.href = location;
    });
}
