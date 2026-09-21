document.addEventListener('DOMContentLoaded', () => {
    const universo = document.getElementById('universo');
    const capaFlores = document.getElementById('capa-flores');
    const capaNaves = document.getElementById('capa-naves');
    const capaLaseres = document.getElementById('capa-laseres');

    // --- 1. LÓGICA DE ARRASTRE (PANEO) ---
    let isDragging = false;
    let startX, startY;
    let currentX = 0, currentY = 0;
    // Centrar el universo al inicio
    const centerX = -(window.innerWidth * 1.0); 
    const centerY = -(window.innerHeight * 1.0);
    currentX = centerX;
    currentY = centerY;
    universo.style.transform = `translate(${currentX}px, ${currentY}px)`;

    document.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX - currentX;
        startY = e.clientY - currentY;
        universo.style.transition = 'none'; // Quitar transición para que sea fluido
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        currentX = e.clientX - startX;
        currentY = e.clientY - startY;
        
        // Límites para no salirse del universo de 300vw x 300vh
        const maxX = 0;
        const minX = -(window.innerWidth * 2);
        const maxY = 0;
        const minY = -(window.innerHeight * 2);

        currentX = Math.max(minX, Math.min(maxX, currentX));
        currentY = Math.max(minY, Math.min(maxY, currentY));

        universo.style.transform = `translate(${currentX}px, ${currentY}px)`;
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        universo.style.transition = 'transform 0.1s ease-out';
    });

    // Soporte para pantallas táctiles (Móviles)
    document.addEventListener('touchstart', (e) => {
        isDragging = true;
        startX = e.touches[0].clientX - currentX;
        startY = e.touches[0].clientY - currentY;
        universo.style.transition = 'none';
    });

    document.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        currentX = e.touches[0].clientX - startX;
        currentY = e.touches[0].clientY - startY;
        universo.style.transform = `translate(${currentX}px, ${currentY}px)`;
    });

    document.addEventListener('touchend', () => {
        isDragging = false;
        universo.style.transition = 'transform 0.1s ease-out';
    });


    // --- 2. GENERADOR DE FLORES AMARILLAS ---
    const emojisFlores = ['🌻', '🌼', '🌟', '✨'];
    
    function crearFlor() {
        const flor = document.createElement('div');
        flor.classList.add('flor');
        flor.textContent = emojisFlores[Math.floor(Math.random() * emojisFlores.length)];
        
        // Posición aleatoria en el universo gigante
        flor.style.left = `${Math.random() * 280}vw`;
        flor.style.top = `${Math.random() * 280}vh`;
        
        // Duración y delay aleatorio para que no floten al mismo tiempo
        flor.style.animationDuration = `${4 + Math.random() * 4}s`;
        flor.style.animationDelay = `${Math.random() * 2}s`;
        flor.style.fontSize = `${1.5 + Math.random() * 2}rem`;

        capaFlores.appendChild(flor);
    }

    // Crear 50 flores iniciales
    for (let i = 0; i < 50; i++) crearFlor();
    // Y seguir creando una nueva cada 3 segundos
    setInterval(crearFlor, 3000);


    // --- 3. GUERRA ESPACIAL ALEATORIA (NAVES Y ALIENS) ---
    function crearEntidad() {
        const esNave = Math.random() > 0.5;
        const entidad = document.createElement('div');
        entidad.classList.add(esNave ? 'nave-aleatoria' : 'alien-aleatorio');
        entidad.textContent = esNave ? '🚀' : '👽';
        
        // Aparecer en un borde aleatorio del universo
        const x = Math.random() * 280; // vw
        const y = Math.random() * 280; // vh
        entidad.style.left = `${x}vw`;
        entidad.style.top = `${y}vh`;

        // Rotación aleatoria
        const rotacion = Math.random() * 360;
        entidad.style.transform = `rotate(${rotacion}deg)`;

        capaNaves.appendChild(entidad);

        // Mover la entidad en una dirección aleatoria
        const duracion = 3 + Math.random() * 5; // 3 a 8 segundos
        const dirX = (Math.random() - 0.5) * 100; // -50 a 50 vw
        const dirY = (Math.random() - 0.5) * 100; // -50 a 50 vh

        entidad.animate([
            { transform: `translate(0, 0) rotate(${rotacion}deg)` },
            { transform: `translate(${dirX}vw, ${dirY}vh) rotate(${rotacion + 180}deg)` }
        ], {
            duration: duracion * 1000,
            easing: 'linear'
        });

        // Disparar láser aleatoriamente mientras vuela
        setTimeout(() => {
            if (Math.random() > 0.5) {
                dispararLaser(x, y, esNave);
            }
        }, Math.random() * duracion * 1000);

        // Explotar o desaparecer al final
        setTimeout(() => {
            if (Math.random() > 0.3) { // 70% de probabilidad de explotar
                crearExplosion(entidad.style.left, entidad.style.top);
            }
            entidad.remove();
        }, duracion * 1000);
    }

    function dispararLaser(x, y, esNave) {
        const laser = document.createElement('div');
        laser.classList.add('laser-random');
        laser.style.left = `${x}vw`;
        laser.style.top = `${y}vh`;
        
        if (!esNave) {
            laser.style.background = '#00ffff';
            laser.style.boxShadow = '0 0 10px #00ffff';
        }

        const angulo = Math.random() * 360;
        const longitud = 100 + Math.random() * 200;
        
        laser.style.transform = `rotate(${angulo}deg)`;
        laser.style.width = `${longitud}px`;

        capaLaseres.appendChild(laser);

        // El láser desaparece después de un momento
        setTimeout(() => {
            laser.style.transition = 'opacity 0.2s';
            laser.style.opacity = '0';
            setTimeout(() => laser.remove(), 200);
        }, 300);
    }

    function crearExplosion(x, y) {
        const explosion = document.createElement('div');
        explosion.classList.add('explosion-random');
        explosion.textContent = '💥';
        explosion.style.left = x;
        explosion.style.top = y;
        capaNaves.appendChild(explosion);
        setTimeout(() => explosion.remove(), 500);
    }

    // Crear una nueva nave o alien cada 2 segundos
    setInterval(crearEntidad, 2000);
});
