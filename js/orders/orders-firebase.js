// Funciones de Firebase-App.js
import {
    returnPage,
    logout,
    authState,
    getDb,
    getDocument,
    updateDocument,
} from "../firebase-app.js";
// Templates
import { orderTemplate, orderDetailTemplate } from "./templates.js";

async function initializeApp() {
    if (!(await authState())) {
        window.location.href = "index.html";
    } // Esperar a que se complete la autenticación

    // Volver atrás
    returnPage("btn_return", "menu.html");

    // Cerrar sesion
    logout("logout_btn", "index.html");

    async function showData() {
        try {
            // Obtener todos los documentos de la colección
            const dataObject = await getDb("ordenes");
            // Obtener el diccionario de datos con la colección
            const userObject = await getDb("usuarios");

            // Expresión regular para validar si el cliente es un alumno o no
            const regex = /^\d+$/;

            // Recorrer el diccionario de datos en cada clave
            for (const docId in dataObject) {
                // Obtener el valor de cada clave (objeto con los datos de la orden)
                const docData = dataObject[docId];
                // Obtener el nombre del cliente
                const client = docData.cliente;
                // Obtener el Array con los platillos de la orden
                const dishes = docData.platillos;

                // Obtener el estado de la orden
                const finished = docData.finalizada;
                const complete = docData.completada;
                const cancel = docData.cancelada;

                // Variable para guardar el nombre del cliente
                let clientName;

                // Validar si la orden no está cancelada ni completada
                if (!complete && !cancel && !finished) {
                    // Validar si el cliente es un alumno
                    if (regex.test(client)) {
                        // Recorrer el diccionario de datos en cada clave
                        for (const userId in userObject) {
                            const userData = userObject[userId]; // Obtener los datos del usuario
                            if (client === userData.rfid) {
                                clientName = userData.nombres; // Nombre del alumno
                            }
                        }
                    } else {
                        clientName = client; // Nombre del cliente
                    }

                    // Crear un elemento HTML con el template de la orden
                    const orderElement = orderTemplate(docId, clientName);
                    // Obtener el contenedor de las ordenes
                    const orderContainer = document.getElementById("ordersContainer");
                    // Insertar el template en el contenedor
                    orderContainer.insertAdjacentHTML("beforeend", orderElement);

                    // Recorrer el Array de los platillos de la orden
                    for (let i = 0; i < dishes.length; i++) {
                        // Obtener el documento perteneciente al platillo
                        const dish = await getDocument("platillos", dishes[i].platillo);
                        // Crear un elemento HTML con el template para el detalle del platillo
                        const orderDetailElement = orderDetailTemplate(dish.nombre, dishes[i].detalles);
                        // Obtener el contenedor
                        const orderDetail = document.getElementById(`body_${docId}`);
                        // Insertar el template en el contenedor
                        orderDetail.insertAdjacentHTML("beforeend", orderDetailElement);
                    }
                }
            }

            // Obtener todos los botones de finalizar orden
            const finishedBtns = document.getElementsByClassName("btn_finished");
            // Recorrer los botones
            Array.from(finishedBtns).forEach((btn) => {
                // Obtener el id del botón
                const orderId = btn.id;
                // Obtener el id de la orden
                const idFinished = orderId.substring(9);

                // Agregar un evento a cada botón
                btn.addEventListener("click", async () => {
                    try {
                        // Obtener el documento de la orden y esperar a que se complete
                        const doc = await getDocument("ordenes", idFinished);
                        const user = doc.cliente;

                        let data = {};

                        if (regex.test(user)) {
                            data = {
                                finalizada: !doc.finalizada,
                            }
                        } else {
                            data = {
                                finalizada: !doc.finalizada,
                                completada: !doc.completada,
                            }
                        }
                        // Actualizar el documento y esperar a que se complete
                        await updateDocument("ordenes", idFinished, data);
                        // Recargar la página
                        location.reload();
                    } catch (error) {
                        console.error("Error al actualizar la orden:", error);
                    }
                });
            });

            // Obtener todos los botones de cancelar orden
            const cancelBtns = document.getElementsByClassName("btn_cancel");
            // Recorrer los botones
            Array.from(cancelBtns).forEach((btn) => {
                // Obtener el id del botón
                const orderId = btn.id;
                // Obtener el id de la orden
                const idCancel = orderId.substring(7);

                // Agregar un evento a cada botón
                btn.addEventListener("click", async () => {
                    try {
                        // Obtener el documento de la orden y esperar a que se complete
                        const doc = await getDocument("ordenes", idCancel);
                        // Crear un objeto con los datos a actualizar
                        const data = {
                            cancelada: !doc.cancelada,
                        };
                        // Actualizar el documento y esperar a que se complete
                        await updateDocument("ordenes", idCancel, data);
                        // Recargar la página
                        location.reload();
                    } catch (error) {
                        console.error("Error al actualizar la orden:", error);
                    }
                });
            });
        } catch (error) {
            console.error("Error al mostrar los datos:", error);
        }
    }

    showData();
}

initializeApp().catch((error) => {
    console.error("Error al inicializar la aplicación:", error);
});