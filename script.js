// Smooth scrolling with offset for fixed navbar
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const href = this.getAttribute('href');

        // Для "Главная" всегда крутим в самый верх страницы
        if (href === '#home') {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            return;
        }

        const target = document.querySelector(href);
        const navbar = document.querySelector('.navbar');

        if (target) {
            const rect = target.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const navbarHeight = navbar ? navbar.offsetHeight : 0;
            const offset = 20; // небольшой отступ от верха

            const targetPosition = rect.top + scrollTop - navbarHeight - offset;

            window.scrollTo({
                top: targetPosition < 0 ? 0 : targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

// Close menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Animated counter for stats
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target + (target === 100 ? '%' : '');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start) + (target === 100 ? '%' : '');
        }
    }, 16);
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.3,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            
            // Animate stats if it's the stats section
            if (entry.target.classList.contains('hero-stats')) {
                const statNumbers = entry.target.querySelectorAll('.stat-number');
                statNumbers.forEach(stat => {
                    const target = parseInt(stat.getAttribute('data-target'));
                    animateCounter(stat, target);
                });
            }
        }
    });
}, observerOptions);

// Observe elements
document.querySelectorAll('.hero-stats, .service-card, .project-card, .about-content, .contact-content').forEach(el => {
    observer.observe(el);
});

// Form submission -> отправка на локальный сервер Flask
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(contactForm);

        // Отправляем данные на сервер по адресу http://127.0.0.1:5000/contact
        fetch('http://127.0.0.1:5000/contact', {
            method: 'POST',
            body: new URLSearchParams(formData),
            mode: 'no-cors' // чтобы не упереться в CORS, нам не нужно читать ответ
        })
            .then(() => {
                alert('Спасибо за ваше сообщение! Мы свяжемся с вами в ближайшее время.');
                contactForm.reset();
            })
            .catch(() => {
                alert('Произошла ошибка при отправке. Попробуйте позже.');
            });
    });
}

// Navbar background on scroll
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.background = 'rgba(26, 26, 36, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(91, 155, 213, 0.1)';
    } else {
        navbar.style.background = 'rgba(26, 26, 36, 0.95)';
        navbar.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        hero.style.opacity = 1 - scrolled / 500;
    }
});

// Add glow effect to service cards on hover
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.boxShadow = '0 10px 40px rgba(91, 155, 213, 0.25)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.boxShadow = '0 10px 40px rgba(91, 155, 213, 0.2)';
    });
});

// Animate project cards on scroll
const projectObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 200);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.project-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    projectObserver.observe(card);
});

// Pricing calculator
function updateCalculator() {
    const outlets = parseInt(document.getElementById('calc-outlets')?.value || '0', 10);
    const switches = parseInt(document.getElementById('calc-switches')?.value || '0', 10);
    const cable = parseInt(document.getElementById('calc-cable')?.value || '0', 10);
    const panel = parseInt(document.getElementById('calc-panel')?.value || '0', 10);

    // Базовые ориентировочные цены
    const outletPrice = 400;
    const switchPrice = 350;
    const cablePrice = 120;
    const panelPrice = 6000;

    let total =
        outlets * outletPrice +
        switches * switchPrice +
        cable * cablePrice +
        panel * panelPrice;

    const totalEl = document.getElementById('calc-total');
    if (totalEl) {
        totalEl.textContent = total.toLocaleString('ru-RU') + ' ₽';
    }
}

['calc-outlets', 'calc-switches', 'calc-cable', 'calc-panel'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
        el.addEventListener('input', updateCalculator);
        el.addEventListener('change', updateCalculator);
    }
});

const calcToContactBtn = document.getElementById('calc-to-contact');
if (calcToContactBtn) {
    calcToContactBtn.addEventListener('click', () => {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
}

// Add typing effect to hero title (optional enhancement)
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize animations when page loads
window.addEventListener('load', () => {
    // Add fade-in animation to sections
    document.querySelectorAll('section').forEach((section, index) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        
        setTimeout(() => {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }, index * 200);
    });
});
