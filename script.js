// ==========================================
// PC PIXEL STUDIO — SCRIPT PRINCIPAL WEB
// ==========================================

document.addEventListener('DOMContentLoaded', () => {

    // --------------------------------------
    // 1. DESPLAZAMIENTO SUAVE (SMOOTH SCROLL)
    // --------------------------------------
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                e.preventDefault();
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // --------------------------------------
    // 2. EFECTO NAVBAR AL HACER SCROLL
    // --------------------------------------
    const navbar = document.querySelector('.navbar');
    
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.8)';
                navbar.style.borderBottomColor = 'rgba(0, 210, 255, 0.6)';
            } else {
                navbar.style.boxShadow = 'none';
                navbar.style.borderBottomColor = 'rgba(42, 50, 75, 1)';
            }
        });
    }

    // --------------------------------------
    // 3. ANIMACIÓN EN SPRITES DE PERSONAJES
    // --------------------------------------
    const charSprites = document.querySelectorAll('.char-sprite');
    
    charSprites.forEach(sprite => {
        sprite.style.transition = 'transform 0.2s ease';
        
        sprite.addEventListener('mouseenter', () => {
            sprite.style.transform = 'scale(1.15) rotate(3deg)';
        });
        
        sprite.addEventListener('mouseleave', () => {
            sprite.style.transform = 'scale(1) rotate(0deg)';
        });
    });

    // --------------------------------------
    // 4. ANOMALÍA DIMENSIONAL (CANVAS PARTÍCULAS)
    // --------------------------------------
    const canvas = document.getElementById('anomaly-canvas');
    
    // Solo ejecuta la animación si el canvas existe en la página actual
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particlesArray = [];
        const numberOfParticles = 70;

        function resizeCanvas() {
            if (canvas.parentElement) {
                canvas.width = canvas.parentElement.clientWidth;
                canvas.height = canvas.parentElement.clientHeight;
            }
        }

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 3 + 1; // Píxeles de 1px a 4px
                this.speedX = (Math.random() - 0.5) * 0.8;
                this.speedY = (Math.random() - 0.5) * 0.8;
                // Colores neón: Cian (#00d2ff) y Violeta (#9d4edd)
                this.color = Math.random() > 0.5 ? '#00d2ff' : '#9d4edd';
                this.opacity = Math.random();
                this.fadeSpeed = Math.random() * 0.02 + 0.005;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                // Parpadeo
                this.opacity += this.fadeSpeed;
                if (this.opacity >= 1 || this.opacity <= 0.2) {
                    this.fadeSpeed = -this.fadeSpeed;
                }

                // Reaparecer al salir de los bordes
                if (this.x < 0) this.x = canvas.width;
                if (this.x > canvas.width) this.x = 0;
                if (this.y < 0) this.y = canvas.height;
                if (this.y > canvas.height) this.y = 0;
            }

            draw() {
                ctx.save();
                ctx.globalAlpha = Math.abs(this.opacity);
                ctx.fillStyle = this.color;
                ctx.shadowBlur = 10;
                ctx.shadowColor = this.color;
                // Formato píxel (cuadrado)
                ctx.fillRect(this.x, this.y, this.size, this.size);
                ctx.restore();
            }
        }

        function init() {
            particlesArray = [];
            for (let i = 0; i < numberOfParticles; i++) {
                particlesArray.push(new Particle());
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particlesArray.forEach(particle => {
                particle.update();
                particle.draw();
            });
            requestAnimationFrame(animate);
        }

        init();
        animate();
    }

    console.log("⚡ Web de PC Pixel Studio cargada correctamente.");
});