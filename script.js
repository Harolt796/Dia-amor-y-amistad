document.addEventListener('DOMContentLoaded', () => {
    const planetas = document.querySelectorAll('.planeta:not(.peligro)'); // Planetas normales
    const planetaPeligro = document.getElementById('planeta-peligro');
    const modal = document.getElementById('modal');
    const modalImg = document.getElementById('modal-img');
    const modalTitulo = document.getElementById('modal-titulo');
    const modalMensaje = document.getElementById('modal-mensaje');
    const cerrarBtn = document.querySelector('.cerrar');
    const musica = document.getElementById('musica');
    
    // Actores de la cinemática
    const nave = document.getElementById('nave');
    const alien = document.getElementById('alien');
    const explosion = document.getElementById('explosion');
    const laser = document.getElementById('laser');
    const laserReparador = document.getElementById('laser-reparador');

    let musicaIniciada = false;
    let cinematicaActiva = false;

    // --- LÓGICA DE LOS PLANETAS NORMALES ---
    function abrirModal(planeta) {
        const imgSrc = planeta.getAttribute('data-img');
        const titulo = planeta.getAttribute('data-titulo');
        const mensaje = planeta.getAttribute('data-mensaje');

        modalImg.src = imgSrc;
        modalTitulo.textContent = titulo;
        modalMensaje.textContent = mensaje;
        modal.classList.add('mostrar');

        if (!musicaIniciada) {
            musica.play().catch(e => console.log("Audio bloqueado"));
            musicaIniciada = true;
        }
    }

    planetas.forEach(p => p.addEventListener('click', () => abrirModal(p)));

    cerrarBtn.addEventListener('click', () => modal.classList.remove('mostrar'));
    window.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('mostrar'); });

    // --- LÓGICA DE LA CINEMÁTICA (EL ATAQUE Y REPARACIÓN) ---
    planetaPeligro.addEventListener('click', () => {
        if (cinematicaActiva) return; // Evitar que se ejecute dos veces
        cinematicaActiva = true;

        if (!musicaIniciada) {
            musica.play().catch(e => console.log("Audio bloqueado"));
            musicaIniciada = true;
        }

        // 1. Llega la nave (3 segundos)
        nave.style.display = 'block';
        
        setTimeout(() => {
            // 2. La nave dispara el laser
            laser.style.display = 'block';
            laser.style.animation = 'disparar 1s forwards';
        }, 2500);

        setTimeout(() => {
            // 3. Explota el planeta
            laser.style.display = 'none';
            explosion.style.display = 'block';
            explosion.style.left = '30%'; // Posición del planeta
            explosion.style.top = '65%';
            
            planetaPeligro.classList.add('planeta-herido');
        }, 3500);

        setTimeout(() => {
            // 4. Se va la explosión, llega el Alien
            explosion.style.display = 'none';
            alien.style.display = 'block';
        }, 4500);

        setTimeout(() => {
            // 5. El alien dispara el rayo reparador
            laserReparador.style.display = 'block';
            laserReparador.style.animation = 'disparar 1.5s forwards';
        }, 7000);

        setTimeout(() => {
            // 6. El planeta se repara
            laserReparador.style.display = 'none';
            planetaPeligro.classList.remove('planeta-herido');
            planetaPeligro.style.background = 'radial-gradient(circle at 30% 30%, #00ff88, #006644)'; // Se vuelve verde
            
            // Mostrar un mensaje final
            modalImg.src = 'assets/foto1.jpg'; // Puedes poner una foto especial aquí
            modalTitulo.textContent = "¡El universo está a salvo!";
            modalMensaje.textContent = "A veces las cosas se rompen, pero siempre hay alguien dispuesto a ayudar y reparar. Al igual que nuestro cariño. 💚";
            modal.classList.add('mostrar');

        }, 8500);

        setTimeout(() => {
            // 7. El alien se va
            alien.style.display = 'none';
        }, 10000);
    });
});
