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

// ==========================================
// ЛОГІКА КАТАЛОГУ (Практична 9-10)
// ==========================================

let allItems = [];
let visibleCount = 4;
const favoritesKey = 'catalogFavorites';


document.addEventListener('DOMContentLoaded', initCatalogPage);

async function initCatalogPage() {
    const catalogContainer = document.querySelector('[data-catalog]');
    if (!catalogContainer) return;

    try {
        showLoadingState();
        allItems = await loadItems();
        hideLoadingState();

        initControls();  // Спочатку ініціалізуємо кнопки та слухачі
        applyFilters();  // Замість renderCards(allItems) викликаємо applyFilters, щоб спрацював ліміт у 4 картки!

    } catch (error) {
        hideLoadingState();
        showErrorState('Помилка завантаження даних: ' + error.message);
    }
}

async function loadItems() {
    const response = await fetch('./data/items.json');
    if (!response.ok) throw new Error('Не вдалося знайти items.json');
    return response.json();
}

function renderCards(items) {
    const container = document.getElementById('catalogContainer');
    container.innerHTML = '';

    if (items.length === 0) {
        document.getElementById('emptyState').style.display = 'block';
        return;
    } else {
        document.getElementById('emptyState').style.display = 'none';
    }

    const favorites = JSON.parse(localStorage.getItem(favoritesKey) || '[]');

    items.forEach(item => {
        const isFav = favorites.includes(item.id);
        const card = document.createElement('div');

        card.style.border = '1px solid #ccc';
        card.style.padding = '15px';
        card.style.borderRadius = '8px';
        card.style.display = 'flex';
        card.style.flexDirection = 'column';
        card.style.height = '100%';

        card.innerHTML = `
            <img src="${item.image}" alt="${item.title}" style="width: 100%; height: 150px; object-fit: cover; border-radius: 4px; margin-bottom: 10px;">
            <h3 style="margin: 0 0 10px 0;">${item.title}</h3>
            <p style="font-size: 0.9em; color: gray; margin-bottom: 10px;">Категорія: ${item.category}</p>
            <p style="margin-bottom: 15px;">${item.description}</p>
            
            <div style="margin-top: auto;">
                <p style="margin-bottom: 10px;"><strong>Ціна: ${item.price} грн</strong></p>
                <div style="display: flex; gap: 10px;">
                    <button class="details-btn" data-id="${item.id}" style="flex: 1; cursor: pointer; padding: 8px;">Деталі 📄</button>
                    <button class="fav-btn" data-id="${item.id}" style="flex: 1; cursor: pointer; padding: 8px;">
                        ${isFav ? 'Видалити ❌' : 'В обране 💙'}
                    </button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });

    document.querySelectorAll('.fav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => toggleFavorite(parseInt(e.target.dataset.id)));
    });

    document.querySelectorAll('.details-btn').forEach(btn => {
        btn.addEventListener('click', (e) => openItemDetails(parseInt(e.target.dataset.id)));
    });
}

function showLoadingState() { document.getElementById('loadingState').style.display = 'block'; }
function hideLoadingState() { document.getElementById('loadingState').style.display = 'none'; }
function showErrorState(msg) {
    const errorEl = document.getElementById('errorState');
    errorEl.textContent = msg;
    errorEl.style.display = 'block';
}

function initControls() {
    const resetAndFilter = () => {
        visibleCount = 4;
        applyFilters();
    };

    document.getElementById('searchInput').addEventListener('input', resetAndFilter);
    document.getElementById('categoryFilter').addEventListener('change', resetAndFilter);
    document.getElementById('sortSelect').addEventListener('change', resetAndFilter);

    document.getElementById('showMoreBtn').addEventListener('click', () => {
        visibleCount += 4;
        applyFilters();
    });
}

function applyFilters() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const category = document.getElementById('categoryFilter').value;
    const sortBy = document.getElementById('sortSelect').value;

    let filtered = allItems.filter(item => {
        const matchesQuery = item.title.toLowerCase().includes(query) || item.description.toLowerCase().includes(query);
        const matchesCategory = category === 'all' || item.category === category;
        return matchesQuery && matchesCategory;
    });

    if (sortBy === 'price-asc') {
        filtered.sort((a, b) => a.price - b.price);
    }

    const itemsToShow = filtered.slice(0, visibleCount);

    const showMoreBtn = document.getElementById('showMoreBtn');
    if (visibleCount >= filtered.length) {
        showMoreBtn.style.display = 'none';
    } else {
        showMoreBtn.style.display = 'inline-block';
    }

    renderCards(itemsToShow);
}

function toggleFavorite(id) {
    let favorites = JSON.parse(localStorage.getItem(favoritesKey) || '[]');

    if (favorites.includes(id)) {
        favorites = favorites.filter(favId => favId !== id);
    } else {
        favorites.push(id);
    }

    localStorage.setItem(favoritesKey, JSON.stringify(favorites));
    applyFilters();
}

const itemModal = document.getElementById('itemModal');
const closeItemModalBtn = document.getElementById('closeItemModal');

function openItemDetails(id) {
    const item = allItems.find(i => i.id === id);
    if (!item) return;

    const modalBody = document.getElementById('itemModalBody');
    modalBody.innerHTML = `
        <img src="${item.image}" alt="${item.title}" style="width: 100%; max-height: 250px; object-fit: contain; border-radius: 8px; margin-bottom: 15px;">
        <h2 style="margin-bottom: 10px;">${item.title}</h2>
        <span style="display: inline-block; background: #eee; padding: 4px 8px; border-radius: 4px; font-size: 0.85em; margin-bottom: 15px;">
            Категорія: ${item.category}
        </span>
        <p style="line-height: 1.5; margin-bottom: 20px;">${item.description}</p>
        <h3 style="color: #d35400;">Ціна: ${item.price} грн</h3>
    `;

    itemModal.removeAttribute('hidden');
    itemModal.style.display = 'flex';
}

closeItemModalBtn.addEventListener('click', () => {
    itemModal.setAttribute('hidden', '');
    itemModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === itemModal) {
        itemModal.setAttribute('hidden', '');
        itemModal.style.display = 'none';
    }
});