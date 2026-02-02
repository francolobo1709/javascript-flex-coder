class Servidor {
    constructor(id, nombre, ip, estado) {
        this.id = id;
        this.nombre = nombre;
        this.ip = ip;
        this.estado = estado; // 'online', 'offline', 'maintenance'
    }

 
    getInfo() {
        return `[${this.id}] ${this.nombre} (${this.ip}) -> ${this.estado.toUpperCase()}`;
    }
}

const clusterServidores = [];

const registrarServidor = () => {
        let id = clusterServidores.length + 1;
        let nombre = prompt("Nombre del servidor (ej: AWS-East):");
        let ip = prompt("Dirección IP (ej: 192.168.1.10):");
        let estado = "online"; // Default

 
    const nuevoServidor = new Servidor(id, nombre, ip, estado);
    
   
    clusterServidores.push(nuevoServidor);
    
    console.log(`>> Servidor ${nombre} registrado exitosamente.`);
}

alert("Bienvenido al Panel de Control de Servidores.\nVamos a inicializar el cluster.");

const CANTIDAD_A_CARGAR = 3;

for (let i = 0; i < CANTIDAD_A_CARGAR; i++) {
    alert(`Cargando servidor ${i + 1} de ${CANTIDAD_A_CARGAR}...`);
    registrarServidor();
}

console.log("--- ESTADO ACTUAL DEL CLUSTER (console.table) ---");
console.table(clusterServidores); 

const listaNombres = clusterServidores.map((servidor) => {
    return `ID: ${servidor.id} - ${servidor.nombre}`;
});

alert("Reporte de Servidores Activos:\n\n" + listaNombres.join("\n"));
let buscarId = parseInt(prompt("Ingrese ID de servidor para ver detalles técnicos:"));
const servidorEncontrado = clusterServidores.find(servidor => servidor.id === buscarId);
if (servidorEncontrado) {
    alert("Detalle encontrado:\n" + servidorEncontrado.getInfo());
} else {
    alert("Error 404: Servidor no encontrado.");
}