document.addEventListener('DOMContentLoaded', () => {
    const planetas = document.querySelectorAll('.planeta:not(.peligro)');
    const planetaPeligro = document.getElementById('planeta-peligro');
    const modal = document.getElementById('modal');
    const modalImg = document.getElementById('modal-img');
    const modalTitulo = document.getElementById('modal-titulo');
    const modalMensaje = document.getElementById('modal-mensaje');
    const cerrarBtn = document.querySelector('.cerrar');
    const musica = document.getElementById('musica');
    const estadoTexto = document.getElementById('estado-texto');

    // Actores
    const nave = document.getElementById('nave');
    const alien = document.getElementById('alien');
    const explosion = document.getElementById('explosion');
    const laser = document.getElementById('laser');
    const laserReparador = document.getElementById('laser-reparador');

    let musicaIniciada = false;

    // --- LÓGICA DE LOS PLANETAS INTERACTIVOS ---
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

    // --- LÓGICA DEL ECOSISTEMA AUTOMÁTICO ---
    
    // Función auxiliar para hacer pausas (esperar)
    const esperar = (ms) => new Promise(res => setTimeout(res, ms));

    async function cicloEcosistema() {
        while (true) { // Bucle infinito
            // 1. Estado normal
            estadoTexto.textContent = "Sistema estable...";
            estadoTexto.style.color = "#00ffff";
            planetaPeligro.style.background = 'radial-gradient(circle at 30% 30%, #00ff88, #006644)'; // Planeta sano (Verde)
            planetaPeligro.classList.remove('planeta-herido');
            
            await esperar(5000); // Esperar 5 segundos antes de que empiece el caos

            // 2. Llega la nave enemiga
            estadoTexto.textContent = "¡Alerta! Nave desconocida acercándose...";
            estadoTexto.style.color = "#ff4444";
            nave.style.display = 'block';
            nave.classList.add('visible');
            
            await esperar(3000); // La nave tarda 3 seg en llegar

            // 3. La nave dispara
            estadoTexto.textContent = "¡Disparo detectado!";
            laser.style.display = 'block';
            laser.style.width = '150px';
            
            await esperar(1000); // El láser tarda 1 seg en impactar

            // 4. Explosión
            laser.style.display = 'none';
            laser.style.width = '0';
            explosion.style.display = 'block';
            explosion.classList.add('visible');
            planetaPeligro.classList.add('planeta-herido'); // El planeta se pone gris
            
            await esperar(1000); // La explosión dura 1 seg

            // 5. La nave se va
            explosion.classList.remove('visible');
            explosion.style.display = 'none';
            nave.classList.remove('visible');
            nave.classList.add('saliendo');
            estadoTexto.textContent = "Planeta dañado. Buscando ayuda...";

            await esperar(2000); // Esperar 2 seg

            // 6. Llega el Alien a reparar
            nave.style.display = 'none';
            nave.classList.remove('saliendo');
            
            alien.style.display = 'block';
            alien.classList.add('visible');
            estadoTexto.textContent = "Entidad amistosa detectada. Reparando...";
            estadoTexto.style.color = "#00ff88";

            await esperar(3000); // El alien tarda 3 seg en llegar

            // 7. El alien dispara rayo sanador
            laserReparador.style.display = 'block';
            laserReparador.style.width = '150px';

            await esperar(1500); // El rayo tarda 1.5 seg

            // 8. El planeta se cura
            laserReparador.style.display = 'none';
            laserReparador.style.width = '0';
            planetaPeligro.classList.remove('planeta-herido'); // El planeta vuelve a la vida
            estadoTexto.textContent = "¡Planeta restaurado! El ecosistema está a salvo. 💚";

            await esperar(2000);

            // 9. El alien se va
            alien.classList.remove('visible');
            alien.classList.add('saliendo');
            
            await esperar(2000);
            alien.style.display = 'none';
            alien.classList.remove('saliendo');

            // El ciclo vuelve a empezar automáticamente
        }
    }

    // Iniciar el ecosistema automático
    cicloEcosistema();
});
