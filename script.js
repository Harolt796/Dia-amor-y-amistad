document.addEventListener('DOMContentLoaded', () => {
    const startScreen = document.getElementById('start-screen');
    const winScreen = document.getElementById('win-screen');
    const btnIniciar = document.getElementById('btn-iniciar');
    const btnCerrarWin = document.getElementById('btn-cerrar-win');
    const hud = document.getElementById('hud');
    const musica = document.getElementById('musica');
    
    const hpText = document.getElementById('hp-text');
    const scoreText = document.getElementById('score-text');
    const statusText = document.getElementById('status-text');
    const vidaPlaneta = document.getElementById('vida-planeta');
    const planetaCentral = document.getElementById('planeta-central');
    const capaAliens = document.getElementById('capa-aliens');
    const capaLasers = document.getElementById('capa-lasers');
    const naveAliada = document.getElementById('nave-aliada');

    let vida = 100;
    let score = 0;
    let juegoActivo = false;
    let aliens = [];
    let intervaloAparicion;
    let intervaloMovimiento;

    // Iniciar Juego
    btnIniciar.addEventListener('click', () => {
        startScreen.classList.add('hidden');
        hud.classList.remove('hidden');
        musica.play().catch(e => console.log("Audio bloqueado"));
        iniciarJuego();
    });

    btnCerrarWin.addEventListener('click', () => {
        winScreen.classList.add('hidden');
        // Opcional: Reiniciar el juego
        location.reload(); 
    });

    function iniciarJuego() {
        vida = 100;
        score = 0;
        juegoActivo = true;
        actualizarHUD();
        
        // Aparecer aliens cada 1.5 segundos
        intervaloAparicion = setInterval(crearAlien, 1500);
        
        // Mover aliens constantemente (60 fps)
        intervaloMovimiento = setInterval(moverAliens, 50);

        // Después de 15 segundos, viene la nave aliada a salvar el día
        setTimeout(ataqueNaveAliada, 15000);
    }

    function actualizarHUD() {
        hpText.textContent = `${vida}%`;
        scoreText.textContent = score;
        vidaPlaneta.style.width = `${vida}%`;
        if (vida <= 50) vidaPlaneta.style.background = 'orange';
        if (vida <= 25) vidaPlaneta.style.background = 'red';
    }

    function crearAlien() {
        if (!juegoActivo) return;

        const alien = document.createElement('div');
        alien.classList.add('alien');
        alien.textContent = '👾';
        
        // Aparecer en un borde aleatorio
        const borde = Math.floor(Math.random() * 4);
        let x, y;
        const ancho = window.innerWidth;
        const alto = window.innerHeight;

        if (borde === 0) { x = Math.random() * ancho; y = -50; } // Arriba
        else if (borde === 1) { x = ancho + 50; y = Math.random() * alto; } // Derecha
        else if (borde === 2) { x = Math.random() * ancho; y = alto + 50; } // Abajo
        else { x = -50; y = Math.random() * alto; } // Izquierda

        alien.style.left = `${x}px`;
        alien.style.top = `${y}px`;

        // Datos del alien
        alien.dataset.x = x;
        alien.dataset.y = y;
        alien.dataset.velocidad = 1 + Math.random() * 1.5; // Velocidad aleatoria

        // Evento de clic (Destruir alien)
        alien.addEventListener('click', (e) => {
            e.stopPropagation();
            destruirAlien(alien, e.clientX, e.clientY);
        });

        capaAliens.appendChild(alien);
        aliens.push(alien);
    }

    function moverAliens() {
        if (!juegoActivo) return;

        const centroX = window.innerWidth / 2;
        const centroY = window.innerHeight / 2;

        aliens.forEach(alien => {
            let x = parseFloat(alien.dataset.x);
            let y = parseFloat(alien.dataset.y);
            const velocidad = parseFloat(alien.dataset.velocidad);

            // Mover hacia el centro
            const dx = centroX - x;
            const dy = centroY - y;
            const distancia = Math.sqrt(dx * dx + dy * dy);

            if (distancia < 80) {
                // El alien llegó al planeta
                dañarPlaneta(alien);
                return;
            }

            x += (dx / distancia) * velocidad;
            y += (dy / distancia) * velocidad;

            alien.dataset.x = x;
            alien.dataset.y = y;
            alien.style.left = `${x}px`;
            alien.style.top = `${y}px`;
        });
    }

    function destruirAlien(alien, clickX, clickY) {
        score += 10;
        actualizarHUD();
        crearExplosion(clickX, clickY);
        
        alien.remove();
        aliens = aliens.filter(a => a !== alien);
    }

    function dañarPlaneta(alien) {
        vida -= 10;
        actualizarHUD();
        crearExplosion(parseFloat(alien.dataset.x), parseFloat(alien.dataset.y));
        
        alien.remove();
        aliens = aliens.filter(a => a !== alien);

        planetaCentral.classList.add('dañado');
        setTimeout(() => planetaCentral.classList.remove('dañado'), 500);

        if (vida <= 0) {
            gameOver();
        }
    }

    function crearExplosion(x, y) {
        const explosion = document.createElement('div');
        explosion.classList.add('explosion');
        explosion.textContent = '💥';
        explosion.style.left = `${x - 30}px`;
        explosion.style.top = `${y - 30}px`;
        document.body.appendChild(explosion);
        setTimeout(() => explosion.remove(), 500);
    }

    function gameOver() {
        juegoActivo = false;
        clearInterval(intervaloAparicion);
        clearInterval(intervaloMovimiento);
        statusText.textContent = "PLANETA DESTRUIDO";
        statusText.style.color = "red";
        // Aquí podrías reiniciar o mostrar otra pantalla
    }

    // --- ATAQUE DE LA NAVE ALIADA ---
    function ataqueNaveAliada() {
        if (!juegoActivo) return;

        statusText.textContent = "¡REFUERZOS LLEGANDO!";
        statusText.style.color = "var(--primary)";
        
        // Detener la aparición de aliens
        clearInterval(intervaloAparicion);

        // Mostrar nave aliada
        naveAliada.classList.remove('oculto');
        naveAliada.classList.add('atacando');

        // Después de 1 segundo (cuando la nave está en el centro), dispara
        setTimeout(() => {
            // Crear láser gigante
            const laser = document.createElement('div');
            laser.classList.add('laser');
            laser.style.width = '200vw';
            laser.style.left = '50%';
            laser.style.top = '50%';
            laser.style.transform = 'translate(-50%, -50%) rotate(0deg)';
            laser.style.height = '20px';
            laser.style.background = 'white';
            laser.style.boxShadow = '0 0 50px cyan, 0 0 100px cyan';
            capaLasers.appendChild(laser);

            // Destruir todos los aliens
            aliens.forEach(alien => {
                const x = parseFloat(alien.dataset.x);
                const y = parseFloat(alien.dataset.y);
                setTimeout(() => {
                    crearExplosion(x, y);
                    alien.remove();
                }, Math.random() * 500);
            });
            aliens = [];

            // Limpiar láser
            setTimeout(() => laser.remove(), 1000);

            // Mostrar mensaje de victoria después de que exploten
            setTimeout(mostrarVictoria, 2000);

        }, 1500); // La nave tarda 1.5s en llegar al centro
    }

    function mostrarVictoria() {
        juegoActivo = false;
        clearInterval(intervaloMovimiento);
        
        // Mostrar pantalla de victoria
        document.getElementById('win-img').src = 'assets/foto1.jpg';
        document.getElementById('win-titulo').textContent = "¡Universo Salvado!";
        document.getElementById('win-mensaje').textContent = "Al igual que defendimos este universo juntos, quiero defender nuestro cariño siempre. ¡Feliz Día de la Amistad y el Amor!";
        
        winScreen.classList.remove('hidden');
    }
});
