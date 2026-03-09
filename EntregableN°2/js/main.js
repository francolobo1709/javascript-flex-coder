// Acceso a manipulacion del DOM
const formulario = document.getElementById('formularioProducto');
const inputNombre = document.getElementById('nombreProducto');
const inputPrecio = document.getElementById('precioProducto');
const listaProductos = document.getElementById('listaProductos');
const totalPrecio = document.getElementById('totalPrecio');
const btnLimpiar = document.getElementById('btnLimpiar');

let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

function guardarEnStorage() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

function actualizarVista() {
   
    listaProductos.innerHTML = '';

     carrito.forEach(producto => {
        const li = document.createElement('li');
        li.innerHTML = `<span><strong>${producto.nombre}</strong></span> <span>$${producto.precio}</span>`;
        listaProductos.appendChild(li);
    });

      const sumaTotal = carrito.reduce((acumulador, producto) => acumulador + producto.precio, 0);
    totalPrecio.innerText = `Suma total: $${sumaTotal}`;
}

function agregarProducto(nombre, precio) {
    const nuevoProducto = {
        nombre: nombre,
        precio: parseFloat(precio) 
    };
    carrito.push(nuevoProducto);
    
    guardarEnStorage(); 
    actualizarVista();  
}


formulario.addEventListener('submit', (evento) => {
    evento.preventDefault(); 

    const nombre = inputNombre.value.trim();
    const precio = inputPrecio.value.trim();
   
    if (nombre !== '' && precio > 0) {
        agregarProducto(nombre, precio);
        
        formulario.reset(); 
        inputNombre.focus(); 
    }
});

btnLimpiar.addEventListener('click', () => {
    carrito = []; 
    guardarEnStorage(); 
    actualizarVista(); 
});


actualizarVista();