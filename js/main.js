document.addEventListener('DOMContentLoaded', init);

function init() {
    initActiveNav();
    initThemeToggle();
    initBackToTop();
    initMenuToggle();
    initAccordion();
    initAvatarModal();
    initContactForm();
    updateFooterYear();
}

// МОДАЛЬНЕ ВІКНО
function initAvatarModal() {
    const avatar = document.querySelector('figure img');
    const modal = document.getElementById('avatarModal');
    const close = document.querySelector('.close-modal');

    if (!avatar || !modal) return;

    avatar.style.cursor = 'pointer';
    avatar.onclick = function() {
        modal.removeAttribute('hidden');
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        modal.setAttribute('hidden', '');
        modal.style.display = 'none';
        document.body.style.overflow = '';
    };

    if (close) close.onclick = closeModal;
    modal.onclick = (e) => { if (e.target === modal) closeModal(); };
}

// ЛІЧИЛЬНИК ТА ФОРМА (contact.html)
function initContactForm() {
    const msg = document.getElementById('message');
    const counter = document.getElementById('charCounter');
    const form = document.getElementById('contactForm');

    if (!msg) return;

    const update = () => {
        const len = msg.value.length;
        if (counter) counter.textContent = `Символів: ${len} / 500`;
        localStorage.setItem('contactDraft', msg.value);
    };

    msg.value = localStorage.getItem('contactDraft') || '';
    update();
    msg.addEventListener('input', update);

    if (form) {
        form.onsubmit = (e) => {
            e.preventDefault();
            alert('Повідомлення надіслано!');
            localStorage.removeItem('contactDraft');
            form.reset();
            update();
        };
    }
}

// КНОПКА ВГОРУ
function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;

    window.onscroll = () => {
        if (window.scrollY > 300) btn.style.display = 'flex';
        else btn.style.display = 'none';
    };

    btn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
}

// РЕШТА ФУНКЦІЙ
function initActiveNav() {
    document.querySelectorAll('.nav-list a').forEach(link => {
        if (link.href === window.location.href) link.classList.add('active');
    });
}

function initThemeToggle() {
    const btn = document.getElementById('themeToggleBtn');
    if (!btn) return;
    if (localStorage.getItem('siteTheme') === 'dark') document.body.classList.add('theme-dark');
    btn.onclick = () => {
        document.body.classList.toggle('theme-dark');
        localStorage.setItem('siteTheme', document.body.classList.contains('theme-dark') ? 'dark' : 'light');
    };
}

function initMenuToggle() {
    const btn = document.getElementById('menuToggle');
    const nav = document.getElementById('navList');
    if (btn && nav) btn.onclick = () => nav.classList.toggle('is-open');
}

function initAccordion() {
    document.querySelectorAll('.accordion-header').forEach(h => {
        h.onclick = () => h.parentElement.classList.toggle('active');
    });
}

function updateFooterYear() {
    const f = document.querySelector('.site-footer p');
    if (f) f.innerHTML = `&copy; ${new Date().getFullYear()} Vladyslav (Frezze)`;
}