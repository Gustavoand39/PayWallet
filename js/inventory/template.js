export const inventoryTemplate = (dish_name, id) => `
<div class="row my-3 inventory-style" data-id="${id}">
    <div class="col-12 background-secondary border-style">
        <div class="row bg-white d-flex align-items-center border-style mx-2 my-3 p-2">
            <div class="col-8 col-md-10 d-flex flex-lg-row">
                <h4>${dish_name}</h4>
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
    </div>
</div>
`;