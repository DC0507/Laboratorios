// importamos el cliente de Supabase para interactuar con la base de datos
// este cliente ya está configurado con la URL y la clave de acceso a nuestra instancia de Supabase
import { supabase } from "./supabase.js";

// obtenemos referencias a los elementos del DOM que vamos a usar
const btnClean = document.getElementById("btnClean");
const btnAdd = document.getElementById("btnAdd");
const btnCancel = document.getElementById("btnCancel");
const btnLoad = document.getElementById("btnLoad");
const txtSearch = document.getElementById("txtSearch");
//Formulario
const txtNombre = document.getElementById("txtNombre");
const txtApellido = document.getElementById("txtApellido");
const txtCorreo = document.getElementById("txtCorreo");
const txtCarrera = document.getElementById("txtCarrera");
// Tabla
const tbody = document.getElementById("tbodyStudents");

//window.addEventListener("load", () => consultarEstudiantes());
btnLoad.addEventListener("click", async () => consultarEstudiantes());
btnAdd.addEventListener("click", async () => guardarEstudiante());

// funcion de flecha
// const consultarEstudiantes = async () => {};
// funcion tradicional
// function consultarEstudiantes() {}

// let y const
// let x = 10;
// x = 20;
// const y = 30;
// y = 40; // error, no se puede reasignar una constante
// var z = 50;
// var z = 60; // no error, var permite redeclarar la misma variable

const consultarEstudiantes = async () => {
  // usamos el cliente de Supabase para hacer una consulta a la tabla "estudiantes"
  // json: {"data": [], "error": null}
  const search = txtSearch.value.trim() || ""; // si el valor es vacio, se asigna una cadena vacía
  let query = supabase
    .from("estudiantes")
    .select("id,nombre,apellido,correo,carrera");

  // SEBASTIAN JESUS
  if (search.length > 0) {
    query = query.or(`nombre.ilike.%${search}%,apellido.ilike.%${search}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error(error);
    alert("Error cargando estudiantes");
    return;
  }

  tbody.innerHTML = "";

  // data es un arreglo de objetos, cada objeto representa un estudiante
  data.forEach((r) => {
    const tr = document.createElement("tr");
    tr.setAttribute("data-id", r.id);
    tr.innerHTML = `
        <!--td>${r.id ?? ""}</td-->
        <td>${r.nombre ?? ""}</td>
        <td>${r.apellido ?? ""}</td>
        <td>${r.correo ?? ""}</td>
        <td>${r.carrera ?? ""}</td>
        <td>
          <button class="btnActualizar" data-id="${r.id}">Actualizar</button>
          <button class="btnEliminar" data-id="${r.id}">Eliminar</button>
        </td>
      `;

    tbody.appendChild(tr);
  });
};

const guardarEstudiante = async () => {
  if (
    txtNombre.value.trim() === "" ||
    txtApellido.value.trim() === "" ||
    txtCorreo.value.trim() === "" ||
    txtCarrera.value.trim() === ""
  ) {
    alert("Por favor, complete todos los campos");
    return;
  }

  const estudiante = {
    nombre: txtNombre.value.trim(),
    apellido: txtApellido.value.trim(),
    correo: txtCorreo.value.trim(),
    carrera: txtCarrera.value.trim(),
  };
  
  let query = supabase.from("estudiantes").insert(estudiante);
  const { data, error } = await query;

  if (error) {
    console.error(error);
    alert("Error guardando estudiante");
    return;
  }
  alert("Estudiante guardado exitosamente");
  txtNombre.value = "";
  txtApellido.value = "";
  txtCorreo.value = "";
  txtCarrera.value = "";
  consultarEstudiantes();
};

const eliminarEstudiante = async (id) => {
  if (!confirm("¿Está seguro de eliminar este estudiante?")) {
    return;
  }
  const { data, error } = await supabase.from("estudiantes").delete().eq("id", id);

  if (error) {
    console.error(error);
    alert("Error eliminando estudiante");
    return;
  }
  alert("Estudiante eliminado exitosamente");
  consultarEstudiantes();
};

tbody.addEventListener("click", (e) => {
  if (e.target.classList.contains("btnEliminar")) {
    const id = e.target.getAttribute("data-id");
    eliminarEstudiante(id);
  }
});
