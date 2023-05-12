const pass = document.getElementById('login_pass');
const showPass = document.getElementById('showPass');
const btn_sPass = document.getElementById('btn_sPass');

// Función para mostrar u ocultar la contraseña
function handdlerPassword(){
    if(pass.type === 'password'){
        pass.type = 'text';
        showPass.classList.remove('fa-eye');
        showPass.classList.add('fa-eye-slash');
        btn_sPass.classList.remove('btn-outline-secondary');
        btn_sPass.classList.add('btn-dark');
    } else {
        pass.type = 'password';
        showPass.classList.add('fa-eye');
        showPass.classList.remove('fa-eye-slash');
        btn_sPass.classList.add('btn-outline-secondary');
        btn_sPass.classList.remove('btn-dark');
    }
}