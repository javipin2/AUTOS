

document.addEventListener('DOMContentLoaded', function() {
    // ===== PRELOADER =====
    const preloader = document.querySelector('.preloader');

    window.addEventListener('load', function() {
        setTimeout(() => {
            preloader.classList.add('hidden');
            // Remove preloader from DOM after animation
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }, 800);
    });

    // ===== NAVBAR SCROLL EFFECT =====
    const navbar = document.querySelector('.navbar');

    function handleNavbarScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleNavbarScroll);
    // Check on page load
    handleNavbarScroll();

    // ===== MOBILE MENU CLOSE ON LINK CLICK =====
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const navbarCollapse = document.querySelector('.navbar-collapse');

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navbarCollapse.classList.contains('show')) {
                const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                if (bsCollapse) {
                    bsCollapse.hide();
                }
            }
        });
    });

    // ===== FADE IN ANIMATIONS ON SCROLL =====
    const fadeElements = document.querySelectorAll('.fade-in');

    const fadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                fadeInObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    fadeElements.forEach(element => {
        fadeInObserver.observe(element);
    });

    // ===== FLEET FILTER FUNCTIONALITY =====
    const filterButtons = document.querySelectorAll('.filter-btn');
    const carItems = document.querySelectorAll('.car-item');

    if (filterButtons.length > 0 && carItems.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                button.classList.add('active');

                const filter = button.getAttribute('data-filter');

                carItems.forEach(item => {
                    const category = item.getAttribute('data-category');

                    if (filter === 'all' || category === filter) {
                        item.style.display = 'block';
                        // Re-trigger fade animation
                        setTimeout(() => {
                            item.querySelector('.car-card').classList.add('visible');
                        }, 100);
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });

        // Check URL params for brand filter
        const urlParams = new URLSearchParams(window.location.search);
        const brandParam = urlParams.get('marca');

        if (brandParam) {
            carItems.forEach(item => {
                const brand = item.getAttribute('data-brand');
                if (brand === brandParam) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });

            // Update page title or add indicator
            const pageTitle = document.querySelector('.page-hero h1');
            if (pageTitle) {
                const brandName = brandParam.charAt(0).toUpperCase() + brandParam.slice(1).replace('-', ' ');
                pageTitle.innerHTML = `Flota <span class="text-gold">${brandName}</span>`;
            }
        }
    }

    // ===== FORM HANDLING =====
    const contactForm = document.getElementById('contactForm');
    const quickReservationForm = document.getElementById('quickReservation');

    function handleFormSubmit(form, formName) {
        if (!form) return;

        form.addEventListener('submit', function(e) {
            e.preventDefault();

            // Basic validation
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;

            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.style.borderColor = '#ff4444';
                    field.addEventListener('input', function() {
                        this.style.borderColor = '';
                    }, { once: true });
                }
            });

            if (!isValid) {
                showNotification('Por favor, completa todos los campos obligatorios.', 'error');
                return;
            }

            // Simulate form submission
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Enviando...';
            submitBtn.disabled = true;

            setTimeout(() => {
                showNotification('¡Solicitud enviada con éxito! Te contactaremos pronto.', 'success');
                form.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }

    handleFormSubmit(contactForm, 'Contacto');
    handleFormSubmit(quickReservationForm, 'Reserva Rápida');

    // ===== NOTIFICATION SYSTEM =====
    function showNotification(message, type = 'success') {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 15px 25px;
            background: ${type === 'success' ? '#1a472a' : '#4a1a1a'};
            border: 1px solid ${type === 'success' ? '#D4AF37' : '#ff4444'};
            border-radius: 8px;
            color: #fff;
            font-size: 0.95rem;
            z-index: 10000;
            animation: slideIn 0.3s ease;
            box-shadow: 0 10px 40px rgba(0,0,0,0.5);
        `;

        // Add animation keyframes
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .notification-content i {
                    font-size: 1.2rem;
                    color: ${type === 'success' ? '#D4AF37' : '#ff4444'};
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);

        // Auto remove
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }

    // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===== DATE INPUT VALIDATION =====
    const dateInputs = document.querySelectorAll('input[type="date"]');
    const today = new Date().toISOString().split('T')[0];

    dateInputs.forEach(input => {
        input.setAttribute('min', today);

        // Style the date inputs for dark theme
        input.addEventListener('focus', function() {
            this.style.colorScheme = 'dark';
        });
    });

    // ===== CAR CARD HOVER EFFECTS =====
    const carCards = document.querySelectorAll('.car-card');

    carCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // ===== LAZY LOADING IMAGES =====
    const images = document.querySelectorAll('img[src*="unsplash"]');

    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.style.opacity = '1';
                imageObserver.unobserve(img);
            }
        });
    }, {
        threshold: 0.1
    });

    images.forEach(img => {
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.5s ease';
        imageObserver.observe(img);
    });

    // ===== BACK TO TOP BUTTON =====
    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.setAttribute('aria-label', 'Volver arriba');
    backToTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #D4AF37 0%, #b8962e 100%);
        color: #0a0a0a;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        font-size: 1.2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 999;
        box-shadow: 0 5px 20px rgba(212, 175, 55, 0.3);
    `;

    document.body.appendChild(backToTopBtn);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTopBtn.style.opacity = '1';
            backToTopBtn.style.visibility = 'visible';
        } else {
            backToTopBtn.style.opacity = '0';
            backToTopBtn.style.visibility = 'hidden';
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    backToTopBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px)';
    });

    backToTopBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });

    // ===== COUNTER ANIMATION =====
    const counters = document.querySelectorAll('.spec-box .value');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const value = target.textContent;

                // Only animate if it's a number
                if (!isNaN(parseInt(value))) {
                    animateCounter(target, parseInt(value));
                }

                counterObserver.unobserve(target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });

    function animateCounter(element, target) {
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 20);
    }

    // ===== PARALLAX EFFECT FOR HERO =====
    const heroSection = document.querySelector('.hero');
    const heroBg = document.querySelector('.hero-bg img');

    if (heroSection && heroBg) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            const rate = scrolled * 0.3;
            heroBg.style.transform = `translateY(${rate}px) scale(1.1)`;
        });
    }

    // ===== TESTIMONIAL CARDS STAGGER ANIMATION =====
    const testimonialCards = document.querySelectorAll('.testimonial-card');

    testimonialCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.2}s`;
    });

    // ===== PHONE NUMBER FORMATTING =====
    const phoneInputs = document.querySelectorAll('input[type="tel"]');

    phoneInputs.forEach(input => {
        input.addEventListener('input', function() {
            // Allow only numbers, spaces, and + sign
            this.value = this.value.replace(/[^0-9+\s]/g, '');
        });
    });

    // ===== CONSOLE BRANDING =====
    console.log(
        '%c MDTECH SOFT %c Luxury Car Rental ',
        'background: #D4AF37; color: #0a0a0a; font-size: 20px; font-weight: bold; padding: 10px 20px;',
        'background: #0a0a0a; color: #D4AF37; font-size: 14px; padding: 10px 20px;'
    );
});

// ===== IMAGE GALLERY FUNCTION (for detalle.html) =====
function changeImage(thumb) {
    const mainImage = document.getElementById('mainImage');
    const thumbnails = document.querySelectorAll('.car-thumbnail');

    thumbnails.forEach(t => t.classList.remove('active'));
    thumb.classList.add('active');

    const newSrc = thumb.src.replace('w=200', 'w=1200');
    mainImage.style.opacity = '0';
    mainImage.style.transform = 'scale(0.95)';

    setTimeout(() => {
        mainImage.src = newSrc;
        mainImage.style.opacity = '1';
        mainImage.style.transform = 'scale(1)';
    }, 200);
}
