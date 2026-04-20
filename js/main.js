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
            
            const nameField = document.getElementById('name');
            const emailField = document.getElementById('email');
            const messageField = document.getElementById('message');
            
            const name = nameField ? nameField.value.trim() : '';
            const email = emailField ? emailField.value.trim() : '';
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
                
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                submitBtn.disabled = true;
                
                // Simulate network delay to send message
                setTimeout(() => {
                    formStatus.textContent = 'Thank you! Your message has been sent.';
                    formStatus.classList.add('success');
                    contactForm.reset();
                    submitBtn.innerHTML = btnOriginalText;
                    submitBtn.disabled = false;
                    
                    // Clear the success message after 5 seconds
                    setTimeout(() => {
                        formStatus.textContent = '';
                        formStatus.classList.remove('success');
                    }, 5000);
                }, 1500);
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
                speedX: (Math.random() - 0.5) * 1,
                speedY: Math.random() * 1.5 + 0.5,
                radius: Math.random() * 2 + 1
            });
        }

        function drawFlakes() {
            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
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
                p.y += p.speedY;
                p.x += p.speedX;

                if (p.y > height) {
                    p.y = 0;
                    p.x = Math.random() * width;
                }
                if (p.x > width) p.x = 0;
                if (p.x < 0) p.x = width;
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
});
