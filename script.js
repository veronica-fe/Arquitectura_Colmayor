document.addEventListener("DOMContentLoaded", () => {
  const materias = document.querySelectorAll(".materia");
  const creditosAprobadosSpan = document.getElementById("creditos-aprobados");
  const resetButton = document.getElementById("resetear");
  const colorButtons = document.querySelectorAll(".color-picker");
  const root = document.documentElement;

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
    localStorage.removeItem("temaColor");
    materias.forEach(m => {
      m.classList.remove("aprobada");
    });
    desbloquearDependientes();
    actualizarCreditos();
    location.reload(); // refresca para aplicar el color por defecto
  });

  colorButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const color = btn.dataset.color;
      root.style.setProperty("--color-principal", color);
      localStorage.setItem("temaColor", color);
    });
  });

  function aplicarTemaGuardado() {
    const color = localStorage.getItem("temaColor");
    if (color) {
      root.style.setProperty("--color-principal", color);
    }
  }

  cargarEstado();
  desbloquearDependientes();
  actualizarCreditos();
  aplicarTemaGuardado();
});
