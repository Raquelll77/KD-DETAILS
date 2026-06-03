// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// Mobile menu
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
});

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Close menu on outside click
document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// Scroll animations
const observerOptions = {
    threshold: 0.05,
    rootMargin: '0px 0px 0px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('aos-animate');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('[data-aos]').forEach(el => observer.observe(el));

// Fallback: reveal all animated elements after 3 seconds
setTimeout(() => {
    document.querySelectorAll('[data-aos]:not(.aos-animate)').forEach(el => {
        el.classList.add('aos-animate');
    });
}, 3000);

// Counter animation
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counters = entry.target.querySelectorAll('[data-count]');
            counters.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-count'));
                let current = 0;
                const increment = target / 60;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        counter.textContent = target;
                        clearInterval(timer);
                    } else {
                        counter.textContent = Math.floor(current);
                    }
                }, 25);
            });
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.about-stats');
if (statsSection) counterObserver.observe(statsSection);

// Load gallery from JSON
const categoryNames = {
    interior: 'Interior',
    exterior: 'Exterior',
    completo: 'Detailing Completo',
    'antes-despues': 'Antes / Después',
    motor: 'Motor'
};

function loadGallery() {
    const grid = document.getElementById('galleryGrid');
    const empty = document.getElementById('galleryEmpty');

    const sources = ['data/gallery.json'];

    function tryLoad(index) {
        if (index >= sources.length) return;

        fetch(sources[index])
            .then(res => {
                if (!res.ok) throw new Error('Not found');
                return res.json();
            })
            .then(photos => {
                if (!photos || photos.length === 0) {
                    if (empty) empty.style.display = 'block';
                    return;
                }
                if (empty) empty.style.display = 'none';
                grid.innerHTML = '';

                photos.reverse().forEach(photo => {
                    const item = document.createElement('div');
                    item.className = 'gallery-item';
                    item.setAttribute('data-aos', '');
                    item.style.position = 'relative';
                    item.style.overflow = 'hidden';
                    item.style.borderRadius = '12px';
                    item.style.cursor = 'pointer';
                    item.innerHTML = `
                        <img src="uploads/gallery/${photo.filename}" alt="${photo.title}" loading="lazy">
                        <div class="gallery-overlay">
                            <span>${categoryNames[photo.category] || photo.category}</span>
                            <p>${photo.title}</p>
                        </div>
                    `;
                    item.addEventListener('click', () => openLightbox(`uploads/gallery/${photo.filename}`));
                    grid.appendChild(item);
                });

                // Re-observe new elements for scroll animation
                grid.querySelectorAll('[data-aos]').forEach(el => {
                    el.classList.add('aos-animate');
                });
            })
            .catch(() => tryLoad(index + 1));
    }

    tryLoad(0);
}

loadGallery();

// Lightbox
function openLightbox(src) {
    const lightbox = document.getElementById('lightbox');
    const img = document.getElementById('lightboxImg');
    img.src = src;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

document.getElementById('lightbox').addEventListener('click', (e) => {
    if (e.target === e.currentTarget || e.target.id === 'lightboxClose') {
        e.currentTarget.classList.remove('active');
        document.body.style.overflow = '';
    }
});

document.getElementById('lightboxClose').addEventListener('click', () => {
    document.getElementById('lightbox').classList.remove('active');
    document.body.style.overflow = '';
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.getElementById('lightbox').classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Form submission via WhatsApp
document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const telefono = document.getElementById('telefono').value;
    const servicio = document.getElementById('servicio').value;
    const vehiculo = document.getElementById('vehiculo').value;
    const mensaje = document.getElementById('mensaje').value;

    const servicioNames = {
        interior: 'Shampuseado Interior',
        exterior: 'Lavado Exterior',
        completo: 'Detailing Completo'
    };

    let text = `Hola KD Details! Me gustaría solicitar una cotización:\n\n`;
    text += `*Nombre:* ${nombre}\n`;
    text += `*Teléfono:* ${telefono}\n`;
    text += `*Servicio:* ${servicioNames[servicio] || servicio}\n`;
    if (vehiculo) text += `*Vehículo:* ${vehiculo}\n`;
    if (mensaje) text += `*Mensaje:* ${mensaje}\n`;

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/50433407585?text=${encoded}`, '_blank');
});

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 100;
    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        const link = document.querySelector(`.nav-link[href="#${id}"]`);
        if (link) {
            link.classList.toggle('active', scrollY >= top && scrollY < top + height);
        }
    });
});