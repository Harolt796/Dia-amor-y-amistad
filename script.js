document.addEventListener('DOMContentLoaded', () => {
    const startScreen = document.getElementById('start-screen');
    const btnExplorar = document.getElementById('btn-explorar');
    const sistemaSolar = document.getElementById('sistema-solar');
    const orbita = document.getElementById('orbita');
    const capaEstrellas = document.getElementById('capa-estrellas');
    const capaAmbiente = document.getElementById('capa-ambiente');
    const modal = document.getElementById('modal-planeta');
    const modalTitulo = document.getElementById('modal-titulo');
    const modalMensaje = document.getElementById('modal-mensaje');
    const cerrarBtn = document.querySelector('.cerrar');

    // --- 1. GENERAR ESTRELLAS EN EL FONDO ---
    for (let i = 0; i < 150; i++) {
        const estrella = document.createElement('div');
        estrella.classList.add('estrella');
        estrella.style.left = `${Math.random() * 100}vw`;
        estrella.style.top = `${Math.random() * 100}vh`;
        const size = Math.random() * 3 + 1;
        estrella.style.width = `${size}px`;
        estrella.style.height = `${size}px`;
        estrella.style.animationDelay = `${Math.random() * 3}s`;
        capaEstrellas.appendChild(estrella);
    }

    // --- 2. CREAR PLANETAS 3D ---
    const planetasData = [
        { id: 1, color: '#ffcc00', ring: false, msg: "Amarillo como el Sol. Gracias por iluminar mis días con tu amistad." },
        { id: 2, color: '#00ccff', ring: true, msg: "Azul como el Cielo. Nuestra amistad es tan grande e infinita como el universo." },
        { id: 3, color: '#ff66cc', ring: false, msg: "Rosa como una Flor. Eres una persona única y especial. ¡Sonríe siempre!" },
        { id: 4, color: '#00ff88', ring: true, msg: "Verde como la Vida. Gracias por traer tanta energía positiva a mi vida." }
    ];

    const radioOrbita = 400; // Distancia desde el centro

    planetasData.forEach((data, index) => {
        const planeta = document.createElement('div');
        planeta.classList.add('planeta-3d');
        planeta.dataset.id = data.id;
        planeta.dataset.angulo = (index * 90); // 0, 90, 180, 270 grados

        // Superficie (Textura y Sombra)
        const superficie = document.createElement('div');
        superficie.classList.add('superficie');
        superficie.style.background = `radial-gradient(circle at 30% 30%, ${data.color}, #000000)`;
        planeta.appendChild(superficie);

        // Atmósfera
        const atmosfera = document.createElement('div');
        atmosfera.classList.add('atmosfera');
        atmosfera.style.boxShadow = `0 0 40px ${data.color}`;
        planeta.appendChild(atmosfera);

        // Anillo (Si aplica)
        if (data.ring) {
            const anillo = document.createElement('div');
            anillo.classList.add('anillo');
            anillo.style.borderColor = data.color;
            planeta.appendChild(anillo);
        }

        // Posicionamiento 3D inicial
        actualizarPosicionPlaneta(planeta, 0);

        orbita.appendChild(planeta);
    });

    // Función para posicionar el planeta en 3D (siempre mirando a la cámara)
    function actualizarPosicionPlaneta(planeta, rotacionActual) {
        const anguloBase = parseFloat(planeta.dataset.angulo);
        const anguloTotal = anguloBase + rotacionActual;
        // rotateY(ángulo) translateZ(distancia) rotateY(-ángulo) -> Esto hace que el planeta siempre mire al frente
        planeta.style.transform = `rotateY(${anguloTotal}deg) translateZ(${radioOrbita}px) rotateY(${-anguloTotal}deg)`;
    }

    // --- 3. LÓGICA DE ARRASTRE (CARRUSEL) ---
    let isDragging = false;
    let startX;
    let currentRotation = 0;
    let startRotation = 0;
    let autoRotateSpeed = 0.2; // Velocidad de rotación automática
    let autoRotate = true;

    sistemaSolar.addEventListener('mousedown', (e) => {
        isDragging = true; autoRotate = false;
        startX = e.clientX; startRotation = currentRotation;
        orbita.style.transition = 'none';
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const deltaX = e.clientX - startX;
        currentRotation = startRotation + (deltaX * 0.5);
        actualizarSistema();
    });

    window.addEventListener('mouseup', () => {
        isDragging = false; autoRotate = true;
        orbita.style.transition = 'transform 0.1s linear';
    });

    // Soporte Táctil
    sistemaSolar.addEventListener('touchstart', (e) => {
        isDragging = true; autoRotate = false;
        startX = e.touches[0].clientX; startRotation = currentRotation;
        orbita.style.transition = 'none';
    });

    window.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const deltaX = e.touches[0].clientX - startX;
        currentRotation = startRotation + (deltaX * 0.5);
        actualizarSistema();
    });

    window.addEventListener('touchend', () => {
        isDragging = false; autoRotate = true;
        orbita.style.transition = 'transform 0.1s linear';
    });

    // Bucle de animación para rotación automática
    function animar() {
        if (autoRotate) {
            currentRotation += autoRotateSpeed;
            actualizarSistema();
        }
        requestAnimationFrame(animar);
    }

    function actualizarSistema() {
        orbita.style.transform = `rotateY(${currentRotation}deg)`;
        document.querySelectorAll('.planeta-3d').forEach(p => actualizarPosicionPlaneta(p, currentRotation));
    }

    animar(); // Iniciar el bucle

    // --- 4. INTERACCIÓN CON PLANETAS ---
    document.querySelectorAll('.planeta-3d').forEach(planeta => {
        planeta.addEventListener('click', (e) => {
            e.stopPropagation();
            // Evitar clic si se estaba arrastrando
            if (Math.abs(currentRotation - startRotation) > 5) return;

            const id = planeta.dataset.id;
            const data = planetasData.find(d => d.id == id);
            modalTitulo.textContent = "Mensaje de Amistad";
            modalMensaje.textContent = data.msg;
            modal.classList.add('mostrar');
        });
    });

    cerrarBtn.addEventListener('click', () => modal.classList.remove('mostrar'));
    window.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('mostrar'); });

    // --- 5. AMBIENTE ALEATORIO (FLORES AMARILLAS Y COMETAS) ---
    const emojisFlores = ['🌻', '🌼', '🌟', '✨', '💛'];

    function crearAmbiente() {
        // Flores amarillas flotando
        const flor = document.createElement('div');
        flor.classList.add('flor-flotante');
        flor.textContent = emojisFlores[Math.floor(Math.random() * emojisFlores.length)];
        flor.style.left = `${Math.random() * 100}vw`;
        flor.style.top = `${Math.random() * 100}vh`;
        flor.style.fontSize = `${1.5 + Math.random() * 2}rem`;
        flor.style.animationDuration = `${6 + Math.random() * 6}s`;
        capaAmbiente.appendChild(flor);
        setTimeout(() => flor.remove(), 12000);

        // Cometas aleatorios
        if (Math.random() > 0.7) { // 30% de probabilidad
            const cometa = document.createElement('div');
            cometa.textContent = '☄️';
            cometa.style.position = 'absolute';
            cometa.style.fontSize = '2rem';
            cometa.style.left = '-50px';
            cometa.style.top = `${Math.random() * 50}vh`;
            cometa.style.filter = 'drop-shadow(0 0 10px white)';
            capaAmbiente.appendChild(cometa);

            const duracion = 2 + Math.random() * 3;
            cometa.animate([
                { transform: 'translate(0, 0) rotate(45deg)' },
                { transform: `translate(120vw, 50vh) rotate(45deg)` }
            ], { duration: duracion * 1000, easing: 'linear' });

            setTimeout(() => cometa.remove(), duracion * 1000);
        }
    }

    setInterval(crearAmbiente, 2000);
    // Crear algunas flores iniciales
    for (let i = 0; i < 10; i++) crearAmbiente();

    // --- 6. INICIAR EXPLORACIÓN ---
    btnExplorar.addEventListener('click', () => {
        startScreen.classList.add('oculto');
    });
});
