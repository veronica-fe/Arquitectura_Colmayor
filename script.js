document.addEventListener("DOMContentLoaded", () => {
  const materias = document.querySelectorAll(".materia");
  const creditosAprobadosSpan = document.getElementById("creditos-aprobados");
  const resetButton = document.getElementById("resetear");
  const colorPickers = document.querySelectorAll(".color-picker");
  const root = document.documentElement;

  const temas = {
    "#d63384": ["#fff0f6", "#f8d7e6", "#f783ac", "#c2255c"], // rosa
    "#228be6": ["#e7f5ff", "#d0ebff", "#74c0fc", "#1c7ed6"], // azul
    "#f76707": ["#fff4e6", "#ffe8cc", "#ffa94d", "#f76707"], // naranja
    "#9c36b5": ["#f8f0fc", "#eebefa", "#da77f2", "#862e9c"], // morado
    "#212529": ["#343a40", "#495057", "#868e96", "#f8f9fa"]  // negro
  };

  function cambiarTema(color) {
    const [fondo, materia, borde, aprobada] = temas[color];
    root.style.setProperty("--color-principal", color);
    root.style.setProperty("--color-fondo", fondo);
    root.style.setProperty("--color-materia", materia);
    root.style.setProperty("--color-borde", borde);
    root.style.setProperty("--color-aprobada", aprobada);
    localStorage.setItem("tema", color);
  }

  function cargarTema() {
    const guardado = localStorage.getItem("tema");
    if (guardado && temas[guardado]) {
      cambiarTema(guardado);
    }
  }

  function cargarEstado() {
    const aprobadas = JSON.parse(localStorage.getItem("materiasAprobadas")) || [];
    materias.forEach(m => {
      if (aprobadas.includes(m.id)) {
        m.classList.add("aprobada");
      }
    });
  }

  function guardarEstado() {
    const aprobadas = Array.from(materias)
      .filter(m => m.classList.contains("aprobada"))
      .map(m => m.id);
    localStorage.setItem("materiasAprobadas", JSON.stringify(aprobadas));
  }

  function actualizarCreditos() {
    let total = 0;
    materias.forEach(m => {
      if (m.classList.contains("aprobada")) {
        total += parseInt(m.dataset.creditos || "0");
      }
    });
    creditosAprobadosSpan.textContent = total;
  }

  function desbloquearDependientes() {
    materias.forEach(materia => {
      const requisitos = materia.dataset.requiere?.split(" ");
      if (requisitos && requisitos.length > 0) {
        const cumplidos = requisitos.every(req => {
          const reqMateria = document.getElementById(req);
          return reqMateria && reqMateria.classList.contains("aprobada");
        });
        if (cumplidos) {
          materia.classList.remove("bloqueada");
          materia.disabled = false;
        } else {
          materia.classList.add("bloqueada");
          materia.disabled = true;
        }
      }
    });
  }

  materias.forEach(materia => {
    const requisitos = materia.dataset.requiere;
    if (requisitos) {
      materia.classList.add("bloqueada");
      materia.disabled = true;
    }

    materia.addEventListener("click", () => {
      if (materia.classList.contains("bloqueada")) return;

      materia.classList.toggle("aprobada");
      guardarEstado();
      desbloquearDependientes();
      actualizarCreditos();
    });
  });

  resetButton.addEventListener("click", () => {
    localStorage.removeItem("materiasAprobadas");
    materias.forEach(m => m.classList.remove("aprobada"));
    desbloquearDependientes();
    actualizarCreditos();
  });

  colorPickers.forEach(picker => {
    picker.addEventListener("click", () => {
      const color = picker.dataset.color;
      cambiarTema(color);
    });
  });

  cargarTema();
  cargarEstado();
  desbloquearDependientes();
  actualizarCreditos();
});
