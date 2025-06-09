document.addEventListener('DOMContentLoaded', () => {
    // Scroll to top on page reload
    window.scrollTo(0, 0);
    window.addEventListener('beforeunload', () => {
        window.scrollTo(0, 0);
    });

    // Hide loading screen when everything is loaded and after minimum 3 seconds
    const loadingScreen = document.querySelector('.loading-screen');
    const startTime = Date.now();
    const minDisplayTime = 3000; // 3 seconds in milliseconds

    window.addEventListener('load', () => {
        const elapsed = Date.now() - startTime;
        const remainingTime = Math.max(0, minDisplayTime - elapsed);
        
        setTimeout(() => {
            if (loadingScreen) {
                loadingScreen.classList.add('fade-out');
                setTimeout(() => {
                    loadingScreen.remove();
                }, 500);
            }
        }, remainingTime);
    });

    const menuToggle = document.querySelector('.menu-toggle');
    const closeButton = document.querySelector('.close-button');
    const navMenu = document.querySelector('.nav-menu');
    const headerContainer = document.querySelector('.header-container');
    const profileSection = document.querySelector('.profile-section');
    const halButton = document.querySelector('.hal-button');

    // Esconde o botão HAL por 4 segundos ao iniciar
    if (halButton) {
        halButton.classList.add('hal-invisible');
        setTimeout(() => {
            halButton.classList.remove('hal-invisible');
        }, 2000);
    }

    // --- HAL 9000 Audio Logic ---
    // List of audio files
    const halSaudacoes = [
        'hal9000/saudações/ola1.mp4',
        'hal9000/saudações/ola2.mp4',
        'hal9000/saudações/ola3.mp4',
        'hal9000/saudações/ola4.mp4',
        'hal9000/saudações/ola5.mp4',
    ];
    const halCuriosidades = [
        'hal9000/curiosidades/curiosidade1.mp4',
        'hal9000/curiosidades/curiosidade2.mp4',
        'hal9000/curiosidades/curiosidade3.mp4',
        'hal9000/curiosidades/curiosidade4.mp4',
        'hal9000/curiosidades/curiosidade5.mp4',
    ];

    let halAudio = null;
    let halFirstClick = true;
    let halClickedThisSession = false;

    // Para garantir que todos sejam tocados antes de repetir
    function createAudioQueue(list) {
        let queue = [...list];
        return function next() {
            if (queue.length === 0) queue = [...list];
            const idx = Math.floor(Math.random() * queue.length);
            const src = queue.splice(idx, 1)[0];
            return src;
        };
    }
    const nextSaudacao = createAudioQueue(halSaudacoes);
    const nextCuriosidade = createAudioQueue(halCuriosidades);

    function playAudio(src) {
        if (halAudio) {
            halAudio.pause();
            halAudio.currentTime = 0;
            halButton.classList.remove('playing');
        }
        halAudio = new Audio(src);
        halAudio.play();
        halButton.classList.add('playing');
        
        halAudio.addEventListener('ended', () => {
            halButton.classList.remove('playing');
        });
    }

    // Verificação robusta do botão HAL
    if (!halButton) {
        console.error('Botão HAL não encontrado no DOM');
        return;
    }

    // Garantir que o botão permaneça visível
    halButton.style.display = 'flex';
    halButton.style.visibility = 'visible';
    halButton.style.opacity = '1';
    
    halButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!halButton.isConnected) {
            console.warn('Botão HAL foi removido do DOM');
            return;
        }
        
        // Se estiver tocando, para
        if (halAudio && !halAudio.paused && !halAudio.ended) {
            halAudio.pause();
            halAudio.currentTime = 0;
            halButton.classList.remove('playing');
            return;
        }
        
        // Primeira vez
        if (halFirstClick) {
            playAudio(nextSaudacao());
            halFirstClick = false;
            halClickedThisSession = true;
        } else {
            playAudio(nextCuriosidade());
        }
    });

    // --- FIM HAL 9000 Audio Logic ---

    // Configuração do canvas espacial
    const canvas = document.getElementById('spaceCanvas');
    const ctx = canvas.getContext('2d');
    
    // Ajustar o tamanho do canvas para tela cheia
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Observer for header animation
    const header = document.querySelector('.header-container');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, {threshold: 0.1});

    observer.observe(header);

    // About section animation on scroll
    const aboutSection = document.querySelector('.about-section');

    const aboutObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Unobserve after triggering to prevent re-animation
                // aboutObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    });

    if (aboutSection) {
        aboutObserver.observe(aboutSection);
    }

    // Projects section animation
    const projectsSection = document.querySelector('.projects-section');

    const projectsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {threshold: 0.1});

    projectsObserver.observe(projectsSection);

    // VHS effect: add .visible to each .project-item when visible
    const projectItems = document.querySelectorAll('.project-item');
    const projectItemObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                projectItemObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    projectItems.forEach(item => projectItemObserver.observe(item));

    // Observer for project section animations
    const animateElements = document.querySelectorAll('[data-animate]');
    const animateObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-delay') || 0;
                const animation = entry.target.getAttribute('data-animate');
                
                setTimeout(() => {
                    entry.target.classList.add(animation);
                }, delay);
                
                animateObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    animateElements.forEach(element => {
        animateObserver.observe(element);
    });

    // Classe para criar estrelas
    class Star {
        constructor() {
            this.reset();
            this.color = `rgba(255, 255, 255, ${Math.random() * 0.9 + 0.3})`;
            this.trail = [];
            this.maxTrailLength = 5;
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.z = Math.random() * 2000;
            this.size = Math.random() * 2.5 + 1;
            this.speed = Math.random() * 3 + 1;
            this.trail = [];
        }
        
        update() {
            // Save current position before updating
            const prevX = this.x * (2000 / this.z);
            const prevY = this.y * (2000 / this.z);
            
            this.z -= this.speed;
            
            if (this.z < 1 || 
                this.x < 0 || 
                this.x > canvas.width || 
                this.y < 0 || 
                this.y > canvas.height) {
                this.reset();
            } else {
                // Add current position to trail
                const x = this.x * (2000 / this.z);
                const y = this.y * (2000 / this.z);
                this.trail.push({x, y});
                
                // Limit trail length
                if (this.trail.length > this.maxTrailLength) {
                    this.trail.shift();
                }
            }
        }
        
        draw() {
            const x = this.x * (2000 / this.z);
            const y = this.y * (2000 / this.z);
            const size = this.size * (2000 / this.z) * 0.5;
            
            // Draw trail
            for (let i = 0; i < this.trail.length; i++) {
                const point = this.trail[i];
                const trailSize = size * (i / this.trail.length);
                const alpha = 0.3 * (i / this.trail.length);
                
                ctx.beginPath();
                ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
                ctx.arc(point.x, point.y, trailSize, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // Draw star
            ctx.beginPath();
            ctx.fillStyle = this.color;
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function drawBackground() {
        const gradient = ctx.createRadialGradient(
            canvas.width / 2,
            canvas.height / 2,
            0,
            canvas.width / 2,
            canvas.height / 2,
            Math.max(canvas.width, canvas.height) / 1.5
        );
        
        gradient.addColorStop(0, 'rgba(10, 5, 20, 0.5)');
        gradient.addColorStop(1, 'rgba(5, 2, 10, 0.3)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    const stars = Array(300).fill().map(() => new Star());

    function animate() {
        ctx.fillStyle = 'rgb(5, 2, 10)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        drawBackground();
        
        stars.forEach(star => {
            star.update();
            star.draw();
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();

    // Rocket animation with 1.8 second delay
    setTimeout(() => {
        const rocketContainer = document.getElementById('rocket-container');
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(800, 800);
        rocketContainer.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
        camera.position.z = 20;
        camera.position.y = 0.8;
        camera.position.x = -1;

        const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
        scene.add(ambientLight);

        const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1.5);
        directionalLight1.position.set(5, 5, 5);
        scene.add(directionalLight1);
        
        const directionalLight2 = new THREE.DirectionalLight(0xffaa00, 0.8);
        directionalLight2.position.set(-5, 3, 2);
        scene.add(directionalLight2);
        
        const pointLight = new THREE.PointLight(0x00aaff, 1, 15);
        pointLight.position.set(2, 0, 5);
        scene.add(pointLight);

        const loader = new THREE.GLTFLoader();
        let rocketModel;
        let pivot = new THREE.Group(); // Criamos um grupo para servir como pivô
        
        // Variáveis de rotação
        let isDragging = false;
        let rotationSpeedY = 0;
        let rotationSpeedX = 0;
        const maxRotationSpeed = 0.2;
        
        // Eventos do mouse
        rocketContainer.addEventListener('mousedown', () => {
            isDragging = true;
        });
        
        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
        
        document.addEventListener('mousemove', (event) => {
            if (isDragging) {
                rotationSpeedY = (event.movementX / window.innerWidth) * maxRotationSpeed * 20;
                rotationSpeedX = (event.movementY / window.innerHeight) * maxRotationSpeed * 10;
            }
        });
        
        loader.load(
            'obj-3d/rocket.glb',
            (gltf) => {
                const model = gltf.scene;
                rocketModel = model;
                model.scale.set(0.4, 0.4, 0.4);
                model.position.set(0, -1, 0); // Posição relativa ao pivô
                
                // Configuramos o pivô
                pivot.position.set(3, 0, 0); // Posição do pivô na cena
                pivot.add(model); // Adicionamos o foguete ao pivô
                scene.add(pivot); // Adicionamos o pivô à cena

                function animateRocket() {
                    requestAnimationFrame(animateRocket);
                    
                    // Movimento vertical
                    model.position.y = -1 + Math.sin(Date.now() * 0.001) * 0.5;
                    
                    // Rotação
                    if (isDragging) {
                        pivot.rotation.y += rotationSpeedY;
                        pivot.rotation.x += rotationSpeedX;
                    } else {
                        rotationSpeedY *= 0.97;
                        rotationSpeedX *= 0.97;
                        pivot.rotation.y += rotationSpeedY;
                        pivot.rotation.x += rotationSpeedX;
                    }
                    
                    renderer.render(scene, camera);
                }
                animateRocket();
            },
            undefined,
            (error) => {
                console.error('Erro ao carregar o modelo:', error);
            }
        );
    }, 1800);

    function openMenu() {
        menuToggle.classList.add('active');
        navMenu.classList.add('active');
        headerContainer.classList.add('menu-opened');
    }

    function closeMenu() {
        headerContainer.classList.remove('menu-opened');
        menuToggle.classList.remove('active');
        void headerContainer.offsetWidth;
        navMenu.classList.remove('active');
    }

    menuToggle.addEventListener('click', () => {
        if (!headerContainer.classList.contains('menu-opened')) {
            openMenu();
        }
    });

    closeButton.addEventListener('click', closeMenu);

    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            if (headerContainer.classList.contains('menu-opened')) {
                closeMenu();
            }
        });
    });

    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && 
            !menuToggle.contains(e.target) && 
            !closeButton.contains(e.target) && 
            headerContainer.classList.contains('menu-opened')) {
            closeMenu();
        }
    });

    // Smooth scroll to sections when menu links are clicked
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
                
                // Close menu if open
                if (headerContainer.classList.contains('menu-opened')) {
                    closeMenu();
                }
            }
        });
    });
});

// Efeito de palavras lado a lado
function initRotatingText() {
    const words = document.querySelectorAll('.rotating-word');
    let currentIndex = 0;
    
    // Initial setup
    words.forEach(word => {
        word.classList.remove('active');
    });
    
    // Activate first word
    words[currentIndex].classList.add('active');
    
    function rotateWords() {
        // Remove active state from current word
        words[currentIndex].classList.remove('active');
        
        // Move to next word
        currentIndex = (currentIndex + 1) % words.length;
        
        // Activate new word
        words[currentIndex].classList.add('active');
    }
    
    // Start rotation
    setInterval(rotateWords, 2000);
}

// Inicializa quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', initRotatingText);

// Efeito de digitação ativado quando visível
document.addEventListener('DOMContentLoaded', function() {
    const element = document.querySelector('.typing-text');
    
    if (element) {
        const text = 'Tecnologias com as quais trabalho';
        let animated = false;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !animated) {
                    animated = true;
                    typeWriter();
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(element);
        
        let i = 0;
        element.textContent = '';
        
        function typeWriter() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                const speed = 80 + Math.random() * 40;
                requestAnimationFrame(() => setTimeout(typeWriter, speed));
            } else {
                const cursor = document.createElement('span');
                cursor.className = 'blinking-cursor';
                cursor.textContent = '|';
                element.appendChild(cursor);
                cursor.style.transition = 'opacity 0.3s ease';
            }
        }
    }
});

// Enhanced Futuristic Line Animation
function initFuturisticLines() {
    const canvas = document.getElementById('futuristic-lines');
    const ctx = canvas.getContext('2d');
    let mouseX = canvas.width/2;
    let mouseY = canvas.height/2;
    
    // Set canvas size
    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }
    
    // Mouse movement tracking
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
    });
    
    // Enhanced Line class
    class Line {
        constructor() {
            this.reset();
            this.z = Math.random() * 3 + 1;
            this.maxLength = Math.random() * 150 + 80;
            this.pulseSpeed = Math.random() * 0.02 + 0.01;
            this.pulsePhase = Math.random() * Math.PI * 2;
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.speed = Math.random() * 1.5 + 0.5;
            this.angle = Math.random() * Math.PI * 2;
            this.length = 0;
            this.hue = Math.floor(Math.random() * 60) + 190;
            this.growing = true;
            this.width = Math.random() * 1.5 + 0.5;
        }
        
        update() {
            // Enhanced mouse reaction
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 250) {
                const force = 1 - (distance / 250);
                this.angle = Math.atan2(dy, dx) + Math.PI;
                this.speed = 5 * force;
                this.hue = (this.hue + 2) % 360;
            } else {
                this.speed = Math.random() * 0.8 + 0.2;
            }
            
            // Pulsing length effect
            this.pulsePhase += this.pulseSpeed;
            const pulseFactor = (Math.sin(this.pulsePhase) + 1) * 0.3 + 0.7;
            
            // Animate length
            if (this.growing) {
                this.length += this.speed * pulseFactor;
                if (this.length >= this.maxLength) this.growing = false;
            } else {
                this.length -= this.speed * pulseFactor;
                if (this.length <= 0) this.reset();
            }
            
            // Movement
            this.x += Math.cos(this.angle) * this.speed;
            this.y += Math.sin(this.angle) * this.speed;
            
            // Wrap around edges
            if (this.x < -this.maxLength) this.x = canvas.width + this.maxLength;
            if (this.x > canvas.width + this.maxLength) this.x = -this.maxLength;
            if (this.y < -this.maxLength) this.y = canvas.height + this.maxLength;
            if (this.y > canvas.height + this.maxLength) this.y = -this.maxLength;
        }
        
        draw() {
            if (this.length <= 0) return;
            
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(
                this.x + Math.cos(this.angle) * this.length,
                this.y + Math.sin(this.angle) * this.length
            );
            
            // Enhanced glow effect
            const glowIntensity = 0.8/this.z;
            ctx.strokeStyle = `hsla(${this.hue}, 85%, 65%, ${glowIntensity})`;
            ctx.lineWidth = this.width / this.z;
            ctx.shadowBlur = 15 / this.z;
            ctx.shadowColor = `hsla(${this.hue}, 85%, 65%, ${glowIntensity * 0.7})`;
            ctx.stroke();
        }
    }
    
    // Create more lines (increased from 150 to 250)
    const lines = [];
    for (let i = 0; i < 250; i++) {
        lines.push(new Line());
    }
    
    // Animation loop
    function animate() {
        // Darker background for better contrast
        ctx.fillStyle = '#050510';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Sort by depth
        lines.sort((a, b) => a.z - b.z);
        
        // Update and draw lines
        lines.forEach(line => {
            line.update();
            line.draw();
        });
        
        requestAnimationFrame(animate);
    }
    
    // Initialize
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    animate();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initFuturisticLines();
});