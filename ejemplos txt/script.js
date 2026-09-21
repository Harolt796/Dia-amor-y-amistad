document.addEventListener('DOMContentLoaded', () => {
    const planetas = document.querySelectorAll('.planeta');
    const modal = document.getElementById('modal');
    const modalImg = document.getElementById('modal-img');
    const modalTitulo = document.getElementById('modal-titulo');
    const modalMensaje = document.getElementById('modal-mensaje');
    const cerrarBtn = document.querySelector('.cerrar');
    const musica = document.getElementById('musica');
    
    let musicaIniciada = false;

    // Función para abrir el modal
    function abrirModal(planeta) {
        const imgSrc = planeta.getAttribute('data-img');
        const titulo = planeta.getAttribute('data-titulo');
        const mensaje = planeta.getAttribute('data-mensaje');

        modalImg.src = imgSrc;
        modalTitulo.textContent = titulo;
        modalMensaje.textContent = mensaje;

        modal.classList.add('mostrar');

        // Iniciar música en el primer clic (política de navegadores)
        if (!musicaIniciada) {
            musica.play().catch(error => console.log("El navegador bloqueó el audio automático."));
            musicaIniciada = true;
        }
    }

    // Agregar evento de clic a cada planeta
    planetas.forEach(planeta => {
        planeta.addEventListener('click', () => abrirModal(planeta));
    });

    // Cerrar el modal al hacer clic en la X
    cerrarBtn.addEventListener('click', () => {
        modal.classList.remove('mostrar');
    });

    // Cerrar el modal al hacer clic fuera de la caja de contenido
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('mostrar');
        }
    });
});
