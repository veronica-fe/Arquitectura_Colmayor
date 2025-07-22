document.addEventListener("DOMContentLoaded", () => {
  const materias = document.querySelectorAll(".materia");
  const creditosAprobadosSpan = document.getElementById("creditos-aprobados");
  const resetButton = document.getElementById("resetear");
  const colorButtons = document.querySelectorAll(".color-picker");
  const body = document.body;

  function cargarEstado() {
    const aprobadas = JSON.parse(localStorage.getItem("materiasAprobadas")) || [];
    materias.forEach(m => {
      if (aprobadas.includes(m.id)) m.classList.add("aprobada");
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

  function desbloquearMaterias() {
    materias.forEach(m => {
      const reqs = m.dataset.requiere?.split(" ") || [];
      const ok = reqs.every(id => {
        const r = document.getElementById(id);
        return r && r.classList.contains("aprobada");
      });
      if (reqs.length && !ok) {
        m.classList.add("bloqueada");
      } else {
        m.classList.remove("bloqueada");
      }
    });
  }

  materias.forEach(m => {
    m.addEventListener("click", () => {
      if (m.classList.contains("bloqueada")) return;
      m.classList.toggle("aprobada");
      guardarEstado();
      desbloquearMaterias();
      actualizarCreditos();
    });
  });

  resetButton.addEventListener("click", () => {
    localStorage.removeItem("materiasAprobadas");
    materias.forEach(m => m.classList.remove("aprobada"));
    desbloquearMaterias();
    actualizarCreditos();
  });

  colorButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const tema = btn.dataset.tema;
      localStorage.setItem("temaColor", tema);
      body.setAttribute("data-tema", tema);
    });
  });

  const savedTema = localStorage.getItem("temaColor") || "rosa";
body.setAttribute("data-tema", savedTema);
  cargarEstado();
  desbloquearMaterias();
  actualizarCreditos();
});
