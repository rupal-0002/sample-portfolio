// Ensure DOM is fully loaded before executing scripts
document.addEventListener('DOMContentLoaded', () => {

    // --- Dynamic Year in Footer ---
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // --- Mobile Menu Toggle ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links a');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            // Toggle icon between bars and times
            const icon = hamburger.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close mobile menu when a link is clicked
        navLinksItems.forEach(item => {
            item.addEventListener('click', () => {
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    const icon = hamburger.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }

    // --- Intersection Observer for Scroll Animations ---
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Trigger when 15% of the element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing once visible if you only want it to animate once
                // observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    const hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach(el => observer.observe(el));

    // --- Contact Form Basic Validation ---
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nameField  = document.getElementById('name');
            const emailField = document.getElementById('email');
            const messageField = document.getElementById('message');
            
            const name    = nameField    ? nameField.value.trim()    : '';
            const email   = emailField   ? emailField.value.trim()   : '';
            const message = messageField ? messageField.value.trim() : '';
            
            formStatus.className = 'form-status'; // Reset classes
            
            if (name === '' || email === '' || message === '') {
                formStatus.textContent = 'Please fill out all fields.';
                formStatus.classList.add('error');
            } else if (!isValidEmail(email)) {
                formStatus.textContent = 'Please enter a valid email address.';
                formStatus.classList.add('error');
            } else {
                const submitBtn = document.querySelector('.submit-btn');
                const btnOriginalText = submitBtn.innerHTML;
                
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Opening Gmail...';
                submitBtn.disabled = true;

                // Build Gmail compose URL with form data pre-filled
                const recipient = 'rupalsabraham112@gmail.com';
                const subject   = encodeURIComponent(`Portfolio Message from ${name}`);
                const body      = encodeURIComponent(
                    `Hi Rupal,\n\nYou received a new message from your portfolio:\n\n` +
                    `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
                );
                const gmailURL = `https://mail.google.com/mail/?view=cm&to=${recipient}&su=${subject}&body=${body}`;

                // Open Gmail compose in a new tab
                window.open(gmailURL, '_blank');

                // Show success feedback and reset form
                formStatus.textContent = '✅ Gmail opened! Your message is ready to send.';
                formStatus.classList.add('success');
                contactForm.reset();
                submitBtn.innerHTML = btnOriginalText;
                submitBtn.disabled = false;

                // Clear success message after 6 seconds
                setTimeout(() => {
                    formStatus.textContent = '';
                    formStatus.classList.remove('success');
                }, 6000);
            }
        });
    }

    // Helper function to validate email format
    function isValidEmail(email) {
        const re = /^(([^<>()\\[\]\\.,;:\s@"]+(\.[^<>()\\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    // --- White Flakes Background Animation ---
    const canvas = document.getElementById('flakesCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        const flakes = [];
        const flakeCount = 100;

        for (let i = 0; i < flakeCount; i++) {
            flakes.push({
                x: Math.random() * width,
                y: Math.random() * height,
                speedX: (Math.random() - 0.5) * 0.3,
                speedY: Math.random() * 0.4 + 0.2,
                radius: Math.random() * 2 + 1
            });
        }

        function drawFlakes() {
            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.beginPath();
            for (let i = 0; i < flakeCount; i++) {
                let p = flakes[i];
                ctx.moveTo(p.x, p.y);
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2, true);
            }
            ctx.fill();
            updateFlakes();
        }

        function updateFlakes() {
            for (let i = 0; i < flakeCount; i++) {
                let p = flakes[i];

                p.x += p.speedX;
                p.y += p.speedY;

                // Wrap around edges
                if (p.y > height) {
                    p.y = 0;
                    p.x = Math.random() * width;
                }
                if (p.x > width) p.x = 0;
                if (p.x < 0)     p.x = width;
            }
        }

        function loop() {
            drawFlakes();
            requestAnimationFrame(loop);
        }

        loop();

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });
    }

    // --- Interactive Neural Network Animation ---
    const neuralCanvas = document.getElementById('neural-canvas');
    if (neuralCanvas) {
        const nCtx = neuralCanvas.getContext('2d');
        const NW = 280, NH = 280, CX = 140, CY = 140;

        let mX = CX, mY = CY, hovered = false;

        // 4 layers: input(3) → hidden(4) → hidden(4) → output(3)
        const layerDefs = [
            { count: 3, x: 68 },
            { count: 4, x: 112 },
            { count: 4, x: 168 },
            { count: 3, x: 212 }
        ];

        // Build node objects per layer
        const layerNodes = layerDefs.map((ld, li) => {
            const sp = NH / (ld.count + 1);
            return Array.from({ length: ld.count }, (_, i) => ({
                x: ld.x,
                y: sp * (i + 1),
                li,
                phase: Math.random() * Math.PI * 2
            }));
        });
        const allNodes = layerNodes.flat();

        // Build connections between adjacent layers
        const conns = [];
        for (let li = 0; li < layerNodes.length - 1; li++) {
            layerNodes[li].forEach(a => layerNodes[li + 1].forEach(b => conns.push({ a, b })));
        }

        // Signal packets traveling along connections
        const sigs = [];
        function spawnSig() {
            const c = conns[Math.floor(Math.random() * conns.length)];
            const purple = Math.random() > 0.35;
            sigs.push({
                a: c.a, b: c.b, t: 0,
                spd: 0.007 + Math.random() * 0.009,
                cr: purple ? 168 : 232,
                cg: purple ? 85 : 121,
                cb: 247
            });
        }

        // Orbiting particles around the circle edge
        const orbs = [
            { a: 0,    spd:  0.016, r: 118, sz: 4 },
            { a: 2.09, spd: -0.011, r: 123, sz: 3 },
            { a: 4.19, spd:  0.021, r: 115, sz: 5 }
        ];

        // Mouse interaction
        neuralCanvas.addEventListener('mouseenter', () => {
            hovered = true;
            for (let i = 0; i < 6; i++) spawnSig();
        });
        neuralCanvas.addEventListener('mouseleave', () => {
            hovered = false;
            mX = CX; mY = CY;
        });
        neuralCanvas.addEventListener('mousemove', e => {
            const r = neuralCanvas.getBoundingClientRect();
            mX = e.clientX - r.left;
            mY = e.clientY - r.top;
        });

        let fr = 0;

        (function drawNeural() {
            nCtx.clearRect(0, 0, NW, NH);
            fr++;

            // Spawn signals on schedule
            if (fr % (hovered ? 7 : 22) === 0) spawnSig();

            // ── Background circle ──
            const bg = nCtx.createRadialGradient(CX, CY, 0, CX, CY, 134);
            bg.addColorStop(0, '#2d0066');
            bg.addColorStop(1, '#06020A');
            nCtx.beginPath();
            nCtx.arc(CX, CY, 130, 0, Math.PI * 2);
            nCtx.fillStyle = bg;
            nCtx.fill();

            // Pulsing outer ring
            nCtx.beginPath();
            nCtx.arc(CX, CY, 130, 0, Math.PI * 2);
            nCtx.strokeStyle = `rgba(168,85,247,${0.55 + Math.sin(fr * 0.04) * 0.25})`;
            nCtx.lineWidth = 1.8;
            nCtx.stroke();

            // ── Connections ──
            conns.forEach(({ a, b }) => {
                const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
                const hb = hovered ? Math.max(0, 1 - Math.hypot(mx - mX, my - mY) / 88) * 0.6 : 0;
                nCtx.beginPath();
                nCtx.moveTo(a.x, a.y);
                nCtx.lineTo(b.x, b.y);
                nCtx.strokeStyle = `rgba(124,58,237,${0.18 + hb})`;
                nCtx.lineWidth = 0.8 + hb * 1.4;
                nCtx.stroke();
            });

            // ── Signal packets ──
            for (let i = sigs.length - 1; i >= 0; i--) {
                const s = sigs[i];
                s.t += s.spd * (hovered ? 1.9 : 1);
                if (s.t > 1) { sigs.splice(i, 1); continue; }

                const sx = s.a.x + (s.b.x - s.a.x) * s.t;
                const sy = s.a.y + (s.b.y - s.a.y) * s.t;
                const al = Math.sin(s.t * Math.PI); // fade in/out

                // Glow halo
                const grd = nCtx.createRadialGradient(sx, sy, 0, sx, sy, 8);
                grd.addColorStop(0, `rgba(${s.cr},${s.cg},${s.cb},${al})`);
                grd.addColorStop(1, 'rgba(168,85,247,0)');
                nCtx.beginPath();
                nCtx.arc(sx, sy, 8, 0, Math.PI * 2);
                nCtx.fillStyle = grd;
                nCtx.fill();

                // Core dot
                nCtx.beginPath();
                nCtx.arc(sx, sy, 2.5, 0, Math.PI * 2);
                nCtx.fillStyle = `rgba(${s.cr},${s.cg},${s.cb},1)`;
                nCtx.globalAlpha = al;
                nCtx.fill();
                nCtx.globalAlpha = 1;
            }

            // ── Nodes ──
            allNodes.forEach(n => {
                const dist = Math.hypot(n.x - mX, n.y - mY);
                const hb   = hovered ? Math.max(0, 1 - dist / 72) : 0;
                const pulse = 0.6 + Math.sin(fr * 0.05 + n.phase) * 0.4;
                const edge  = n.li === 0 || n.li === layerDefs.length - 1;
                const [cr, cg, cb] = edge ? [168, 85, 247] : [232, 121, 249];

                // Glow
                const gr = 11 + hb * 14;
                const grd = nCtx.createRadialGradient(n.x, n.y, 0, n.x, n.y, gr);
                grd.addColorStop(0, `rgba(${cr},${cg},${cb},${(0.45 + hb * 0.55) * pulse})`);
                grd.addColorStop(1, 'rgba(168,85,247,0)');
                nCtx.beginPath();
                nCtx.arc(n.x, n.y, gr, 0, Math.PI * 2);
                nCtx.fillStyle = grd;
                nCtx.fill();

                // Core
                nCtx.beginPath();
                nCtx.arc(n.x, n.y, 4 + hb * 4, 0, Math.PI * 2);
                nCtx.fillStyle = `rgba(${cr},${cg},${cb},${0.85 + hb * 0.15})`;
                nCtx.fill();

                // Bright centre when hovered closely
                if (hb > 0.3) {
                    nCtx.beginPath();
                    nCtx.arc(n.x, n.y, 2, 0, Math.PI * 2);
                    nCtx.fillStyle = `rgba(255,255,255,${hb * 0.85})`;
                    nCtx.fill();
                }
            });

            // ── Orbital particles ──
            orbs.forEach(o => {
                o.a += o.spd * (hovered ? 1.6 : 1);
                const ox = CX + Math.cos(o.a) * o.r;
                const oy = CY + Math.sin(o.a) * o.r;
                const gal = 0.55 + Math.sin(fr * 0.07 + o.a) * 0.35;

                const grd = nCtx.createRadialGradient(ox, oy, 0, ox, oy, o.sz * 2.2);
                grd.addColorStop(0, `rgba(168,85,247,${gal})`);
                grd.addColorStop(1, 'rgba(168,85,247,0)');
                nCtx.beginPath();
                nCtx.arc(ox, oy, o.sz * 2.2, 0, Math.PI * 2);
                nCtx.fillStyle = grd;
                nCtx.fill();

                nCtx.beginPath();
                nCtx.arc(ox, oy, o.sz, 0, Math.PI * 2);
                nCtx.fillStyle = '#A855F7';
                nCtx.globalAlpha = gal;
                nCtx.fill();
                nCtx.globalAlpha = 1;
            });

            requestAnimationFrame(drawNeural);
        })();

        // Seed initial signals
        for (let i = 0; i < 5; i++) spawnSig();
    }
});
