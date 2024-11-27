const botonMostrarFormulario = document.getElementById('create_btn');
const formulario = document.getElementById('formulario');
const cerrarFormulario = document.getElementById('formulario__cerrar');



formulario.addEventListener('submit', function (event) {
    event.preventDefault(); // Siempre prevenir el envío estándar
    if (validarFormulario()) {
        enviarDatosAlBackend();
    }
});

document.addEventListener('DOMContentLoaded', function () {
    fetch('http://localhost:3005/consultar/users', {  // Asegúrate de que esta URL sea correcta
        method: 'GET'
    })
        .then(response => {
            if (!response.ok) {
                if (response.status === 503) {  // Suponiendo que 503 Service Unavailable podría indicar problemas de BD
                    alert("El servicio de base de datos no está disponible");
                    throw new Error('Service unavailable');
                } else {
                    alert("El servicio de consultar no está activo");
                    throw new Error('Network response was not ok');
                }
            }
            return response.json();
        })
        .then(data => {
            const tabla = document.querySelector('.section-1__viewusers tbody');
            data.forEach(usuario => {
                const fila = document.createElement('tr');
                console.log("Hola", usuario);
                const celdaFoto = usuario.foto ? `<img src="${usuario.foto}" alt="Foto de Perfil" style="width: 50px; height: auto;">` : '';
                const botonEditar = `<button data-documento="${usuario.nroDocumento}" class="edit-btn action">Editar</button>`;
                const botonEliminar = `<button data-documento="${usuario.nroDocumento}" class="delete-btn action">Eliminar</button>`;
                fila.innerHTML = `
                <td>${usuario.tipoDocumento}</td>
                <td><a href="perfil.html?nroDocumento=${usuario.nroDocumento}">${usuario.nroDocumento}</a></td>
                <td>${usuario.primerNombre}</td>
                <td>${usuario.apellidos}</td>
                <td class="aaaa">${botonEditar}${botonEliminar}</td>
            `;
                tabla.appendChild(fila);
            });
        })
        .catch(error => {
            alert('El servicio de consultar no está disponible');
            console.error('Error al cargar los usuarios:', error)
        });
});

document.addEventListener('click', function (event) {
    if (event.target.classList.contains('edit-btn')) {
        const nroDocumento = event.target.getAttribute('data-documento');
        cargarUsuarioEnFormulario(nroDocumento);
    } else {
        if (event.target.classList.contains('delete-btn')) {
            const nroDocumento = event.target.getAttribute('data-documento');
            eliminarUsuario(nroDocumento);
        }
    }
});

document.getElementById('searchBtn').addEventListener('click', function () {
    const nroDocumento = document.getElementById('searchInput').value.trim();
    if (nroDocumento) {

        fetch(`http://localhost:3005/consultar/users/${nroDocumento}`, {
            method: 'GET'
        })
            .then(response => {
                if (!response.ok) {
                    if (response.status === 503) {  // Suponiendo que 503 Service Unavailable podría indicar problemas de BD
                        alert("El servicio de base de datos no está disponible");
                        throw new Error('Service unavailable');
                    } else {
                        alert('Usuario no encontrado');
                        throw new Error('No se pudo realizar la búsqueda');
                    }
                }
                return response.json();
            })
            .then(usuario => {
                const tabla = document.querySelector('.section-1__viewusers tbody');
                tabla.innerHTML = '';  // Limpia la tabla actual
                console.log(usuario);
                agregarUsuarioATabla(usuario);  // Añade el usuario encontrado a la tabla
                document.getElementById('loadAllBtn').style.display = 'inline';
            })
            .catch(error => {
                alert('El servicio de consultar no está disponible')
                console.error('Error al buscar el usuario:', error);
            });
    } else {
        alert('Por favor, ingrese un número de documento para buscar.');
    }
});

document.getElementById('loadAllBtn').addEventListener('click', function () {
    window.location.reload();
    //this.style.display = 'none';  // Opcionalmente ocultar el botón después de cargar todos
});
function enviarDatosAlBackend() {
    const formulario = document.getElementById('formulario');
    const formData = new FormData();
    const datosUsuario = {
        primerNombre: document.getElementById('1nombre').value.trim(),
        segundoNombre: document.getElementById('2nombre').value.trim(),
        apellidos: document.getElementById('apellido').value.trim(),
        fechaNacimiento: new Date(document.getElementById('nacimiento').value.trim()),
        genero: document.getElementById('genero').value.trim(),
        correoElectronico: document.getElementById('email').value.trim(),
        celular: document.getElementById('tel').value.trim(),
        nroDocumento: document.getElementById('documento').value.trim(),
        tipoDocumento: document.getElementById('tipodoc').value.trim(),
        foto: document.getElementById('foto').files[0] ? document.getElementById('foto').files[0] : "" // Asegúrate de manejar la carga de archivos adecuadamente si es necesario
    };
    Object.keys(datosUsuario).forEach((key) => {
        formData.append(key, datosUsuario[key]);
    });

    fetch('http://localhost:3010/crear/', {
        method: 'POST',
        body: formData // Nota: no se establece el 'Content-Type' cuando se usa FormData
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
            return response.json()
        })
        .then(data => {
            console.log('Usuario creado:', data);
            alert('Usuario creado con éxito');
            formulario.style.display = 'none';  // Ocultar el formulario después de enviar los datos
            formulario.reset();  // Limpiar el formulario
            agregarUsuarioATabla(data);
             // Redirigir al perfil del usuario recién creado
            const nroDocumento = data.nroDocumento; // Supongamos que la respuesta tiene el nroDocumento
            window.location.href = `perfil.html?nroDocumento=${nroDocumento}`;
        })
        .catch(error => {
            alert('El servicio de crear no está disponible');
            console.error('Error al crear usuario:', error)
        });
}

function agregarUsuarioATabla(usuario) {
    const tabla = document.querySelector('.section-1__viewusers tbody');
    const fila = document.createElement('tr');

    // Generar contenido de la celda de la foto, sólo si hay una foto disponible
    const celdaFoto = usuario.foto ? `<img src="${usuario.foto}" alt="Foto de Perfil" style="width: 50px; height: auto;">` : '';
    const botonEditar = `<button data-documento="${usuario.nroDocumento}" class="edit-btn action">Editar</button>`;
    const botonEliminar = `<button data-documento="${usuario.nroDocumento}" class="delete-btn action">Eliminar</button>`;
    // Crear cada celda y añadirla a la fila
    fila.innerHTML = `
        <td>${usuario.tipoDocumento}</td>
        <td><a href="perfil.html?nroDocumento=${usuario.nroDocumento}">${usuario.nroDocumento}</a></td>
        <td>${usuario.primerNombre}</td>
        <td>${usuario.apellidos}</td>
        <td class="aaaa">${botonEditar}${botonEliminar}</td>
    `;

    // Añadir la fila a la tabla
    tabla.appendChild(fila);
}


function cargarUsuarioEnFormulario(nroDocumento) {
    // Verificar si el servicio de consulta está disponible
    fetch('http://localhost:3010/crear/status', { method: 'GET' })
        .then(response => {
            if (!response.ok) {
                throw new Error('El servicio de actualizar no está disponible en este momento.');
            }
            // Si el servicio de consulta está disponible, proceder a obtener el usuario
            return fetch(`http://localhost:3005/consultar/users/${nroDocumento}`, {
                method: 'GET'
            });
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo obtener la información del usuario.');
            }
            return response.json();
        })
        .then(usuario => {
            // Cargar datos en el formulario para editar
            document.getElementById('documento').value = usuario.nroDocumento;
            document.getElementById('1nombre').value = usuario.primerNombre;
            document.getElementById('2nombre').value = usuario.segundoNombre || '';
            document.getElementById('apellido').value = usuario.apellidos;
            document.getElementById('nacimiento').value = usuario.fechaNacimiento.slice(0, 10);
            document.getElementById('genero').value = usuario.genero;
            document.getElementById('email').value = usuario.correoElectronico;
            document.getElementById('tel').value = usuario.celular;
            document.getElementById('tipodoc').value = usuario.tipoDocumento;

            // Cambiar el botón de envío a modo "Editar"
            const formButton = document.getElementById('formButton');
            formButton.textContent = 'Editar';
            formButton.classList.remove('formulario__submit');
            formButton.classList.add('formulario__edit');
            formButton.onclick = function (event) {
                event.preventDefault();
                actualizarDatosUsuario(usuario.nroDocumento);
            };

            // Mostrar el formulario
            formulario.style.display = 'block';
            setTimeout(() => formulario.classList.add('show'), 50);
        })
        .catch(error => {
            console.error('Error al cargar el usuario:', error);
            alert('El servicio de actualizar no está disponible en este momento.');
        });
}


function eliminarUsuario(nroDocumento) {
    if (confirm("¿Estás seguro de que quieres eliminar este usuario?")) {
        fetch(`http://localhost:3010/crear/${nroDocumento}`, {
            method: 'DELETE'
        })
            .then(response => {
                console.log(response);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json(); // o response.json() si el servidor responde con JSON
            })
            .then(data => {
                console.log('Usuario eliminado:', data);
                alert('Usuario eliminado con éxito');
                window.location.reload();
            })
            .catch(error => {
                alert('El servicio de eliminar no está disponible');
                console.error('Error al eliminar el usuario:', error)
            });
    }
}

function actualizarDatosUsuario(nroDocumento) {
    // Recoger datos del formulario
    const datosUsuario = {
        primerNombre: document.getElementById('1nombre').value.trim(),
        segundoNombre: document.getElementById('2nombre').value.trim(),
        apellidos: document.getElementById('apellido').value.trim(),
        fechaNacimiento: new Date(document.getElementById('nacimiento').value.trim()),
        genero: document.getElementById('genero').value.trim(),
        correoElectronico: document.getElementById('email').value.trim(),
        celular: document.getElementById('tel').value.trim(),
        nroDocumento: document.getElementById('documento').value.trim(),
        tipoDocumento: document.getElementById('tipodoc').value.trim(),
        foto: document.getElementById('foto').files[0] //? document.getElementById('foto').files: "" // Asegúrate de manejar la carga de archivos adecuadamente si es necesario
    };

    fetch(`http://localhost:3010/crear/${nroDocumento}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosUsuario)
    })
        .then(response => response.json())
        .then(data => {
            console.log('Usuario actualizado:', data);
            alert('Usuario actualizado con éxito');
            formulario.style.display = 'none';  // Ocultar el formulario
            formulario.reset();  // Limpiar el formulario
            window.location.reload();  // Recargar la página para mostrar los cambios
            //actualizarVistaUsuario(data);  // Actualizar la fila del usuario en la tabla
        })
        .catch(error => {
            alert('El servicio de actualizar no está disponible');
            console.error('Error al actualizar el usuario:', error)
        });
}

function actualizarVistaUsuario(usuario) {
    const fila = document.querySelector(`tr[data-documento="${usuario.nroDocumento}"]`);
    if (fila) {
        fila.innerHTML = `
            <td>${usuario.tipoDocumento}</td>
            <td><a href="perfil.html?nroDocumento=${usuario.nroDocumento}">${usuario.nroDocumento}</a></td>
            <td>${usuario.primerNombre}</td>
            <td>${usuario.apellidos}</td>
            <td class="aaaa">${botonEditar}${botonEliminar}</td>
        `;
    }
}


function validarFormulario() {
    let valido = true;
    var numeroRegex = /^[0-9]{1,10}$/;
    var letrasRegex = /^[A-Za-z]{1,30}$/;
    var apellidoRegex = /^[A-Za-z]{1,30}(?:\s[A-Za-z]{1,30})?$/;

    var nombre2Regex = /^[A-Za-z]*$/;

    const input = document.getElementById('foto');
    const file = input.files[0];
    if (file) {
        const maxSize = 2 * 1024 * 1024; // 2MB
        if (file.size > maxSize) {
            document.getElementById('errorImagen').textContent = 'La imagen es demasiado grande (máximo 2MB)';
            valido = false;
        } else {
            document.getElementById('errorImagen').textContent = '';
        }
    }

    const tipdoc = document.getElementById('tipodoc').value.trim();
    const errortDoc = document.getElementById('errortDoc');
    if (tipdoc === '') {
        errortDoc.textContent = 'Selecciona el tipo documento';
        valido = false;
    } else {
        errortDoc.textContent = '';
    }

    const documento = document.getElementById('documento').value.trim();
    const errorDoc = document.getElementById('errorDoc');

    if (documento === '') {
        errorDoc.textContent = 'Ingresa tu documento';
        valido = false;
    } else if (!documento.match(numeroRegex)) {
        errorDoc.textContent = 'El documento debe contener solo números';
        valido = false;
    } else {
        errorDoc.textContent = '';
    }

    const nombre = document.getElementById('1nombre').value.trim();
    const errorNombre = document.getElementById('error1Nombre');
    if (nombre === '') {
        errorNombre.textContent = 'Ingresa tu nombre';
        valido = false;
    } else if (!nombre.match(letrasRegex)) {
        errorNombre.textContent = 'El nombre debe contener solo letras';
        valido = false;
    } else {
        errorNombre.textContent = '';
    }

    const segundoNombre = document.getElementById('2nombre').value.trim();
    const error2Nombre = document.getElementById('error2Nombre');
    if (segundoNombre === '') {

    } else if (!segundoNombre.match(letrasRegex)) {
        error2Nombre.textContent = 'El nombre debe contener solo letras';
        valido = false;
    } else {
        errorNombre.textContent = '';
    }

    const apellido = document.getElementById('apellido').value.trim();
    const errorApellido = document.getElementById('errorApellido');
    if (apellido === '') {
        errorApellido.textContent = 'Ingresa tu apellido';
        valido = false;
    } else if (!apellido.match(apellidoRegex)) {
        errorApellido.textContent = 'El apellido debe contener solo letras';
        valido = false;
    } else {
        errorApellido.textContent = '';
    }

    const fecha = document.getElementById('nacimiento').value.trim();
    const errorFecha = document.getElementById('errorFecha');
    if (fecha === '') {
        errorFecha.textContent = 'Debe ingresar una fecha';
        valido = false;
    } else {
        errorFecha.textContent = '';
    }

    const email = document.getElementById('email').value.trim();
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const errorEmail = document.getElementById('errorEmail');
    if (email === '') {
        errorEmail.textContent = 'Debe ingresar un email';
        valido = false;
    } else if (!regex.test(email)) {
        errorEmail.textContent = 'Formato de correo electrónico inválido';
        valido = false;
    } else {
        errorEmail.textContent = '';
    }

    const genero = document.getElementById('genero').value.trim();
    const errorGen = document.getElementById('errorGen');
    if (genero === '') {
        errorGen.textContent = 'Selecciona el género';
        valido = false;
    } else {
        errorGen.textContent = '';
    }

    const tel = document.getElementById('tel').value.trim();
    const errorCel = document.getElementById('errorCel');
    var  celRegex = /^[0-9]{10}$/;

    if (tel === '') {
        errorCel.textContent = 'Debe ingresar un celular';
        valido = false;
    } else if (!tel.match(celRegex)) {
        errorCel.textContent = 'El celular debe contener solo números';
        valido = false;
    } else {
        errorCel.textContent = '';
    }

    return valido;
}

botonMostrarFormulario.addEventListener('click', function () {
    // Verificar disponibilidad del servicio
    fetch('http://localhost:3010/crear/status')
        .then(response => {
            if (!response.ok) {
                throw new Error('Servicio no disponible');
            }
            return response.json();
        })
        .then(() => {
            // Si el servicio está disponible, mostrar el formulario
            formulario.style.display = 'block'; // Mostrar el formulario
            setTimeout(function () {
                formulario.classList.add('show'); // Hacer fade in
            }, 50);
        })
        .catch(error => {
            console.error('Error de servicio:', error);
            alert('El servicio no está disponible en este momento. Por favor, inténtalo más tarde.');
        });
});

cerrarFormulario.addEventListener('click', function () {
    formulario.classList.remove('show'); // Hacer fade out
    setTimeout(function () {
        formulario.style.display = 'none'; // Ocultar el formulario después de la animación
        document.getElementById('errorImagen').textContent = '';
        document.getElementById('errortDoc').textContent = '';
        document.getElementById('errorDoc').textContent = '';
        document.getElementById('error1Nombre').textContent = '';
        document.getElementById('error2Nombre').textContent = '';
        document.getElementById('errorApellido').textContent = '';
        document.getElementById('errorFecha').textContent = '';
        document.getElementById('errorEmail').textContent = '';
        document.getElementById('errorGen').textContent = '';
        document.getElementById('errorCel').textContent = '';
    }, 500); // Esperar a que termine la animación (0.5 segundos)
});

function limitarLongitud(campo, maxLength) {
    campo.addEventListener('input', function () {
        if (campo.value.length > maxLength) {
            campo.value = campo.value.slice(0, maxLength); // Limitar a maxLength caracteres
        }
    });
}

const campo1 = document.getElementById('documento');
const campo2 = document.getElementById('1nombre');
const campo3 = document.getElementById('2nombre');
const campo4 = document.getElementById('apellido');
const campo5 = document.getElementById('tel');

limitarLongitud(campo1, campo1.getAttribute.maxLength);
limitarLongitud(campo2, campo2.getAttribute.maxLength);
limitarLongitud(campo3, campo3.getAttribute.maxLength);
limitarLongitud(campo4, campo4.getAttribute.maxLength);
limitarLongitud(campo5, campo5.getAttribute.maxLength);

// function toggleFilters() {
//     var filterContainer = document.getElementById('filterContainer');
//     if (filterContainer.style.display === "none") {
//         filterContainer.style.display = "block";
//     } else {
//         filterContainer.style.display = "none";
//     }
// }

function searchDocument() {
    var documentType = document.getElementById('documentType').value;
    var documentValue = document.getElementById('documentSearch').value;
    console.log('Búsqueda por documento: Tipo - ' + documentType + ', Número - ' + documentValue);
    alert('Búsqueda por tipo de documento: ' + documentType + '\nNúmero de documento: ' + documentValue);
}

function applyFilter() {
    // Obtener valores de los filtros
    var generos = [];
    ['Masculino', 'Femenino', 'No binario', 'NA'].forEach(genero => {
        const checkbox = document.getElementById(genero);
        if (checkbox && checkbox.checked) {
            generos.push(genero);
        }
    });

    var tipoDocumento = document.getElementById('documentType').value;

    // Construir la URL con parámetros de consulta
    var url = new URL('http://localhost:3005/consultar/users'); // Cambia a tu URL real
    if (generos.length > 0) url.searchParams.append('genero', generos.join(','));
    if (tipoDocumento && tipoDocumento.trim() !== '') url.searchParams.append('tipoDocumento', tipoDocumento);

    // Mostrar URL generada para depuración
    console.log('URL generada:', url.toString());

    // Realizar la solicitud fetch
    fetch(url, { method: 'GET' })
        .then(response => {
            if (!response.ok) {
                if (response.status === 503) {  // Suponiendo que 503 Service Unavailable podría indicar problemas de BD
                    alert("El servicio de base de datos no está disponible");
                    throw new Error('Service unavailable');
                } else {
                    alert("El servicio de consultar no está activo");
                    throw new Error('Network response was not ok');
                }
            }
            return response.json();
        })
        .then(data => {
            // Limpiar la tabla y mostrar resultados
            const tabla = document.querySelector('.section-1__viewusers tbody');
            tabla.innerHTML = ''; // Limpiar la tabla antes de añadir los nuevos resultados
            if (data.length > 0) {
                data.forEach(usuario => {
                    const fila = document.createElement('tr');
                    const celdaFoto = usuario.foto ? `<img src="${usuario.foto}" alt="Foto de Perfil" style="width: 50px; height: auto;">` : '';
                    const botonEditar = `<button data-documento="${usuario.nroDocumento}" class="edit-btn action">Editar</button>`;
                    const botonEliminar = `<button data-documento="${usuario.nroDocumento}" class="delete-btn action">Eliminar</button>`;
                    fila.innerHTML = `
                        <td>${usuario.tipoDocumento}</td>
                        <td><a href="perfil.html?nroDocumento=${usuario.nroDocumento}">${usuario.nroDocumento}</a></td>
                        <td>${usuario.primerNombre}</td>
                        <td>${usuario.apellidos}</td>
                        <td class="aaaa">${botonEditar}${botonEliminar}</td>
                    `;
                    tabla.appendChild(fila);
                });
            } else {
                alert('No se encontraron usuarios con los filtros seleccionados');
            }
        })
        .catch(error => {
            alert('El servicio de consultar no está disponible');
            console.error('Error al cargar los usuarios:', error);
        });
}

function clearFilters() {
    document.getElementById('filterForm').reset();
    console.log('Filtros limpiados');
    alert('Filtros limpiados');
    window.location.reload();
}
