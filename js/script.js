const form = document.getElementById("simuladorForm");
const resultadoDiv = document.getElementById("resultado");
const productosGuardadosDiv = document.getElementById("productosGuardados");

//Cargar productos guardados en localStorage
window.onload = () => {
    const productosGuardados = JSON.parse(localStorage.getItem("productos")) || [];
    if (productosGuardados.length > 0) {
        mostrarProductosGuardados(productosGuardados);
    } else {
        mostrarMensaje("No hay productos guardados.", "info");
    }
};

function calcularPrecioFinal(precio, descuento) {
    return precio * (1 - descuento);
}

function mostrarResultados(datos, precioFinal) {
    const precioRedondeado = Math.round(precioFinal * 100) / 100;

    resultadoDiv.innerHTML = `
        <h3>Resultados:</h3>
        <p>Producto: <strong>${datos.nombreProducto}</strong></p>
        <p>Precio con descuento: <strong>$${precioRedondeado}</strong></p>
        <p>Presupuesto disponible: <strong>$${datos.presupuesto}</strong></p>
    `;

    const mensajeFinal = document.createElement("p");

    if (precioRedondeado <= datos.presupuesto) {
        mensajeFinal.textContent = "¡Puedes comprarlo!";
        mensajeFinal.classList.add("resultado-exito"); 
    } else {
        mensajeFinal.textContent = "No tienes suficiente presupuesto.";
        mensajeFinal.classList.add("resultado-error"); 
    }

    resultadoDiv.appendChild(mensajeFinal);
}

function mostrarMensaje(mensaje, tipo) {
    Swal.fire({
        title: mensaje,
        icon: tipo,
        showConfirmButton: true
    });
}

function mostrarProductosGuardados(productos) {
    let listaProductos = `<h3>Productos guardados:</h3><ul>`;
    
    productos.forEach(producto => {
        const precioFinal = Math.round(calcularPrecioFinal(producto.precioProducto, producto.porcentajeDescuento) * 100) / 100;
        listaProductos += `
            <li>${producto.nombreProducto} - Precio con descuento: $${precioFinal}</li>
        `;
    });

    listaProductos += `</ul>`;
    productosGuardadosDiv.innerHTML = listaProductos;
}

form.addEventListener("submit", (e) => {
    e.preventDefault(); 

    const nombreProducto = document.getElementById("nombre").value;
    const precioProducto = parseFloat(document.getElementById("precio").value);
    const porcentajeDescuento = parseFloat(document.getElementById("descuento").value) / 100;
    const presupuesto = parseFloat(document.getElementById("presupuesto").value);

    if (isNaN(precioProducto) || isNaN(porcentajeDescuento) || isNaN(presupuesto)) {
        mostrarMensaje("Por favor, ingresa valores numéricos válidos.", "error");
        return;
    }

    const datos = { nombreProducto, precioProducto, porcentajeDescuento, presupuesto };

    //Obtener los productos existentes y agregar el nuevo producto
    const productosGuardados = JSON.parse(localStorage.getItem("productos")) || [];
    productosGuardados.push(datos);
    localStorage.setItem("productos", JSON.stringify(productosGuardados));

    const precioFinal = calcularPrecioFinal(precioProducto, porcentajeDescuento);
    mostrarResultados(datos, precioFinal);
    mostrarProductosGuardados(productosGuardados);
});
