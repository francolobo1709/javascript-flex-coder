
// VERDULERÍA Franco Lobo - Sistema de Carrito y Consultas
// Entrega Final

const BASE_URL = 'https://jsonplaceholder.typicode.com';

// ============================================================
// CARRITO (base del EntregableN°2, con de agregado de uso de fecth para sección de compradores)
// ============================================================

const formulario        = document.getElementById('formularioProducto');
const inputNombre       = document.getElementById('nombreProducto');
const inputPrecio       = document.getElementById('precioProducto');
const inputCantidad     = document.getElementById('cantidadProducto');
const listaProductosEl  = document.getElementById('listaProductos');
const totalPrecioEl     = document.getElementById('totalPrecio');
const btnLimpiar        = document.getElementById('btnLimpiar');
const toastEl           = document.getElementById('toast');

let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

//  Toast (reemplaza al alert) 
function mostrarToast(mensaje, tipo = 'exito') {
    toastEl.textContent = mensaje;
    toastEl.className = `toast toast-${tipo}`;
    clearTimeout(toastEl._timer);
    toastEl._timer = setTimeout(() => {
        toastEl.className = 'toast oculto';
    }, 3000);
}

//  Persistencia
function guardarEnStorage() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

//Renderizar lista del carrito 
function actualizarVista() {
    listaProductosEl.innerHTML = '';

    if (carrito.length === 0) {
        const li = document.createElement('li');
        li.className = 'carrito-vacio';
        li.textContent = 'El carrito está vacío. Agregá un producto para comenzar.';
        listaProductosEl.appendChild(li);
        totalPrecioEl.textContent = 'Total a abonar: $0';
        return;
    }

    carrito.forEach((producto, index) => {
        const subtotal = (producto.precio * producto.cantidad).toFixed(2);
        const li = document.createElement('li');
        li.className = 'item-carrito';
        li.innerHTML = `
            <div class="item-info">
                <strong>${producto.nombre}</strong>
                <span>${producto.cantidad} kg &times; $${producto.precio} = $${subtotal}</span>
            </div>
            <button class="btn-eliminar" data-index="${index}" aria-label="Eliminar ${producto.nombre}">&#x2715;</button>
        `;
        listaProductosEl.appendChild(li);
    });

    // Delegación de eventos: botones de eliminar ítem individual
    listaProductosEl.querySelectorAll('.btn-eliminar').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idx = parseInt(e.currentTarget.dataset.index, 10);
            const nombre = carrito[idx].nombre;
            carrito.splice(idx, 1);
            guardarEnStorage();
            actualizarVista();
            mostrarToast(`"${nombre}" eliminado del carrito`, 'error');
        });
    });

    const sumaTotal = carrito.reduce((acc, p) => acc + (p.precio * p.cantidad), 0);
    totalPrecioEl.textContent = `Total a abonar: $${sumaTotal.toFixed(2)}`;
}

// Validación inline (sin alert)
function limpiarErrores() {
    ['errorNombre', 'errorPrecio', 'errorCantidad'].forEach(id => {
        document.getElementById(id).textContent = '';
    });
    [inputNombre, inputPrecio, inputCantidad].forEach(el => el.classList.remove('input-error'));
}

function validarFormulario(nombre, precio, cantidad) {
    let valido = true;
    limpiarErrores();

    if (!nombre) {
        document.getElementById('errorNombre').textContent = 'El nombre es obligatorio.';
        inputNombre.classList.add('input-error');
        valido = false;
    }
    if (isNaN(precio) || precio <= 0) {
        document.getElementById('errorPrecio').textContent = 'Ingresá un precio válido (solo números, mayor a cero).';
        inputPrecio.classList.add('input-error');
        valido = false;
    }
    if (isNaN(cantidad) || cantidad <= 0) {
        document.getElementById('errorCantidad').textContent = 'Ingresá una cantidad válida (solo números, mayor a cero).';
        inputCantidad.classList.add('input-error');
        valido = false;
    }

    return valido;
}

// Evento: Agregar producto 
formulario.addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre   = inputNombre.value.trim();
    const precio   = parseFloat(inputPrecio.value);
    const cantidad = parseFloat(inputCantidad.value);

    if (!validarFormulario(nombre, precio, cantidad)) return;

    carrito.push({ nombre, precio, cantidad });
    guardarEnStorage();
    actualizarVista();
    formulario.reset();
    inputNombre.focus();
    mostrarToast(`"${nombre}" agregado al carrito`);
});

// --- Evento: Limpiar carrito ---
btnLimpiar.addEventListener('click', () => {
    if (carrito.length === 0) {
        mostrarToast('El carrito ya está vacío', 'error');
        return;
    }
    carrito = [];
    guardarEnStorage();
    actualizarVista();
    mostrarToast('Carrito limpiado correctamente', 'error');
});


actualizarVista();



// SERVICIO DE API - fetch + async/await


async function fetchUsuarios(limit) {
    const loadingEl = document.getElementById('loadingCompradores');
    const errorEl   = document.getElementById('errorCompradores');
    const listaEl   = document.getElementById('listaCompradores');

    loadingEl.classList.remove('oculto');
    errorEl.classList.add('oculto');
    listaEl.innerHTML = '';

    try {
        const respuesta = await fetch(`${BASE_URL}/users?_limit=${limit}`);
        if (!respuesta.ok) throw new Error(`Error del servidor: ${respuesta.status}`);
        const usuarios = await respuesta.json();

        loadingEl.classList.add('oculto');
        renderizarCompradores(usuarios, listaEl);
    } catch (error) {
        loadingEl.classList.add('oculto');
        errorEl.textContent = 'No se pudieron cargar los compradores. Verificá tu conexión.';
        errorEl.classList.remove('oculto');
    }
}


// ============================================================
// RENDER: Manipulación del DOM para cada sección API
// ============================================================

function renderizarCompradores(usuarios, contenedor) {
    contenedor.innerHTML = '';
    usuarios.forEach((usuario, index) => {
        const card = document.createElement('div');
        card.className = 'card card-comprador';
        card.innerHTML = `
            <div class="ranking">#${index + 1}</div>
            <h4>${usuario.name}</h4>
            <p class="detalle">Correo: ${usuario.email}</p>
            <p class="detalle">Ciudad: ${usuario.address.city}</p>
            <p class="detalle">Empresa: ${usuario.company.name}</p>
        `;
        contenedor.appendChild(card);
    });
}


// ============================================================
// BOTÓN CONSULTAR: dispara las 3 secciones en paralelo
// ============================================================

const inputLimite   = document.getElementById('inputLimite');
const btnConsultar  = document.getElementById('btnConsultar');
const errorLimiteEl = document.getElementById('errorLimite');

btnConsultar.addEventListener('click', async () => {
    const valor = parseInt(inputLimite.value, 10);

    errorLimiteEl.textContent = '';
    inputLimite.classList.remove('input-error');

    if (!inputLimite.value || isNaN(valor) || valor < 1 || valor > 10) {
        errorLimiteEl.textContent = 'Ingresá un número entre 1 y 10.';
        inputLimite.classList.add('input-error');
        return;
    }

    await fetchUsuarios(valor);
});
