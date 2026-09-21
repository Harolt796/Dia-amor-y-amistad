document.addEventListener('DOMContentLoaded', () => {
    const startScreen = document.getElementById('start-screen');
    const btnExplorar = document.getElementById('btn-explorar');
    const sistemaOrbital = document.getElementById('sistema-orbital');
    const orbita = document.getElementById('orbita');
    const espacioFondo = document.getElementById('espacio-fondo');
    const modal = document.getElementById('modal-planeta');
    const modalTitulo = document.getElementById('modal-titulo');
    const modalMensaje = document.getElementById('modal-mensaje');
    const cerrarBtn = document.querySelector('.cerrar');

    // --- 1. INICIAR EXPLORACIÓN ---
    btnExplorar.addEventListener('click', () => {
        startScreen.classList.add('oculto');
    });

    // --- 2. MOVIMIENTO ORBITAL (CARRUSEL) ---
    let isDragging = false;
    let startX;
    let currentRotation = 0;
    let startRotation = 0;

    sistemaOrbital.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
        startRotation = currentRotation;
        orbita.style.transition = 'none'; // Quitar transición para movimiento fluido
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const deltaX = e.clientX - startX;
        currentRotation = startRotation + (deltaX * 0.5); // 0.5 es la sensibilidad
        orbita.style.transform = `rotateY(${currentRotation}deg)`;
    });

    window.addEventListener('mouseup', () => {
        isDragging = false;
        orbita.style.transition = 'transform 0.1s linear'; // Devolver transición
    });

    // Soporte para pantallas táctiles (Móviles)
    sistemaOrbital.addEventListener('touchstart', (e) => {
        isDragging = true;
        startX = e.touches[0].clientX;
        startRotation = currentRotation;
        orbita.style.transition = 'none';
    });

    window.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const deltaX = e.touches[0].clientX - startX;
        currentRotation = startRotation + (deltaX * 0.5);
        orbita.style.transform = `rotateY(${currentRotation}deg)`;
    });

    window.addEventListener('touchend', () => {
        isDragging = false;
        orbita.style.transition = 'transform 0.1s linear';
    });

    // --- 3. INTERACCIÓN CON LOS PLANETAS (MENSAJES) ---
    const planetas = document.querySelectorAll('.planeta');
    const mensajes = {
        1: { titulo: "Amarillo como el Sol", texto: "Gracias por iluminar mis días con tu amistad. Eres esa persona que siempre está ahí para dar calor y alegría." },
        2: { titulo: "Azul como el Cielo", texto: "Nuestra amistad es tan grande e infinita como el cielo. Gracias por escucharme y apoyarme siempre." },
        3: { titulo: "Rosa como una Flor", texto: "Eres una persona única y especial. Me encanta compartir momentos contigo, ¡sonríe siempre!" },
        4: { titulo: "Verde como la Vida", texto: "Gracias por traer tanta energía positiva a mi vida. ¡Feliz Día de la Amistad y el Amor!" }
    };

    planetas.forEach(planeta => {
        planeta.addEventListener('click', (e) => {
            // Evitar que el clic se active si se está arrastrando
            if (Math.abs(currentRotation - startRotation) > 5) return;

            const id = planeta.getAttribute('data-id');
            modalTitulo.textContent = mensajes[id].titulo;
            modalMensaje.textContent = mensajes[id].texto;
            modal.classList.add('mostrar');
        });
    });

    cerrarBtn.addEventListener('click', () => modal.classList.remove('mostrar'));
    window.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('mostrar'); });

    // --- 4. AMBIENTE ALEATORIO (FLORES, NAVES, ALIENS) ---
    const emojisFlores = ['🌻', '🌼', '🌟', '✨'];

    function crearAmbiente() {
        // Crear Flor
        const flor = document.createElement('div');
        flor.classList.add('flor');
        flor.textContent = emojisFlores[Math.floor(Math.random() * emojisFlores.length)];
        flor.style.left = `${Math.random() * 100}vw`;
        flor.style.top = `${Math.random() * 100}vh`;
        flor.style.animationDuration = `${4 + Math.random() * 4}s`;
        espacioFondo.appendChild(flor);
        setTimeout(() => flor.remove(), 8000);

        // Crear Nave o Alien
        if (Math.random() > 0.3) { // 70% de probabilidad
            const esNave = Math.random() > 0.5;
            const entidad = document.createElement('div');
            entidad.classList.add(esNave ? 'nave-aleatoria' : 'alien-aleatorio');
            entidad.textContent = esNave ? '🚀' : '👽';
            entidad.style.left = `${Math.random() * 100}vw`;
            entidad.style.top = `${Math.random() * 100}vh`;

            espacioFondo.appendChild(entidad);

            // Mover en dirección aleatoria
            const duracion = 2 + Math.random() * 3;
            const dirX = (Math.random() - 0.5) * 50; // vw
            const dirY = (Math.random() - 0.5) * 50; // vh

            entidad.animate([
                { transform: `translate(0, 0)` },
                { transform: `translate(${dirX}vw, ${dirY}vh)` }
            ], { duration: duracion * 1000, easing: 'linear' });

            // Disparar Láser aleatorio
            setTimeout(() => {
                if (Math.random() > 0.5) {
                    const laser = document.createElement('div');
                    laser.classList.add('laser-random');
                    laser.style.left = entidad.style.left;
                    laser.style.top = entidad.style.top;
                    laser.style.width = `${50 + Math.random() * 100}px`;
                    laser.style.transform = `rotate(${Math.random() * 360}deg)`;
                    if (!esNave) {
                        laser.style.background = '#00ffff';
                        laser.style.boxShadow = '0 0 10px #00ffff';
                    }
                    espacioFondo.appendChild(laser);
                    setTimeout(() => laser.remove(), 500);
                }
            }, Math.random() * duracion * 1000);

            // Explotar al final
            setTimeout(() => {
                if (Math.random() > 0.5) {
                    const explosion = document.createElement('div');
                    explosion.classList.add('explosion-random');
                    explosion.textContent = '💥';
                    explosion.style.left = entidad.style.left;
                    explosion.style.top = entidad.style.top;
                    espacioFondo.appendChild(explosion);
                    setTimeout(() => explosion.remove(), 500);
                }
                entidad.remove();
            }, duracion * 1000);
        }
    }

    // Crear elementos de ambiente cada 1.5 segundos
    setInterval(crearAmbiente, 1500);
});
