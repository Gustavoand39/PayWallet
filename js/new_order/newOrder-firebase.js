// Importes de funciones de firebase-app.js
import {
    returnPage,
    logout,
    getDb,
    addDocument,
    authState,
} from "../firebase-app.js";
// Templates
import { cardTemplate, orderTemplate, cardEmpty } from "./templates.js";

async function initializeApp() {
    if (!(await authState())) {
        window.location.href = "index.html";
    } // Esperar a que se complete la autenticación

    // Retornar a la página anterior y cerrar sesión
    returnPage("btn_return", "menu.html");
    logout("logout_btn", "index.html");

    // Mostrar los datos una vez cargados
    async function showData() {
        try {
            // Obtener el diccionario de datos con la colección
            const dataObject = await getDb("platillos");
            // Objeto para guardar todas las cards y asignarles un evento de clic posteriormente
            const cardsById = {};

            // Recorrer el diccionario de datos en cada clave
            for (const docId in dataObject) {
                // Obtener el valor de cada clave (objeto con los datos del platillo)
                const docData = dataObject[docId];

                const id = docId; // Obtener el id del documento actual
                const name = docData.nombre; // Obtener el nombre del platillo
                const price = docData.precio; // Obtener el precio del platillo
                const url = docData.imagen.completeUrl; // Obtener la imagen del platillo
                const stock = docData.stock; // Obtener el stock del platillo

                // Verificar si el platillo está disponible
                if (stock) {
                    // Obtener el template del platillo
                    const card = cardTemplate(name, price, url, id);

                    // Asignar el contenedor en base a la categoría del platillo
                    const category = {
                        "Platillo del día": "#platilloDia",
                        Alimentos: "#alimentos",
                        Bebidas: "#bebidas",
                    };

                    // Obtener el contenedor asignado a la categoría del platillo
                    const categoryId = category[docData.categoria] || "#variedades";
                    // Variable del contenedor de cards
                    const cardsContainer = document.querySelector(categoryId);
                    // Insertar el template en el contenedor
                    cardsContainer.insertAdjacentHTML("beforeend", card);

                    // Obtener la última card insertada del contenedor
                    const cardElement = cardsContainer.lastElementChild;
                    // Guardar la card en el objeto cardsById
                    cardsById[id] = cardElement;
                }
            }

            // Obtener los elementos HTML de los contenedores
            const containers = [
                "platilloDia",
                "alimentos",
                "bebidas",
                "variedades",
            ];

            // Bucle para recorrer los contenedores y buscar si alguno está vacío
            for (const container of containers) {
                // Obtener el contenedor
                const containerEmpty = document.getElementById(container);
                // Verificar si el contenedor está vacío
                if (containerEmpty.childElementCount === 0) {
                    // Genera el template de la card vacía
                    const cardE = cardEmpty();
                    // Insertar el template en el contenedor
                    containerEmpty.insertAdjacentHTML("beforeend", cardE);
                }
            }

            // Obtener el contenedor para poner platillos ordenados
            const ordersContainer = document.querySelector("#orders");
            // Variable para guardar el total de la orden
            let total = 0;
            // Obtener el elemento HTML para mostrar el total
            const totalElement = document.getElementById("total");
            // Array para guardar los platillos ordenados
            let dishesOrdered = [];

            // Función para agregar el platillo a la orden
            const handleCardClick = (cardId) => {
                // Obtener el objeto con los datos del platillo
                const docData = dataObject[cardId];
                // Obtener el nombre del platillo
                const name_order = docData.nombre;
                // Obtener el precio del platillo
                const price_order = docData.precio;
                // Obtener los detalles del platillo (por ahora no hay)
                const details = "...";
                // Obtener el template de la orden
                const order = orderTemplate(name_order, price_order);

                // Agregar el platillo al array de platillos ordenados
                dishesOrdered.push({
                    detalles: details,
                    platillo: cardId
                });
                
                // Agregar el platillo al contenedor de las órdenes
                ordersContainer.insertAdjacentHTML("beforeend", order);
                // Sumar el precio del platillo al total
                total += price_order;
                // Mostrar el total en el elemento HTML
                totalElement.textContent = total;
            };

            // Obtener todas las cards con la clase card-class
            const cards = document.getElementsByClassName("card-class");
            // Recorrer todas las cards
            Array.from(cards).forEach((card) => {
                // Obtener el id del platillo asociado a la card
                const cardId = card.getAttribute("data-id");
                // Obtener el elemento HTML de la card
                const cardElement = cardsById[cardId];

                // Por cada card, asignarle el evento clic
                cardElement.addEventListener("click", () => {
                    // Cuando se da clic en alguna card, se llama a la función handleCardClick
                    handleCardClick(cardId);
                });
            });

            // Obtener el botón para finalizar la orden
            const orderComplete = document.getElementById("orderComplete");
            // Asignar el evento clic al botón
            orderComplete.addEventListener("click", async () => {
                // Obtener el input del nombre del cliente
                const nameClient = document.getElementById("nameClient");
                // Obtener el valor del input
                const nameValue = nameClient.value;

                // Verificar si el input tiene algún valor y si hay platillos ordenados
                if (nameValue !== "" && ordersContainer.childElementCount > 0) {
                    const date = new Date(); // Obtener la fecha actual
                    const day = date.getDate(); // Obtener el día
                    const month = date.getMonth() + 1; // Obtener el mes
                    const year = date.getFullYear(); // Obtener el año
                    const hour = date.getHours(); // Obtener la hora
                    const minutes = date.getMinutes(); // Obtener los minutos
                    const seconds = date.getSeconds(); // Obtener los segundos
                    // Formatear la fecha y hora (dd/mm/aaaa hh:mm:ss)
                    const dateOrder = `${day}/${month}/${year} ${hour}:${minutes}:${seconds}`;

                    // Objeto con los datos de la orden
                    const order = {
                        cliente: nameValue,
                        fecha: dateOrder,
                        platillos: dishesOrdered,
                        total: total,
                        finalizada: false,
                        completada: false,
                        cancelada: false,
                    };

                    try {
                        // Agregar la orden a la colección "ordenes"
                        await addDocument("ordenes", order);

                        // Limpiar orden
                        ordersContainer.textContent = "";
                        totalElement.textContent = "";
                        dishesOrdered.length = 0;
                        total = 0;
                        totalElement.textContent = total;
                        nameClient.value = "";
                    } catch (error) {
                        console.error(error); // Manejar el error si ocurre
                    }
                } else {
                    alert("Complete correctamente la orden");
                }
            });
        } catch (error) {
            console.error(error); // Manejar el error si ocurre
        }
    }

    showData();
}

initializeApp().catch((error) => {
    // Manejar errores
    console.error("Error al inicializar la aplicación:", error);
});