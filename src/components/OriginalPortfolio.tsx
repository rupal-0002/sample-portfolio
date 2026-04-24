"use client";

import { useEffect, useRef, useState } from "react";
import "../app/portfolio.css"; 

export function OriginalPortfolio() {
  const flakesCanvasRef = useRef<HTMLCanvasElement>(null);
  const neuralCanvasRef = useRef<HTMLCanvasElement>(null);
  const formStatusRef = useRef<HTMLDivElement>(null);
  const [menuActive, setMenuActive] = useState(false);

  useEffect(() => {
    // --- Dynamic Year in Footer ---
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear().toString();
    }

    // --- Intersection Observer for Scroll Animations ---
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    const hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach(el => observer.observe(el));

    // --- White Flakes Background Animation ---
    const canvas = flakesCanvasRef.current;
    let flakesAnimationId: number;
    if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
            let width = canvas.width = window.innerWidth;
            let height = canvas.height = window.innerHeight;

            const flakes: any[] = [];
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

            const drawFlakes = () => {
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
            };

            const updateFlakes = () => {
                for (let i = 0; i < flakeCount; i++) {
                    let p = flakes[i];

                    p.x += p.speedX;
                    p.y += p.speedY;

                    if (p.y > height) {
                        p.y = 0;
                        p.x = Math.random() * width;
                    }
                    if (p.x > width) p.x = 0;
                    if (p.x < 0)     p.x = width;
                }
            };

            const loop = () => {
                drawFlakes();
                flakesAnimationId = requestAnimationFrame(loop);
            };

            loop();

            const handleResize = () => {
                width = canvas.width = window.innerWidth;
                height = canvas.height = window.innerHeight;
            };
            window.addEventListener('resize', handleResize);
            
            // cleanup inner event
            return () => window.removeEventListener('resize', handleResize);
        }
    }

    // --- Interactive Neural Network Animation ---
    const neuralCanvas = neuralCanvasRef.current;
    let neuralAnimationId: number;
    if (neuralCanvas) {
        const nCtx = neuralCanvas.getContext('2d');
        if (nCtx) {
            const NW = 280, NH = 280, CX = 140, CY = 140;
            let mX = CX, mY = CY, hovered = false;

            const layerDefs = [
                { count: 3, x: 68 },
                { count: 4, x: 112 },
                { count: 4, x: 168 },
                { count: 3, x: 212 }
            ];

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

            const conns: any[] = [];
            for (let li = 0; li < layerNodes.length - 1; li++) {
                layerNodes[li].forEach(a => layerNodes[li + 1].forEach(b => conns.push({ a, b })));
            }

            const sigs: any[] = [];
            const spawnSig = () => {
                const c = conns[Math.floor(Math.random() * conns.length)];
                const purple = Math.random() > 0.35;
                sigs.push({
                    a: c.a, b: c.b, t: 0,
                    spd: 0.007 + Math.random() * 0.009,
                    cr: purple ? 168 : 232,
                    cg: purple ? 85 : 121,
                    cb: 247
                });
            };

            const orbs = [
                { a: 0,    spd:  0.016, r: 118, sz: 4 },
                { a: 2.09, spd: -0.011, r: 123, sz: 3 },
                { a: 4.19, spd:  0.021, r: 115, sz: 5 }
            ];

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

            const drawNeural = () => {
                nCtx.clearRect(0, 0, NW, NH);
                fr++;

                if (fr % (hovered ? 7 : 22) === 0) spawnSig();

                const bg = nCtx.createRadialGradient(CX, CY, 0, CX, CY, 134);
                bg.addColorStop(0, '#2d0066');
                bg.addColorStop(1, '#06020A');
                nCtx.beginPath();
                nCtx.arc(CX, CY, 130, 0, Math.PI * 2);
                nCtx.fillStyle = bg;
                nCtx.fill();

                nCtx.beginPath();
                nCtx.arc(CX, CY, 130, 0, Math.PI * 2);
                nCtx.strokeStyle = `rgba(168,85,247,${0.55 + Math.sin(fr * 0.04) * 0.25})`;
                nCtx.lineWidth = 1.8;
                nCtx.stroke();

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

                for (let i = sigs.length - 1; i >= 0; i--) {
                    const s = sigs[i];
                    s.t += s.spd * (hovered ? 1.9 : 1);
                    if (s.t > 1) { sigs.splice(i, 1); continue; }

                    const sx = s.a.x + (s.b.x - s.a.x) * s.t;
                    const sy = s.a.y + (s.b.y - s.a.y) * s.t;
                    const al = Math.sin(s.t * Math.PI); 

                    const grd = nCtx.createRadialGradient(sx, sy, 0, sx, sy, 8);
                    grd.addColorStop(0, `rgba(${s.cr},${s.cg},${s.cb},${al})`);
                    grd.addColorStop(1, 'rgba(168,85,247,0)');
                    nCtx.beginPath();
                    nCtx.arc(sx, sy, 8, 0, Math.PI * 2);
                    nCtx.fillStyle = grd;
                    nCtx.fill();

                    nCtx.beginPath();
                    nCtx.arc(sx, sy, 2.5, 0, Math.PI * 2);
                    nCtx.fillStyle = `rgba(${s.cr},${s.cg},${s.cb},1)`;
                    nCtx.globalAlpha = al;
                    nCtx.fill();
                    nCtx.globalAlpha = 1;
                }

                allNodes.forEach(n => {
                    const dist = Math.hypot(n.x - mX, n.y - mY);
                    const hb   = hovered ? Math.max(0, 1 - dist / 72) : 0;
                    const pulse = 0.6 + Math.sin(fr * 0.05 + n.phase) * 0.4;
                    const edge  = n.li === 0 || n.li === layerDefs.length - 1;
                    const [cr, cg, cb] = edge ? [168, 85, 247] : [232, 121, 249];

                    const gr = 11 + hb * 14;
                    const grd = nCtx.createRadialGradient(n.x, n.y, 0, n.x, n.y, gr);
                    grd.addColorStop(0, `rgba(${cr},${cg},${cb},${(0.45 + hb * 0.55) * pulse})`);
                    grd.addColorStop(1, 'rgba(168,85,247,0)');
                    nCtx.beginPath();
                    nCtx.arc(n.x, n.y, gr, 0, Math.PI * 2);
                    nCtx.fillStyle = grd;
                    nCtx.fill();

                    nCtx.beginPath();
                    nCtx.arc(n.x, n.y, 4 + hb * 4, 0, Math.PI * 2);
                    nCtx.fillStyle = `rgba(${cr},${cg},${cb},${0.85 + hb * 0.15})`;
                    nCtx.fill();

                    if (hb > 0.3) {
                        nCtx.beginPath();
                        nCtx.arc(n.x, n.y, 2, 0, Math.PI * 2);
                        nCtx.fillStyle = `rgba(255,255,255,${hb * 0.85})`;
                        nCtx.fill();
                    }
                });

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

                neuralAnimationId = requestAnimationFrame(drawNeural);
            };

            drawNeural();

            for (let i = 0; i < 5; i++) spawnSig();
        }
    }

    return () => {
        if (flakesAnimationId) cancelAnimationFrame(flakesAnimationId);
        if (neuralAnimationId) cancelAnimationFrame(neuralAnimationId);
    };
  }, []);

  const handleContactSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const message = formData.get('message') as string;
    
    if (!formStatusRef.current) return;
    
    formStatusRef.current.className = 'form-status'; 
    
    const isValidEmail = (email: string) => {
        const re = /^(([^<>()\\[\]\\.,;:\s@"]+(\.[^<>()\\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    if (name === '' || email === '' || message === '') {
        formStatusRef.current.textContent = 'Please fill out all fields.';
        formStatusRef.current.classList.add('error');
    } else if (!isValidEmail(email)) {
        formStatusRef.current.textContent = 'Please enter a valid email address.';
        formStatusRef.current.classList.add('error');
    } else {
        const recipient = 'rupalsabraham112@gmail.com';
        const subject   = encodeURIComponent(`Portfolio Message from ${name}`);
        const body      = encodeURIComponent(
            `Hi Rupal,\n\nYou received a new message from your portfolio:\n\n` +
            `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
        );
        const gmailURL = `https://mail.google.com/mail/?view=cm&to=${recipient}&su=${subject}&body=${body}`;

        window.open(gmailURL, '_blank');

        formStatusRef.current.textContent = '✅ Gmail opened! Your message is ready to send.';
        formStatusRef.current.classList.add('success');
        (e.target as HTMLFormElement).reset();

        setTimeout(() => {
            if(formStatusRef.current) {
                formStatusRef.current.textContent = '';
                formStatusRef.current.classList.remove('success');
            }
        }, 6000);
    }
  };

  return (
    <div className="original-portfolio-wrapper">
        <canvas id="flakesCanvas" ref={flakesCanvasRef} className="flakes-bg"></canvas>
        {/* Navbar */}
        <nav className="navbar">
            <div className="nav-container">
                <a href="#hero" className="logo">RUPAL</a>
                <div className={`nav-links ${menuActive ? 'active' : ''}`}>
                    <a href="#about" onClick={() => setMenuActive(false)}>About</a>
                    <a href="#projects" onClick={() => setMenuActive(false)}>Projects</a>
                    <a href="#education" onClick={() => setMenuActive(false)}>Education</a>
                    <a href="#contact" onClick={() => setMenuActive(false)}>Contact</a>
                </div>
                <div className="hamburger" onClick={() => setMenuActive(!menuActive)}>
                    <i className={`fas ${menuActive ? 'fa-times' : 'fa-bars'}`}></i>
                </div>
            </div>
        </nav>

        {/* Hero Section */}
        <section id="hero" className="hero section hidden">
            <div className="hero-content">
                <p className="greeting">Hi, I&apos;m</p>
                <h1 className="name">RUPAL</h1>
                <h2 className="title">CS & AI Student | Developer</h2>
                <p className="tagline">Passionate about Artificial Intelligence, Machine Learning, and building modern software. Currently a first-year building a strong foundation in Computer Science.</p>
                <div className="hero-cta">
                    <a href="#projects" className="btn btn-primary">View Projects</a>
                    <a href="#contact" className="btn btn-outline">Contact Me</a>
                </div>
            </div>
            <div className="hero-graphic">
                <div className="circle-graphic">
                    <img src="/images/profile-new.png" alt="Rupal's Profile Photo" className="hero-profile-img" />
                </div>
            </div>
        </section>

        {/* About Section */}
        <section id="about" className="about section hidden">
            <h2 className="section-title">About Me</h2>
            <div className="about-content">
                <div className="about-text">
                    <p>Hello! I&apos;m a first-year Computer Science student specializing in Artificial Intelligence at AMAL JYOTHI COLLEGE OF ENGINEERING. I have a strong interest in understanding how machines learn and applying algorithms to solve real-world problems.</p>
                    <p>When I&apos;m not studying or building projects, you can find me reading about the tech industry, participating in hackathons, or continuously expanding my skill set to build impactful software.</p>
                </div>
                <div className="about-photo">
                    <div className="about-graphic">
                        <canvas id="neural-canvas" ref={neuralCanvasRef} width="280" height="280" style={{cursor: 'crosshair', display: 'block'}}></canvas>
                        <p className="graphic-label">AI &amp; ML Explorer</p>
                    </div>
                </div>
            </div>
            
            <div className="skills-container">
                <h3 className="skills-title"><i className="fas fa-code"></i> Skills & Technologies</h3>
                <div className="skills-grid">
                    <div className="skill-item"><i className="fab fa-python skill-icon"></i><span>Python</span></div>
                    <div className="skill-item"><i className="fas fa-c skill-icon"></i><span>C</span></div>
                    <div className="skill-item"><i className="fab fa-java skill-icon"></i><span>Java</span></div>
                    <div className="skill-item"><i className="fab fa-html5 skill-icon"></i><span>HTML/CSS</span></div>
                    <div className="skill-item"><i className="fab fa-git-alt skill-icon"></i><span>Git</span></div>
                </div>
            </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="projects section hidden">
            <h2 className="section-title">Featured Projects</h2>
            <div className="projects-grid">
                <div className="project-card">
                    <div className="project-img-container">
                        <img src="https://via.placeholder.com/400x250/1a1a2e/00BFFF?text=AI+Classifier" alt="AI Image Classifier Project" className="project-img" />
                    </div>
                    <div className="project-info">
                        <h3 className="project-title">AI Image Classifier</h3>
                        <p className="project-desc">A deep learning model that classifies images into specific categories using convolutional neural networks (CNNs).</p>
                        <div className="project-tags">
                            <span>Python</span>
                            <span>TensorFlow</span>
                        </div>
                        <div className="project-links">
                            <a href="https://github.com" target="_blank"><i className="fab fa-github"></i> Code</a>
                            <a href="#" target="_blank"><i className="fas fa-external-link-alt"></i> Demo</a>
                        </div>
                    </div>
                </div>
                <div className="project-card">
                    <div className="project-img-container">
                        <img src="https://via.placeholder.com/400x250/1a1a2e/00BFFF?text=DSA+Visualizer" alt="DSA Visualizer Project" className="project-img" />
                    </div>
                    <div className="project-info">
                        <h3 className="project-title">DSA Visualizer</h3>
                        <p className="project-desc">An interactive web application that helps users understand sorting and pathfinding algorithms visually.</p>
                        <div className="project-tags">
                            <span>JavaScript</span>
                            <span>HTML Canvas</span>
                        </div>
                        <div className="project-links">
                            <a href="https://github.com" target="_blank"><i className="fab fa-github"></i> Code</a>
                            <a href="#" target="_blank"><i className="fas fa-external-link-alt"></i> Demo</a>
                        </div>
                    </div>
                </div>
                <div className="project-card">
                    <div className="project-img-container">
                        <img src="/images/password_checker.png" alt="Password Strength Checker Project" className="project-img" />
                    </div>
                    <div className="project-info">
                        <h3 className="project-title">Password Strength Checker</h3>
                        <p className="project-desc">A Python-based utility that evaluates password security by checking for length, complexity, and common patterns, helping users create stronger passwords.</p>
                        <div className="project-tags">
                            <span>Python</span>
                            <span>Security</span>
                        </div>
                        <div className="project-links">
                            <a href="https://github.com/rupal-0002/password" target="_blank"><i className="fab fa-github"></i> Code</a>
                        </div>
                    </div>
                </div>
                <div className="project-card">
                    <div className="project-img-container">
                        <img src="/images/hangman_cover.png" alt="Hangman Game Project" className="project-img" />
                    </div>
                    <div className="project-info">
                        <h3 className="project-title">Hangman Game</h3>
                        <p className="project-desc">A classic word-guessing game built for the browser. Players guess letters to reveal hidden words before running out of attempts.</p>
                        <div className="project-tags">
                            <span>HTML</span>
                            <span>CSS</span>
                            <span>JavaScript</span>
                        </div>
                        <div className="project-links">
                            <a href="https://github.com/rupal-0002/hangman" target="_blank"><i className="fab fa-github"></i> Code</a>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Education Section */}
        <section id="education" className="education section hidden">
            <h2 className="section-title">Education</h2>
            <div className="timeline">
                <div className="timeline-item">
                    <div className="timeline-dot"></div>
                    <div className="timeline-content">
                        <h3 className="degree">Computer Science(AI) Engineer</h3>
                        <h4 className="university">AMAL JYOTHI COLLEGE OF ENGINEERING</h4>
                        <p className="timeline-date">2025 - 2029</p>
                        <p className="coursework"><strong>Relevant Coursework:</strong> Introduction to AI, Data Structures & Algorithms, Object-Oriented Programming, Calculus, Linear Algebra.</p>
                    </div>
                </div>
            </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="contact section hidden">
            <h2 className="section-title">Get In Touch</h2>
            <p className="contact-desc">Interested in collaborating or have a question? Feel free to reach out!</p>
            
            <div className="contact-container">
                <div className="contact-info">
                    <a href="mailto:rupalsabraham112@gmail.com" className="contact-link">
                        <i className="fas fa-envelope"></i> rupalsabraham112@gmail.com
                    </a>
                    <div className="social-links">
                        <a href="https://www.linkedin.com/in/rupal-s-abraham-9b18a837a/" target="_blank" aria-label="LinkedIn"><i className="fab fa-linkedin"></i></a>
                        <a href="https://github.com" target="_blank" aria-label="GitHub"><i className="fab fa-github"></i></a>
                        <a href="https://www.instagram.com/i.rupall/?hl=en" target="_blank" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
                    </div>
                </div>

                <form id="contact-form" className="contact-form" onSubmit={handleContactSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input type="text" id="name" name="name" required placeholder="John Doe" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" required placeholder="john@example.com" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="phone">Phone Number</label>
                        <div className="phone-input">
                            <select id="country-code" name="country-code" required defaultValue="">
                                <option value="" disabled>Code</option>
                                <option value="+1">🇺🇸 +1 (US/CA)</option>
                                <option value="+44">🇬🇧 +44 (UK)</option>
                                <option value="+91">🇮🇳 +91 (IN)</option>
                                <option value="+61">🇦🇺 +61 (AU)</option>
                                <option value="+81">🇯🇵 +81 (JP)</option>
                                <option value="+49">🇩🇪 +49 (DE)</option>
                                <option value="+33">🇫🇷 +33 (FR)</option>
                                <option value="+86">🇨🇳 +86 (CN)</option>
                                <option value="+55">🇧🇷 +55 (BR)</option>
                                <option value="+971">🇦🇪 +971 (UAE)</option>
                                <option value="+39">🇮🇹 +39 (IT)</option>
                            </select>
                            <input type="tel" id="phone" name="phone" required placeholder="9876543210" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="message">Message</label>
                        <textarea id="message" name="message" rows={5} required placeholder="Hi there..."></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary submit-btn">Send Message <i className="fas fa-paper-plane"></i></button>
                    <div id="form-status" ref={formStatusRef} className="form-status"></div>
                </form>
            </div>
        </section>

        {/* Footer */}
        <footer>
            <p>&copy; <span id="year"></span> RUPAL. Built from scratch.</p>
        </footer>
    </div>
  );
}
