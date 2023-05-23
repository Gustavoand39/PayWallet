// Importes de funciones de firebase
import {
    returnPage,
    logout,
    getDb,
    addDocument,
    authState,
} from "../firebase-app.js";
// Importes de templates
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
            const dataObject = await getDb("platillos"); // Obtener el diccionario de datos con la colección
            const cardsById = {}; // Objeto para guardar todas las cards y asignarles un evento de clic posteriormente

            // Recorrer el diccionario de datos en cada clave
            for (const docId in dataObject) {
                const docData = dataObject[docId]; // Obtener el valor de cada clave (objeto con los datos del platillo)

                const id = docId; // Obtener el id del documento actual
                const name = docData.nombre; // Obtener el nombre del platillo
                const price = docData.precio; // Obtener el precio del platillo
                const url = docData.imagen.completeUrl; // Obtener la imagen del platillo
                const stock = docData.stock; // Obtener el stock del platillo

                if (stock) {
                    const card = cardTemplate(name, price, url, id); // Obtener el template del platillo

                    // Asignar el contenedor en base a la categoría del platillo
                    const category = {
                        "Platillo del día": "#platilloDia",
                        Alimentos: "#alimentos",
                        Bebidas: "#bebidas",
                    };

                    const categoryId = category[docData.categoria] || "#variedades"; // Obtener el contenedor asignado a la categoría del platillo
                    const cardsContainer = document.querySelector(categoryId); // Variable del contenedor de cards
                    cardsContainer.insertAdjacentHTML("beforeend", card); // Insertar el template en el contenedor

                    const cardElement = cardsContainer.lastElementChild; // Obtener la última card insertada del contenedor
                    cardsById[id] = cardElement; // Guardar la card en el objeto cardsById
                }
            }

            /* Contenedores vacíos */
            const containers = [
                "platilloDia",
                "alimentos",
                "bebidas",
                "variedades",
            ]; // Array con los ids de los contenedores

            // Bucle para recorrer los contenedores y buscar si alguno está vacío
            for (const container of containers) {
                const containerEmpty = document.getElementById(container); // Obtener el contenedor
                if (containerEmpty.childElementCount === 0) {
                    const cardE = cardEmpty(); // Obtener el template de la card vacía
                    containerEmpty.insertAdjacentHTML("beforeend", cardE); // Insertar el template en el contenedor
                }
            }

            /* Agregar los datos del platillo ordenado a la orden */
            const ordersContainer = document.querySelector("#orders"); // Obtener el contenedor para poner platillos ordenados
            let total = 0; // Variable para guardar el total de la orden
            const totalElement = document.getElementById("total"); // Obtener el elemento HTML para mostrar el total
            const dishesOrdered = []; // Array para guardar los platillos ordenados

            // Función para agregar el platillo a la orden
            const handleCardClick = (cardId) => {
                const docData = dataObject[cardId]; // Obtener los datos del platillo correspondiente al id
                const name_order = docData.nombre; // Obtener el nombre del platillo
                const price_order = docData.precio; // Obtener el precio del platillo
                const order = orderTemplate(name_order, price_order); // Obtener el template de la orden

                dishesOrdered.push(name_order); // Agregar el nombre del platillo al array de platillos ordenados

                ordersContainer.insertAdjacentHTML("beforeend", order); // Insertar el template en el contenedor de las órdenes
                total += price_order; // Sumar el precio del platillo al total
                totalElement.textContent = total; // Mostrar el total en el elemento HTML
            };

            /* Obtener todas las cards para asignarles el evento clic */
            const cards = document.getElementsByClassName("card-class"); // Obtener todas las cards con la clase card-class
            Array.from(cards).forEach((card) => {
                const cardId = card.getAttribute("data-id"); // Obtener el id de cada card
                const cardElement = cardsById[cardId]; // Obtener las cards por id

                // Por cada card, asignarle el evento clic
                cardElement.addEventListener("click", () => {
                    // Cuando se da clic en alguna card, se saca el id dentro de data-id y se pasa a la función
                    handleCardClick(cardId); // Llamar a la función para agregar el platillo a la orden
                });
            });

            /* Completar la orden */
            const orderComplete = document.getElementById("orderComplete"); // Obtener el botón para finalizar la orden
            orderComplete.addEventListener("click", () => {
                const nameClient = document.getElementById("nameClient"); // Obtener el input del nombre del cliente
                const nameValue = nameClient.value; // Obtener el valor del input

                if (nameValue !== "" && ordersContainer.childElementCount > 0) {
                    const date = new Date(); // Obtener la fecha actual
                    const day = date.getDate(); // Obtener el día
                    const month = date.getMonth() + 1; // Obtener el mes
                    const year = date.getFullYear(); // Obtener el año
                    const hour = date.getHours(); // Obtener la hora
                    const minutes = date.getMinutes(); // Obtener los minutos
                    const seconds = date.getSeconds(); // Obtener los segundos
                    const dateOrder = `${day}/${month}/${year} ${hour}:${minutes}:${seconds}`; // Obtener la fecha y hora en formato dd/mm/yyyy hh:mm:ss

                    const order = {
                        cliente: nameValue,
                        fecha: dateOrder,
                        platillos: dishesOrdered,
                        total: total,
                        completada: false,
                        cancelada: false,
                    }; // Objeto con los datos de la orden

                    addDocument("ordenes", order); // Agregar la orden a la colección

                    // Limpiar orden
                    ordersContainer.textContent = ""; // Limpiar el contenedor de las órdenes
                    totalElement.textContent = ""; // Limpiar el total
                    dishesOrdered.length = 0; // Limpiar el array de platillos ordenados
                    total = 0; // Limpiar el total
                    totalElement.textContent = total; // Mostrar el total en el elemento HTML
                    nameClient.value = ""; // Limpiar el input del nombre del cliente
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