
const carrito = [];

function crearProducto() {
    let nombre = prompt("Ingresa el nombre de la verdura o fruta:");
    let precio = prompt("Ingresa el precio por kilo:");

    return { 
        nombre: nombre, 
        precio: precio 
    };
}

function agregarAlCarrito(producto) {
    carrito.push(producto);
    console.log("Nuevo ingreso:");
    console.table(carrito); 
}

function iniciarSimulador() {
    let seguir = true;

    while (seguir) {
        let quiereIngresar = confirm("¿Querés ingresar un producto a la lista de precios?");

        if (quiereIngresar) {
            let nuevoProducto = crearProducto();
            agregarAlCarrito(nuevoProducto);
        } else {
            seguir = false;
            alert("Carga finalizada. Revisa el inventario final en la consola.");
        }
    }
}

iniciarSimulador();