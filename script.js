/* ==========================================================================
   Eden Beauty Salon — JavaScript
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initHeader();
    initMobileNav();
    initSmoothScroll();
    initScrollSpy();
    initRevealAnimations();
    initGallery();
    initTestimonialCarousel();
    initBookingForm();
    initNewsletterForm();
});

/* ---------- Sticky Header ---------- */
function initHeader() {
    const header = document.getElementById('header');
    let lastScrollY = 0;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        if (currentScrollY > 100) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }

        lastScrollY = currentScrollY;
    });
}

/* ---------- Mobile Navigation ---------- */
function initMobileNav() {
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('nav');
    const links = nav.querySelectorAll('.header__nav-link');

    hamburger.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('is-open');
        hamburger.classList.toggle('is-open');
        hamburger.setAttribute('aria-expanded', isOpen);
    });

    links.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('is-open');
            hamburger.classList.remove('is-open');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });

    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && !hamburger.contains(e.target) && nav.classList.contains('is-open')) {
            nav.classList.remove('is-open');
            hamburger.classList.remove('is-open');
            hamburger.setAttribute('aria-expanded', 'false');
        }
    });
}

/* ---------- Smooth Scroll ---------- */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerHeight = document.getElementById('header').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ---------- Scroll Spy ---------- */
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.header__nav-link');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, {
        rootMargin: '-50% 0px -50% 0px'
    });

    sections.forEach(section => observer.observe(section));
}

/* ---------- Reveal Animations ---------- */
function initRevealAnimations() {
    const reveals = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    reveals.forEach(el => observer.observe(el));
}

/* ---------- Gallery Lightbox ---------- */
function initGallery() {
    const galleryItems = document.querySelectorAll('.gallery__item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCounter = document.getElementById('lightbox-counter');
    const closeBtn = document.getElementById('lightbox-close');
    const prevBtn = document.getElementById('lightbox-prev');
    const nextBtn = document.getElementById('lightbox-next');

    let currentIndex = 0;
    const images = [];
    const alts = [];

    galleryItems.forEach(item => {
        const img = item.querySelector('img');
        images.push(img.src);
        alts.push(img.alt);
    });

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => openLightbox(index));
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') openLightbox(index);
        });
    });

    function openLightbox(index) {
        currentIndex = index;
        updateLightboxImage();
        lightbox.classList.add('is-visible');
        document.body.style.overflow = 'hidden';
        closeBtn.focus();
    }

    function closeLightbox() {
        lightbox.classList.remove('is-visible');
        document.body.style.overflow = '';
    }

    function updateLightboxImage() {
        lightboxImg.src = images[currentIndex];
        lightboxImg.alt = alts[currentIndex];
        lightboxCounter.textContent = `${currentIndex + 1} / ${images.length}`;
    }

    function showPrev() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateLightboxImage();
    }

    function showNext() {
        currentIndex = (currentIndex + 1) % images.length;
        updateLightboxImage();
    }

    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', showPrev);
    nextBtn.addEventListener('click', showNext);

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('is-visible')) return;

        switch (e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                showPrev();
                break;
            case 'ArrowRight':
                showNext();
                break;
        }
    });
}

/* ---------- Testimonial Carousel ---------- */
function initTestimonialCarousel() {
    const track = document.getElementById('testimonial-track');
    const dotsContainer = document.getElementById('testimonial-dots');

    if (!track || !dotsContainer) return;

    const cards = track.querySelectorAll('.testimonial-card');
    const totalCards = cards.length;
    let currentSlide = 0;
    let autoplayInterval;

    for (let i = 0; i < totalCards; i++) {
        const dot = document.createElement('button');
        dot.classList.add('testimonials__dot');
        dot.setAttribute('aria-label', `Go to review ${i + 1}`);
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    }

    const dots = dotsContainer.querySelectorAll('.testimonials__dot');

    function goToSlide(index) {
        currentSlide = index;
        track.style.transform = `translateX(-${currentSlide * 100}%)`;

        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });
    }

    function nextSlide() {
        goToSlide((currentSlide + 1) % totalCards);
    }

    function startAutoplay() {
        stopAutoplay();
        autoplayInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoplay() {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
            autoplayInterval = null;
        }
    }

    startAutoplay();

    const carousel = document.getElementById('testimonial-carousel');
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);

    let touchStartX = 0;

    track.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    });

    track.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                goToSlide((currentSlide + 1) % totalCards);
            } else {
                goToSlide((currentSlide - 1 + totalCards) % totalCards);
            }
        }
    });
}

/* ---------- Booking Form ---------- */
function initBookingForm() {
    const form = document.getElementById('booking-form');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const email = document.getElementById('email').value.trim();
        const service = document.getElementById('service').value;
        const date = document.getElementById('date').value;
        const time = document.getElementById('time').value;
        const notes = document.getElementById('notes').value.trim();

        const message = `Hello Eden Beauty Salon!%0A%0A` +
            `Name: ${name}%0A` +
            `Phone: ${phone}%0A` +
            `Email: ${email}%0A` +
            `Service: ${service}%0A` +
            `Date: ${date}%0A` +
            `Time: ${time}%0A` +
            `Notes: ${notes || 'None'}`;

        const whatsappUrl = `https://wa.me/4407473263602?text=${message}`;

        const notification = document.createElement('div');
        notification.className = 'form__notification form__notification--success';
        notification.setAttribute('role', 'status');
        notification.innerHTML = `
            <p>Thank you, ${name}! Redirecting to WhatsApp...</p>
            <p class="form__notification-sub">If nothing happens, <a href="${whatsappUrl}" target="_blank" rel="noopener">click here</a>.</p>
        `;

        form.insertAdjacentElement('afterend', notification);
        window.scrollTo({ top: notification.offsetTop - 100, behavior: 'smooth' });

        setTimeout(() => {
            window.open(whatsappUrl, '_blank', 'noopener');
        }, 1000);

        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 5000);

        form.reset();
    });

    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }
}

/* ---------- Newsletter Form ---------- */
function initNewsletterForm() {
    const form = document.getElementById('newsletter-form');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = form.querySelector('input').value.trim();
        const btn = form.querySelector('button');

        btn.textContent = 'Subscribed!';
        btn.style.background = 'var(--color-green)';
        btn.disabled = true;

        setTimeout(() => {
            btn.textContent = 'Subscribe';
            btn.style.background = 'var(--color-pink)';
            btn.disabled = false;
            form.reset();
        }, 3000);
    });
}
