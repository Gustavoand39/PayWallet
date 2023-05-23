export const inventoryTemplate = (dish_name, id) => `
<div class="row bg-white d-flex align-items-center p-2 my-3 border-style inventory-style" data-id="${id}">
    <div class="col-8 col-md-10 d-flex flex-lg-row">
        <span class="fw-bold fs-4">${dish_name}</span>
    </div>

    <div class="col-4 col-md-2 d-flex justify-content-center gap-2">
        <button class="btn-info btn-style p-1" title="Editar" data-bs-toggle="modal" data-bs-target="#modal_edit" id="edit_${id}">
            <i class="fa-solid fa-pen"></i>
        </button>
        <button class="btn-danger btn-style p-1" title="Eliminar" id="delete_${id}">
            <i class="fa-solid fa-trash-can"></i>
        </button>
    </div>
</div>
`;