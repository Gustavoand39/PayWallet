// Importaciones de firebase-app.js:
import {
    logout,
    getDb,
    updateDocument,
    addDocument,
    authState,
    uploadImage,
    updateImage,
    deleteDocument,
    deleteFile,
} from "../firebase-app.js";
// Templates
import { inventoryTemplate } from "./template.js";

async function initializeApp() {
    if (!(await authState())) {
        window.location.href = "index.html";
    } // Esperar a que se complete la autenticación

    // Navbar
    const nav_1 = document.getElementById("nav_1");
    nav_1.addEventListener("click", () => {
        window.location.href = "menu.html";
    });

    // Cerar sesión
    logout("logout_btn", "index.html");

    async function getData() {
        try {
            const dataObject = await getDb("platillos"); // Obtener todos los platillos de la colección
            const dishes = {}; // Objeto para guardar los platillos y asignarles un evento a c/u

            // Recorrer el diccionario de datos en cada clave
            for (const docID in dataObject) {
                // Obtener el valor de cada clave
                const docData = dataObject[docID];

                // Desestructuración de objetos
                const { nombre, categoria, precio, stock, imagen } = docData; // Obtener los datos del platillo
                // Guardar los datos del platillo en el objeto
                dishes[docID] = [categoria, nombre, precio, stock, imagen];

                const template = inventoryTemplate(nombre, docID); // Obtener el template del platillo
                const container = document.getElementById("containerInventory"); // Obtener el contenedor de platillos
                container.insertAdjacentHTML("beforeend", template); // Insertar el template en el contenedor
            }

            // Obtener todos los templates de platillos
            const inventory = document.getElementsByClassName("inventory-style");

            // Obtener los elementos del modal de edición
            const categoryEdit = document.getElementById("categoryEdit");
            const nameEdit = document.getElementById("nameEdit");
            const priceEdit = document.getElementById("priceEdit");
            const option1 = document.getElementById("option1");
            const option2 = document.getElementById("option2");
            const imageEdit = document.getElementById("imageEdit");

            // Objeto para asignar un número a cada categoría
            const categorySelect = {
                "Platillo del día": 0,
                Alimentos: 1,
                Bebidas: 2,
                Variedades: 3,
            };
            // Objeto para asignar un nombre a cada categoría
            const newCategory = {
                0: "Platillo del día",
                1: "Alimentos",
                2: "Bebidas",
                3: "Variedades",
            };

            // Asignar eventos para cada template
            Array.from(inventory).forEach((element) => {
                const idDoc = element.getAttribute("data-id"); // Obtener el id del platillo
                const btn_edit = element.querySelector(`#edit_${idDoc}`); // Obtener el botón de editar

                // Asignar un evento de clic al botón de editar
                btn_edit.addEventListener("click", () => {
                    // Obtener la categoría del platillo
                    const category = categorySelect[dishes[idDoc][0]];

                    // Asignar los valores del platillo al modal de edición
                    categoryEdit.selectedIndex = category; // Categoría del platillo
                    nameEdit.value = dishes[idDoc][1]; // Nombre del platillo
                    priceEdit.value = dishes[idDoc][2]; // Precio del platillo
                    option1.checked = dishes[idDoc][3] ? true : false; // Si el platillo está disponible
                    option2.checked = dishes[idDoc][3] ? false : true; // Si el platillo no está disponible

                    // Variable para la imagen del platillo
                    let file;

                    // Asignar un evento de cambio al input de imagen
                    imageEdit.addEventListener("change", () => {
                        file = imageEdit.files[0]; // Obtener la imagen agregada por el usuario
                    });

                    // Asignar un evento de clic al botón de guardar cambios
                    const saveChanges = document.getElementById("saveChanges");
                    saveChanges.addEventListener("click", async () => {
                        try {
                            // Nueva categoría del platillo
                            const selectCategory = newCategory[categoryEdit.value];

                            const data = {
                                categoria: selectCategory,
                                nombre: nameEdit.value,
                                precio: priceEdit.value,
                                stock: option1.checked ? true : false,
                            }; // Obtener los valores del modal

                            // Si el usuario no cambió la imagen, no actualizarla
                            if (file) {
                                // Actualizar la imagen
                                const img = await updateImage(file, dishes[idDoc][4].storageLocation);
                                // Guardar la nueva imagen en el objeto
                                data.imagen = img;
                            }

                            // Actualizar el platillo y esperar a que se complete
                            await updateDocument("platillos", idDoc, data);

                            // Obtener el modal de edición
                            const modalElement = document.getElementById("modal_edit");
                            // Crear una instancia del modal
                            const modal = bootstrap.Modal.getInstance(modalElement);
                            // Ocultar el modal
                            modal.hide();
                            // Recargar la página
                            location.reload();
                        } catch (error) {
                            console.log(error);
                        }
                    });
                });

                // Obtener todos los botones de eliminar
                const btn_delete = element.querySelector(`#delete_${idDoc}`);
                // Asignar un evento de clic a cada botón de eliminar
                btn_delete.addEventListener("click", async () => {
                    // Mostrar un mensaje de confirmación
                    const confirmDelete = confirm(
                        "¿Está seguro que desea eliminar este platillo?"
                    );

                    // Si el usuario confirma la eliminación, eliminar el platillo
                    if (confirmDelete) {
                        try {
                            // Eliminar el documento del platillo
                            await deleteDocument("platillos", idDoc);
                            // Eliminar la imagen del platillo de Storage
                            await deleteFile(dishes[idDoc][4].storageUrl);
                            // Recargar la página
                            location.reload();
                        } catch (error) {
                            console.log(error);
                        }
                    }
                });
            });

            // Obtener el botón de agregar platillo
            const btnAdd = document.getElementById("addPlate");
            // Obtener los elementos del modal de agregar platillo
            const name = document.getElementById("nameAdd");
            const price = document.getElementById("priceAdd");
            const category = document.getElementById("categoryAdd");
            const opt1 = document.getElementById("option1_add");
            const opt2 = document.getElementById("option2_add");
            const image = document.getElementById("imageAdd");
            // Asignar un evento de clic al botón de agregar platillo
            btnAdd.addEventListener("click", async () => {
                // Validar que todos los campos estén llenos
                if (
                    name.value !== "" &&
                    price.value > 0 &&
                    category.value !== "" &&
                    (opt1.checked || opt2.checked) &&
                    image.files.length > 0
                ) {
                    try {
                        // Obtener la categoría del platillo
                        const categoryPlate = newCategory[category.value];
                        // Subir la imagen a Storage y obtener los datos
                        const dataImage = await uploadImage(image.files[0]);

                        // Crear un objeto con los datos del platillo
                        const data = {
                            categoria: categoryPlate,
                            nombre: name.value,
                            precio: parseFloat(price.value),
                            stock: opt1.checked ? true : false,
                            imagen: dataImage,
                        };

                        // Agregar el platillo a la base de datos
                        await addDocument("platillos", data);
                        // Recargar la página
                        location.reload();
                    } catch (error) {
                        console.log(error);
                    }
                } else {
                    alert("Todos los campos son obligatorios");
                }
            });
        } catch (error) {
            console.log(error);
        }
    }

    getData();
}

initializeApp().catch((error) => {
    console.error("Error al inicializar la aplicación:", error);
});