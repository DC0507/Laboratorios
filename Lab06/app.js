// importamos el cliente de Supabase para interactuar con la base de datos
// este cliente ya está configurado con la URL y la clave de acceso a nuestra instancia de Supabase
import { supabase } from "./supabase.js";

//****************************************
// Referencias a elementos del DOM
//****************************************
// Botones
const btnClear = document.getElementById("btnClear");
const btnAdd = document.getElementById("btnAdd");
const btnCancel = document.getElementById("btnCancel");
const btnLoad = document.getElementById("btnLoad");
// Campo de búsqueda
const txtSearch = document.getElementById("txtSearch");
//Formulario
const tituloForm = document.getElementById("tituloForm");
const txtId = document.getElementById("txtId");
const txtNombre = document.getElementById("txtNombre");
const txtApellido = document.getElementById("txtApellido");
const txtCorreo = document.getElementById("txtCorreo");
const txtCarrera = document.getElementById("txtCarrera");
const txtFechaNac = document.getElementById("txtFechaNac");
// Tabla
const tbody = document.getElementById("tbodyStudents");

//Consultar estudiantes al cargar la página
window.onload = () => {
  consultarEstudiantes();
};
//****************************************
//Eventos
//****************************************
btnLoad.addEventListener("click", async () => consultarEstudiantes());
btnAdd.addEventListener("click", async () => guardarEstudiante());
btnClear.addEventListener("click", async () => {
  txtSearch.value = "";
  await consultarEstudiantes();
});
btnCancel.addEventListener("click", async () => limpiarFormulario());
tbody.addEventListener("click", async (e) => {
  if (e.target.classList.contains("btnEliminar")) {
    const id = e.target.getAttribute("data-id");
    await eliminarEstudiante(id);
  }
});
tbody.addEventListener("click", async (e) => {
  if (e.target.classList.contains("btnEditar")) {
    const id = e.target.getAttribute("data-id");
    const { data, error } = await supabase
      .from("estudiantes")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al cargar estudiante'
      });
      return;
    } else {
      txtNombre.value = data.nombre ?? "";
      txtApellido.value = data.apellido ?? "";
      txtCorreo.value = data.correo ?? "";
      txtCarrera.value = data.carrera ?? "";
      txtFechaNac.value = data.birthdate ?? "";
    }
    btnAdd.textContent = "Actualizar";
    tituloForm.textContent = "Editar Estudiante";
    txtId.value = id;

    // Scroll to the form
    document.getElementById("header").scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }
});

//****************************************
//Funciones
//****************************************
const consultarEstudiantes = async () => {
  // usamos el cliente de Supabase para hacer una consulta a la tabla "estudiantes"
  // json: { "data": [], "error": null }
  const search = txtSearch.value.trim() || ""; // si el valor es vacío, se asigna una cadena vacía
  const query = supabase
    .from("estudiantes")
    .select("id,nombre,apellido,correo,carrera,birthdate");

  // SEBASTIAN JESUS
  if (search.length > 0) {
    // query.ilike("nombre", `%${search}%`);
    query.or(`nombre.ilike.%${search}%,apellido.ilike.%${search}%`);
  }
  const { data, error } = await query;

  if (error) {
    console.error(error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Error cargando estudiantes'
    });
    return;
  }

  // Limpiando y llenando la tabla con los datos obtenidos
  tbody.innerHTML = "";

  // data es un arreglo de objetos, cada objeto representa un estudiante
  data.forEach((r) => {
    const tr = document.createElement("tr"); //<tr></tr>
    tr.setAttribute("data-id", r.id);
    //<td>${r.id ?? ""}</td>
    tr.innerHTML = `
        <td>${r.nombre ?? ""}</td>
        <td>${r.apellido ?? ""}</td>
        <td>${r.correo ?? ""}</td>
        <td>${r.carrera ?? ""}</td>
        <td>${r.birthdate ?? ""}</td>
        <td>
          <button class="btnEditar" data-id="${r.id}">Editar</button>
          <button class="btnEliminar" data-id="${r.id}">Eliminar</button>
        </td>
      `;

    tbody.appendChild(tr);
  });
};

const guardarEstudiante = async () => {
  const estudiante = {
    nombre: txtNombre.value.trim(),
    apellido: txtApellido.value.trim(),
    correo: txtCorreo.value.trim(),
    carrera: txtCarrera.value.trim(),
    birthdate: txtFechaNac.value,
  };

  if (
    !estudiante.nombre ||
    !estudiante.apellido ||
    !estudiante.correo ||
    !estudiante.carrera ||
    !estudiante.birthdate
  ) {
    Swal.fire({
      icon: 'warning',
      title: 'Campos incompletos',
      text: 'Por favor, complete todos los campos'
    });
    return;
  }

  let result;
  let successMessage;

  try {
    if (txtId.value) {
      // Actualizar estudiante existente
      result = await supabase
        .from("estudiantes")
        .update(estudiante)
        .eq("id", txtId.value);
      successMessage = "Estudiante actualizado exitosamente";
    } else {
      // Insertar nuevo estudiante
      result = await supabase.from("estudiantes").insert([estudiante]);
      successMessage = "Estudiante guardado exitosamente";
    }

    const { error } = result;
    if (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Error de base de datos',
        text: txtId.value ? "Error actualizando estudiante" : "Error guardando estudiante"
      });
      return;
    }

    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: successMessage,
      timer: 2000,
      showConfirmButton: false
    });
    // Limpiar el formulario
    limpiarFormulario();
    consultarEstudiantes();
  } catch (err) {
    console.error(err);
    Swal.fire({
      icon: 'error',
      title: 'Error inesperado',
      text: err.message
    });
  }
};

const eliminarEstudiante = async (id) => {
  const result = await Swal.fire({
    title: '¿Está seguro?',
    text: '¿Está seguro de eliminar este estudiante?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  });

  if (!result.isConfirmed) return;

  const { error } = await supabase.from("estudiantes").delete().eq("id", id);

  if (error) {
    console.error(error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Error al eliminar'
    });
  } else {
    Swal.fire({
      icon: 'success',
      title: 'Eliminado',
      text: 'Estudiante eliminado exitosamente',
      timer: 1500,
      showConfirmButton: false
    });
    consultarEstudiantes();
  }
};

const limpiarFormulario = () => {
  txtId.value = "";
  txtNombre.value = "";
  txtApellido.value = "";
  txtCorreo.value = "";
  txtCarrera.value = "";
  txtFechaNac.value = "";
  if (btnAdd.textContent === "Actualizar") {
    btnAdd.textContent = "Agregar";
    tituloForm.textContent = "Agregar Estudiante";
  }
};
