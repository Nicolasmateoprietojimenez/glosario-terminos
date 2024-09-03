let glosarioCompleto = [];
const resultadosPorPagina = 10;  // Número de resultados por página
let paginaActual = 1;

// Función para cargar el glosario desde un archivo JSON
fetch('glosario.json')
    .then(response => response.json())
    .then(data => {
        glosarioCompleto = data.glosario; // Guarda todos los términos
        mostrarPagina(paginaActual);      // Muestra la primera página de resultados
    })
    .catch(error => console.error('Error cargando el glosario:', error));

// Función para mostrar la lista de palabras de una página específica
function mostrarPagina(pagina) {
    const inicio = (pagina - 1) * resultadosPorPagina;
    const fin = inicio + resultadosPorPagina;
    const glosarioPagina = glosarioCompleto.slice(inicio, fin);

    mostrarLista(glosarioPagina);
    actualizarPaginacion(glosarioCompleto.length, pagina);
}

// Función para mostrar la lista de palabras
function mostrarLista(glosario) {
    const glosarioLista = document.getElementById('glosario-lista');
    glosarioLista.innerHTML = ''; // Limpiar la lista antes de agregar nuevos elementos

    glosario.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item.palabra;
        li.addEventListener('click', () => mostrarModal(item.palabra, item.significado));
        glosarioLista.appendChild(li);
    });
}

// Función para actualizar la paginación
function actualizarPaginacion(totalResultados, paginaActual) {
    const totalPaginas = Math.ceil(totalResultados / resultadosPorPagina);
    const paginacionDiv = document.getElementById('paginacion');
    paginacionDiv.innerHTML = '';  // Limpiar la paginación antes de agregar nuevos botones

    // Crear botones de paginación
    for (let i = 1; i <= totalPaginas; i++) {
        const boton = document.createElement('button');
        boton.textContent = i;
        boton.classList.add('paginacion-boton');
        if (i === paginaActual) {
            boton.classList.add('activo');
        }
        boton.addEventListener('click', () => {
            paginaActual = i;
            mostrarPagina(i);
        });
        paginacionDiv.appendChild(boton);
    }
}

// Función para mostrar el modal con la palabra y su significado
function mostrarModal(palabra, significado) {
    const modal = document.getElementById('modal');
    const modalPalabra = document.getElementById('modal-palabra');
    const modalSignificado = document.getElementById('modal-significado');

    modalPalabra.textContent = palabra;
    modalSignificado.textContent = significado;
    modal.style.display = 'block';
}

// Cerrar el modal al hacer clic en la "x"
document.querySelector('.close').addEventListener('click', () => {
    document.getElementById('modal').style.display = 'none';
});

// Cerrar el modal al hacer clic fuera de él
window.addEventListener('click', (event) => {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Filtrar resultados a medida que el usuario escribe
document.getElementById('busqueda').addEventListener('input', function() {
    const termino = this.value.toLowerCase();
    const resultadosFiltrados = glosarioCompleto.filter(item => 
        item.palabra.toLowerCase().includes(termino)
    );
    paginaActual = 1; // Reiniciar a la primera página cuando se hace una nueva búsqueda
    mostrarLista(resultadosFiltrados.slice(0, resultadosPorPagina));
    actualizarPaginacion(resultadosFiltrados.length, paginaActual);
});
