document.addEventListener("DOMContentLoaded", function() {
    let tipoVentaSelect = document.getElementById("tipo_venta");
    let tipoGalletaSelect = document.getElementById("tipo_galleta");

    tipoVentaSelect.addEventListener("change", function() {
        let tipoVentaId = this.value;
        
        // Limpiar opciones anteriores
        tipoGalletaSelect.innerHTML = '<option value="">Seleccione un lote...</option>';

        // Hacer la petición solo si hay un tipo de venta seleccionado
        if (tipoVentaId) {
            fetch(`/venta/obtener_galletas/${tipoVentaId}`)
                .then(response => response.json())
                .then(data => {
                    data.forEach(galleta => {
                        let option = document.createElement("option");
                        option.value = galleta.id;
                        option.textContent = galleta.nombre;
                        tipoGalletaSelect.appendChild(option);
                    });
                })
                .catch(error => console.error("Error al obtener las galletas:", error));
        }
    });
});

document.addEventListener("DOMContentLoaded", function() {
    let galletaSelect = document.getElementById("tipo_galleta");
    let loteSelect = document.getElementById("lote");
    let existenciaInput = document.getElementById("existencia_lote");
    let fechaCaducidadInput = document.getElementById("fecha_caducidad_lote");

    // Cargar tipos de galleta iniciales (si es necesario)
    // fetch('/ruta/para/tipos_galleta')... 

    galletaSelect.addEventListener("change", function() {
        let galletaId = this.value;
        loteSelect.innerHTML = '<option value="">Seleccione un lote...</option>';
        existenciaInput.value = '';
        fechaCaducidadInput.value = '';

        if (galletaId) {
            fetch(`/venta/obtener_lotes/${galletaId}`)
                .then(response => response.json())
                .then(data => {
                    data.forEach(lote => {
                        let option = document.createElement("option");
                        option.value = lote.id;
                        option.textContent = `Lote: ${lote.id} - Cantidad: ${lote.existencia} - Caducidad: ${lote.fechaCaducidad}`;
                        // Agregar datos como atributos
                        option.dataset.existencia = lote.existencia;
                        option.dataset.fechaCaducidad = lote.fechaCaducidad;
                        loteSelect.appendChild(option);
                    });
                })
                .catch(error => console.error("Error al obtener los lotes:", error));
        }
    });

    // Actualizar campos ocultos cuando seleccionan un lote
    loteSelect.addEventListener("change", function() {
        if (this.value) {
            const selectedOption = this.options[this.selectedIndex];
            existenciaInput.value = selectedOption.dataset.existencia;
            fechaCaducidadInput.value = selectedOption.dataset.fechaCaducidad;
        } else {
            existenciaInput.value = '';
            fechaCaducidadInput.value = '';
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const ticketLinks = document.querySelectorAll(".ticket-link");

    ticketLinks.forEach(link => {
        link.addEventListener("click", async function (event) {
            event.preventDefault(); 

            const ventaId = this.getAttribute("data-id");

            try {
                // Obtener el ticket en Base64 desde el backend
                const response = await fetch(`obtener_ticket/${ventaId}`);
                const data = await response.json();

                if (!data.ticket_base64) {
                    alert("No se encontró el ticket.");
                    return;
                }

                // Convertir Base64 a Blob (PDF)
                const byteCharacters = atob(data.ticket_base64);
                const byteNumbers = new Array(byteCharacters.length).fill(0).map((_, i) => byteCharacters.charCodeAt(i));
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: "application/pdf" });

                // Crear una URL y abrirla en nueva ventana
                const pdfUrl = URL.createObjectURL(blob);
                window.open(pdfUrl, "Ticket", "width=400,height=500,scrollbars=yes");

            } catch (error) {
                console.error("Error al obtener el ticket:", error);
                alert(error);
            }
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const cobrarBtn = document.getElementById("cobrar-btn");
    if (cobrarBtn) {
        cobrarBtn.addEventListener("click", function (event) {
            event.preventDefault(); // Prevenir el envío del formulario inmediato

            Swal.fire({
                title: '¿Estás seguro de cobrar esta venta?',
                text: "¡Cuidado! Esta acción no se puede deshacer.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: "#a65323",
                cancelButtonColor: "#f5c19b",
                confirmButtonText: "Sí, cobrar",
                cancelButtonText: "Cancelar"
            }).then((result) => {
                if (result.isConfirmed) {
                    // Si el usuario confirma, se envía el formulario
                    document.getElementById("cobrar-form").submit();
                }
            });
        });
    }
});
document.addEventListener("DOMContentLoaded", function() {
    const buscarInput = document.getElementById("buscar");

    // Función para filtrar las ventas
    buscarInput.addEventListener("input", function() {
        const fechaBuscada = this.value;
        const filas = document.querySelectorAll("#tblDetalleVenta tr"); // Seleccionamos todas las filas de la tabla

        filas.forEach(function(fila) {
            const fechaVenta = fila.querySelector("td:nth-child(1)").textContent.trim(); // Obtenemos la fecha de la venta

            // Compara la fecha de la venta con la fecha buscada
            if (fechaVenta.includes(fechaBuscada) || fechaBuscada === "") {
                fila.style.display = ""; // Muestra la fila si coincide o si el input está vacío
            } else {
                fila.style.display = "none"; // Oculta la fila si no coincide
            }
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {
    // Para los botones de cobrar
    document.querySelectorAll(".btn-pedido").forEach(boton => {
        boton.addEventListener("click", function (event) {
            event.preventDefault();
            
            const ordenId = this.getAttribute("data-orden-id");
            const form = this.closest("form");
            
            Swal.fire({
                title: "¿Estás seguro de cobrar este pedido?",
                text: "Esta acción registrará la venta y generará el ticket.",
                icon: "question",
                showCancelButton: true,
                confirmButtonColor: "#a65323",
                cancelButtonColor: "#f5c19b",
                confirmButtonText: "Sí, cobrar pedido",
                cancelButtonText: "Cancelar"
            }).then((result) => {
                if (result.isConfirmed) {
                    form.submit();
                }
            });
        });
    });
});

document.addEventListener("DOMContentLoaded", function() {
    fetch('obtener/lotes')
        .then(response => response.json())
        .then(data => {
            const selectLotes = document.getElementById("lote_merma");
            data.forEach(lote => {
                const option = document.createElement("option");
                option.value = lote.id_lote;
                option.textContent = `Lote ${lote.id_lote} - Cantidad: ${lote.existencia} - ${lote.nombre_galleta} - ${lote.tipo_galleta}`;
                selectLotes.appendChild(option);
            });
        })
        .catch(error => console.error("Error cargando los lotes:", error));
});
document.addEventListener("DOMContentLoaded", function () {
    // Para los botones de cobrar
    document.querySelectorAll(".btn-merma").forEach(boton => {
        boton.addEventListener("click", function (event) {
            event.preventDefault();

            const form = this.closest("form");
            
            Swal.fire({
                title: "¿Estás seguro de realizar esta acción?",
                text: "Esta acción descontara al lote seleccionado.",
                icon: "question",
                showCancelButton: true,
                confirmButtonColor: "#a65323",
                cancelButtonColor: "#f5c19b",
                confirmButtonText: "Sí, registrar merma",
                cancelButtonText: "No, Cancelar"
            }).then((result) => {
                if (result.isConfirmed) {
                    form.submit();
                }
            });
        });
    });
});
