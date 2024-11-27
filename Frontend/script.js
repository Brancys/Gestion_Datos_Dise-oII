document.addEventListener('DOMContentLoaded', function () {
    fetch('http://localhost:3015/logs/', {  // Cambia la URL según tu configuración
        method: 'GET'
    })
        .then(response => {
            if (!response.ok) {
                if (response.status === 503) {  // Suponiendo que 503 Service Unavailable podría indicar problemas de BD
                    alert("El servicio de base de datos no está disponible");
                    throw new Error('Service unavailable');
                } else {
                    alert("Ha ocurrido un problema al cargar los datos.");
                    throw new Error('Network response was not ok');
                }
            }
            return response.json();
        })
        .then(data => {
            const tabla = document.querySelector('.section-1__viewlog tbody');  // Asume que tienes una tabla para logs
            data.forEach(log => {
                const fila = document.createElement('tr');
                fila.innerHTML = `
                <td>${log.action}</td>
                <td>${new Date(log.timestamp).toLocaleDateString()}</td>
                <td>${log.nroDocumento}</td>
                <td>${log.tipoDocumento}</td>
            `;
                tabla.appendChild(fila);
            });
        })
        .catch(error => {
            alert('El servicio de logs no está disponible')
            console.error('Error al cargar los logs:', error)
        });
});



document.querySelectorAll('.nav__items li').forEach(item => {
    item.addEventListener('click', (event) => {
        // Verificar si el elemento clickeado tiene la clase 'active'
        if (!event.currentTarget.classList.contains('active')) {
            // Eliminar la clase 'active' de todos los elementos
            document.querySelectorAll('.nav__items li').forEach(item => {
                item.classList.remove('active');
            });
            // Agregar la clase 'active' solo al elemento clickeado
            event.currentTarget.classList.add('active');

            // Obtener la URL de la página del enlace dentro del elemento clickeado
            const url = event.currentTarget.querySelector('a').getAttribute('href');
            // Redireccionar a la URL
            window.location.href = url;
        }
    });
});

function toggleFilters() {
    var filterContainer = document.getElementById('filterContainer');
    if (filterContainer.style.display === "none") {
        filterContainer.style.display = "block";
    } else {
        filterContainer.style.display = "none";
    }
}

function searchDocument() {
    var documentType = document.getElementById('documentType').value;
    var documentValue = document.getElementById('documentSearch').value;
    console.log('Búsqueda por documento: Tipo - ' + documentType + ', Número - ' + documentValue);
    alert('Búsqueda por tipo de documento: ' + documentType + '\nNúmero de documento: ' + documentValue);
}

function applyFilter() {
    // Obteniendo valores del formulario
    var action = [];
    if (document.getElementById('Create').checked) action.push('create');
    if (document.getElementById('Update').checked) action.push('update');
    if (document.getElementById('Delete').checked) action.push('delete');

    var startDate = document.getElementById('startDate').value;
    var endDate = document.getElementById('endDate').value;
    var tipoDocumento = document.getElementById('documentType').value;
    var nroDocumento = document.getElementById('documentSearch').value;

    // Construyendo la URL con los parámetros de filtro
    var url = new URL('http://localhost:3015/logs/');
    var params = { action: action.join(','), startDate, endDate, tipoDocumento, nroDocumento: nroDocumento };
    Object.keys(params).forEach(key => params[key] && url.searchParams.append(key, params[key]));

    // Fetch con los parámetros de filtro
    fetch(url, {
        method: 'GET'
    })
        .then(response => {
            if (!response.ok) {
                if (response.status === 503) {  // Suponiendo que 503 Service Unavailable podría indicar problemas de BD
                    alert("El servicio de base de datos no está disponible");
                    throw new Error('Service unavailable');
                } else {
                    alert("Ha ocurrido un problema al cargar los datos.");
                    throw new Error('Network response was not ok');
                }
            }
            return response.json();
        })
        .then(data => {
            const tabla = document.querySelector('.section-1__viewlog tbody');
            tabla.innerHTML = ''; // Limpiar la tabla antes de añadir los nuevos resultados
            data.forEach(log => {
                console.log(log);
                const fila = document.createElement('tr');
                fila.innerHTML = `
                <td>${log.action}</td>
                <td>${new Date(log.timestamp).toLocaleDateString()}</td>
                <td>${log.nroDocumento}</td>
                <td>${log.tipoDocumento}</td>
            `;
                tabla.appendChild(fila);
            });
            alert('Filtros aplicados');
        })
        .catch(error => {
            alert('El servicio de logs no está disponible')
            console.error('Error al cargar los logs con filtros:', error)
        });

    toggleFilters(); // Opcional: cerrar el filtro después de aplicar
}

function clearFilters() {
    document.getElementById('filterForm').reset();
    console.log('Filtros limpiados');
    alert('Filtros limpiados');
    window.location.reload(); // Recargar la página para mostrar todos los logs
}







