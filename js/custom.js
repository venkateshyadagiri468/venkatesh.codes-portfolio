        document.addEventListener('DOMContentLoaded', function() {

            // ─── NEW Project Filter (.proj-filter buttons → data-cat) ───
            const newFilters = document.querySelectorAll('.proj-filter');
            const newCards   = document.querySelectorAll('.proj-card-new');

            newFilters.forEach(btn => {
                btn.addEventListener('click', () => {
                    newFilters.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    const val = btn.getAttribute('data-filter');
                    newCards.forEach(card => {
                        const cat = card.getAttribute('data-cat') || '';
                        const show = val === 'all' || cat === val;
                        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                        if (show) {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                            card.style.display = 'flex';
                        } else {
                            card.style.opacity = '0';
                            card.style.transform = 'scale(0.95)';
                            setTimeout(() => { if (card.style.opacity === '0') card.style.display = 'none'; }, 300);
                        }
                    });
                });
            });

            // ─── Skill Bar Scroll Animation ───
            const bars = document.querySelectorAll('.skill-bar-fill');
            if (bars.length) {
                const barObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('animated');
                            barObserver.unobserve(entry.target);
                        }
                    });
                }, { threshold: 0.3 });
                bars.forEach(bar => barObserver.observe(bar));
            }

            // ─── Bento Card reveal on scroll ───
            const bentoCards = document.querySelectorAll('.bento-card');
            if (bentoCards.length && window.IntersectionObserver) {
                bentoCards.forEach(c => { c.style.opacity = '0'; c.style.transform = 'translateY(24px)'; c.style.transition = 'opacity 0.5s ease, transform 0.5s ease'; });
                const bentoObs = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0)';
                            bentoObs.unobserve(entry.target);
                        }
                    });
                }, { threshold: 0.1 });
                bentoCards.forEach(c => bentoObs.observe(c));
            }

            // ─── Project card fade-in ───
            if (window.IntersectionObserver) {
                newCards.forEach(c => { c.style.opacity = '0'; c.style.transform = 'translateY(30px)'; c.style.transition = 'opacity 0.55s ease, transform 0.55s ease'; });
                const cardObs = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0)';
                            cardObs.unobserve(entry.target);
                        }
                    });
                }, { threshold: 0.1 });
                newCards.forEach(c => cardObs.observe(c));
            }

            // ─── Timeline item fade-in ───
            const tlItems = document.querySelectorAll('.exp-tl-item');
            if (tlItems.length && window.IntersectionObserver) {
                tlItems.forEach(c => { c.style.opacity = '0'; c.style.transform = 'translateX(-20px)'; c.style.transition = 'opacity 0.6s ease, transform 0.6s ease'; });
                const tlObs = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateX(0)';
                            tlObs.unobserve(entry.target);
                        }
                    });
                }, { threshold: 0.15 });
                tlItems.forEach(c => tlObs.observe(c));
            }

            // ─── Custom Interactive Cursor Dot & Ring ───
            if (!('ontouchstart' in window)) {
                const dot = document.createElement('div');
                dot.id = 'cursor-dot';
                const ring = document.createElement('div');
                ring.id = 'cursor-ring';
                document.body.appendChild(dot);
                document.body.appendChild(ring);

                let mouseX = 0, mouseY = 0;
                let ringX = 0, ringY = 0;

                window.addEventListener('mousemove', (e) => {
                    mouseX = e.clientX;
                    mouseY = e.clientY;
                    dot.style.left = `${mouseX}px`;
                    dot.style.top = `${mouseY}px`;
                });

                function renderCursor() {
                    ringX += (mouseX - ringX) * 0.18;
                    ringY += (mouseY - ringY) * 0.18;
                    ring.style.left = `${ringX}px`;
                    ring.style.top = `${ringY}px`;
                    requestAnimationFrame(renderCursor);
                }
                requestAnimationFrame(renderCursor);
            }

            // ─── Bento Cards: Mouse & Touch Spotlight & 3D Tilt ───
            bentoCards.forEach(card => {
                // Add spotlight div if not present
                if (!card.querySelector('.bento-spotlight')) {
                    const spotlight = document.createElement('div');
                    spotlight.className = 'bento-spotlight';
                    card.appendChild(spotlight);
                }

                const handlePointerMove = (clientX, clientY) => {
                    const rect = card.getBoundingClientRect();
                    const x = clientX - rect.left;
                    const y = clientY - rect.top;
                    card.style.setProperty('--mx', `${(x / rect.width) * 100}%`);
                    card.style.setProperty('--my', `${(y / rect.height) * 100}%`);

                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    const rotateX = ((y - centerY) / centerY) * -6;
                    const rotateY = ((x - centerX) / centerX) * 6;

                    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.012)`;
                    const spotlightEl = card.querySelector('.bento-spotlight');
                    if (spotlightEl) spotlightEl.style.opacity = '1';
                };

                const resetPointer = () => {
                    card.style.transform = '';
                    const spotlightEl = card.querySelector('.bento-spotlight');
                    if (spotlightEl) spotlightEl.style.opacity = '';
                };

                card.addEventListener('mousemove', (e) => handlePointerMove(e.clientX, e.clientY));
                card.addEventListener('mouseleave', resetPointer);

                // Mobile Touch Support
                card.addEventListener('touchstart', (e) => {
                    if (e.touches.length > 0) handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
                }, { passive: true });
                card.addEventListener('touchmove', (e) => {
                    if (e.touches.length > 0) handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
                }, { passive: true });
                card.addEventListener('touchend', resetPointer);
                card.addEventListener('touchcancel', resetPointer);
            });

            // ─── Project Cards: Touch Highlight Support ───
            newCards.forEach(card => {
                card.addEventListener('touchstart', () => {
                    card.classList.add('touch-active');
                }, { passive: true });
                card.addEventListener('touchend', () => {
                    setTimeout(() => card.classList.remove('touch-active'), 400);
                });
            });

            // ─── Tech Tags: Dynamic Color Glow on Hover & Touch ───
            const techTags = document.querySelectorAll('.tech-tag');
            techTags.forEach(tag => {
                const dot = tag.querySelector('.tech-tag-dot');
                if (dot) {
                    const color = dot.style.backgroundColor || '#38bdf8';
                    tag.style.setProperty('--tag-glow', `${color}1a`);
                    tag.style.setProperty('--tag-shadow', `${color}40`);
                }
                tag.addEventListener('touchstart', () => {
                    tag.style.transform = 'translateX(5px) scale(1.02)';
                }, { passive: true });
                tag.addEventListener('touchend', () => {
                    setTimeout(() => tag.style.transform = '', 300);
                });
            });

            // ─── Filter Buttons: Mouse & Touch Ripple Origin ───
            newFilters.forEach(btn => {
                const handleFilterPointer = (clientX, clientY) => {
                    const rect = btn.getBoundingClientRect();
                    btn.style.setProperty('--rx', `${((clientX - rect.left) / rect.width) * 100}%`);
                    btn.style.setProperty('--ry', `${((clientY - rect.top) / rect.height) * 100}%`);
                };
                btn.addEventListener('mousemove', (e) => handleFilterPointer(e.clientX, e.clientY));
                btn.addEventListener('touchstart', (e) => {
                    if (e.touches.length > 0) handleFilterPointer(e.touches[0].clientX, e.touches[0].clientY);
                }, { passive: true });
            });

            // ─── Contact Form Handler ───
            const contactForm = document.getElementById('portfolio-contact-form');
            const alertBox = document.getElementById('contact-form-alert');
            const submitBtn = document.getElementById('contact-submit-btn');

            if (contactForm) {
                contactForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    const name    = document.getElementById('contact-name').value.trim();
                    const email   = document.getElementById('contact-email').value.trim();
                    const message = document.getElementById('contact-message').value.trim();

                    if (!name || !email || !message) {
                        alertBox.style.display = 'block';
                        alertBox.style.background = 'rgba(244, 63, 94, 0.15)';
                        alertBox.style.border = '1px solid #f43f5e';
                        alertBox.style.color = '#f43f5e';
                        alertBox.innerHTML = '⚠️ Please fill in all required fields before sending.';
                        return;
                    }

                    submitBtn.disabled = true;
                    submitBtn.innerText = 'Preparing Message...';

                    const subject    = encodeURIComponent(`Portfolio Inquiry from ${name}`);
                    const body       = encodeURIComponent(`Hello Venkatesh,\n\n${message}\n\nBest regards,\n${name}\nEmail: ${email}`);
                    const mailtoUrl  = `mailto:venkateshyadagiri468@gmail.com?subject=${subject}&body=${body}`;

                    setTimeout(() => {
                        window.location.href = mailtoUrl;
                        alertBox.style.display = 'block';
                        alertBox.style.background = 'rgba(52, 211, 153, 0.15)';
                        alertBox.style.border = '1px solid #34d399';
                        alertBox.style.color = '#34d399';
                        alertBox.innerHTML = `✓ <strong>Thank you ${name}!</strong> Opening your email client.<br><span style="font-size:0.85rem; color:#cbd5e1; font-weight:400;">If your mail app didn't launch, <a href="${mailtoUrl}" style="color:#38bdf8; text-decoration:underline;">click here to email directly</a>.</span>`;
                        submitBtn.disabled = false;
                        submitBtn.innerText = 'Send Message';
                        contactForm.reset();
                    }, 500);
                });
            }
        });
