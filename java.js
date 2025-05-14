const precios = {
    VIP: 500000,
    General: 300000
};

const disponibles = {
    VIP: 200,
    General: 200
};

document.getElementById("cantidad").addEventListener("input", function () {
    const cantidad = parseInt(this.value);
    const localidadContainer = document.getElementById("localidadContainer");
    const confirmarBtn = document.getElementById("confirmarBtn");
    const totalContainer = document.getElementById("totalContainer");

    if (cantidad >= 1 && cantidad <= 10) {
        localidadContainer.style.display = "block";
        confirmarBtn.style.display = "inline-block";
        totalContainer.style.display = "block";
    } else {
        localidadContainer.style.display = "none";
        confirmarBtn.style.display = "none";
        totalContainer.style.display = "none";
        document.getElementById("total").textContent = "$0";
    }

    calcularTotal();
});

const checkboxes = document.querySelectorAll('input[name="localidad"]');
checkboxes.forEach(cb => {
    cb.addEventListener("change", calcularTotal);
});

function getLocalidadesSeleccionadas() {
    return Array.from(document.querySelectorAll('input[name="localidad"]:checked')).map(cb => cb.value);
}

function calcularTotal() {
    const cantidad = parseInt(document.getElementById("cantidad").value);
    const localidades = getLocalidadesSeleccionadas();

    if (localidades.length === 0 || isNaN(cantidad) || cantidad < 1 || cantidad > 10) {
        document.getElementById("total").textContent = "$0";
        return;
    }

    const cantidadPorLocalidad = Math.floor(cantidad / localidades.length);
    let total = 0;

    localidades.forEach(loc => {
        total += precios[loc] * cantidadPorLocalidad;
    });


    const sobrante = cantidad % localidades.length;
    if (sobrante > 0) {
        total += precios[localidades[0]] * sobrante;
    }

    // Descuentos
    if (localidades.length === 2) {
        total *= 0.8;
    } else if (cantidad > 5) {
        total *= 0.9;
    }

    document.getElementById("total").textContent = "$" + total.toLocaleString("es-CO");
}

document.getElementById("ticketForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const cantidad = parseInt(document.getElementById("cantidad").value);
    const localidades = getLocalidadesSeleccionadas();

    if (cantidad < 1 || cantidad > 10) {
        alert("Debes seleccionar entre 1 y 10 entradas.");
        return;
    }

    if (localidades.length === 0) {
        alert("Debes seleccionar al menos una localidad.");
        return;
    }


    const cantidadPorLocalidad = Math.floor(cantidad / localidades.length);
    const sobrante = cantidad % localidades.length;

    for (let i = 0; i < localidades.length; i++) {
        const loc = localidades[i];
        let cantidadLocal = cantidadPorLocalidad + (i === 0 ? sobrante : 0);
        if (cantidadLocal > disponibles[loc]) {
            alert(`No hay suficientes entradas disponibles en ${loc}.`);
            return;
        }
    }


    for (let i = 0; i < localidades.length; i++) {
        const loc = localidades[i];
        let cantidadLocal = cantidadPorLocalidad + (i === 0 ? sobrante : 0);
        disponibles[loc] -= cantidadLocal;
    }
    alert("Haz comprado tus boletas.");
    setTimeout(() => {
        location.reload();
    }, 1000);
});



