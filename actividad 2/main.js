
let textoConcatenado = "";


let entrada = prompt("Ingresa una palabra o frase (Escribe 'ESC' para finalizar):");

while (entrada.toUpperCase() != "ESC") {
    if (entrada != "") {
        
        textoConcatenado = textoConcatenado + " " + entrada;
        console.log("Texto actual:", textoConcatenado);
            
        alert("Acumulado hasta ahora:\n" + textoConcatenado);
    }
     entrada = prompt("Ingresa otra palabra (o 'ESC' para salir):");
}

alert("Proceso terminado. Frase final: " + textoConcatenado);