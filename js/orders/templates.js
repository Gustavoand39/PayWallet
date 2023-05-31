export const orderTemplate = (id, name) => `
<div class="row background-secondary my-3 border-style">
    <div class="col-12">
        <div class="row bg-white mx-2 my-3 p-1 border-style">
            <div class="col-9 d-flex align-items-center">
                <h4>${name}</h4>
            </div>

            <div class="col-3 d-flex justify-content-center align-items-center gap-3 my-2">
                <button class="btn-info p-1 btn-style" data-bs-toggle="collapse" data-bs-target="#collapse_${id}" aria-expanded="false" aria-controls="details" title="Detalles">
                    <i class="fa-solid fa-receipt"></i>
                </button>

                <button class="btn-success p-1 btn-style btn_finished" id="finished_${id}" title="Finalizada">
                    <i class="fa-solid fa-check"></i>
                </button>

                <button class="btn-danger p-1 btn-style btn_cancel" id="cancel_${id}" title="Cancelada">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>

            <div class="col-12 collapse" id="collapse_${id}">

                <div class="row px-3">
                    <table class="table table-striped">
                        <thead>
                            <tr class="text-center">
                                <th class="col-6">Producto</th>
                                <th class="col-6">Detalles</th>
                            </tr>
                        </thead>
                        <tbody id="body_${id}"></tbody>
                    </table>
                </div>                                
            </div>
        </div>
    </div>
</div>
`;

export const orderDetailTemplate = (dish, details) => `
    <tr class="text-center">
        <td class="col-6">${dish}</td>
        <td class="col-6">${details}</td>
    </tr>
`;