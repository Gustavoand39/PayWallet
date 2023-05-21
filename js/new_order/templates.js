export const cardTemplate = (name, price, url, id) => `
    <div class="col-4 mb-4 card-class" data-id="${id}">
        <div class="card card-style">
            <img src="${url}" class="card-img-top img-fluid">
            <div class="card-body text-center">
                <div class="card-text">${name}</div> <!-- Nombre del platillo -->
                <span class="fw-bold">($${price}.00)</span>
            </div>
        </div>
    </div>
`;

export const orderTemplate = (name_order, price_order) => `
    <div class="row border-bottom d-flex justify-content-evenly align-items-center text-center py-2">
        <div class="col-6">
            <span>${name_order}</span> <!-- Nombre del platillo -->
        </div>
        <div class="col-6">
            <span>$${price_order}.00</span> <!-- Precio del platillo -->
        </div>
    </div>
`;

/* 
<div class="col-2">
    <button class="btn btn-style fs-3 p-0" data-id="${id_order}">
        <i class="fa-solid fa-circle-minus"></i>
    </button>
</div>
*/

export const cardEmpty = () => `
    <div class="col-4 mb-3">
        <div class="card">
            <img src="../../img/agotado.png" class="card-img-top"> <!-- Imagen del platillo -->
            <div class="card-body">
                <p class="card-text text-center">Sin productos disponibles</p> <!-- Nombre del platillo -->
            </div>
        </div>
    </div>
`;
