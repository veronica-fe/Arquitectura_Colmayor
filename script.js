
document.addEventListener("DOMContentLoaded", () => {
  const materias = document.querySelectorAll(".materia");

  materias.forEach((materia) => {
    const requisito = materia.dataset.requiere;
    if (requisito) {
      materia.classList.add("bloqueada");
      materia.disabled = true;
    }

    materia.addEventListener("click", () => {
      if (materia.classList.contains("bloqueada")) return;

      materia.classList.toggle("aprobada");

      if (materia.classList.contains("aprobada")) {
        desbloquearDependientes(materia.id);
      } else {
        bloquearDependientes(materia.id);
      }
    });
  });

  function desbloquearDependientes(id) {
    document.querySelectorAll(`[data-requiere]`).forEach((materia) => {
      const requisitos = materia.dataset.requiere.split(" ");
      if (requisitos.every(req => document.getElementById(req)?.classList.contains("aprobada"))) {
        materia.classList.remove("bloqueada");
        materia.disabled = false;
      }
    });
  }

  function bloquearDependientes(id) {
    document.querySelectorAll(`[data-requiere]`).forEach((materia) => {
      const requisitos = materia.dataset.requiere.split(" ");
      if (requisitos.includes(id)) {
        materia.classList.add("bloqueada");
        materia.disabled = true;
        materia.classList.remove("aprobada");
        bloquearDependientes(materia.id);
      }
    });
  }
});
