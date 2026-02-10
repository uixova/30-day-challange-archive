const btn = document.getElementById('hamburger-toggle'),
      menu = document.getElementById('mobile-side-menu'),
      overlay = document.getElementById('menu-overlay'),
      icon = btn.querySelector('i');

const toggle = (open) => {
    menu.classList.toggle('active', open);
    overlay.classList.toggle('active', open);
    document.body.style.overflow = open ? 'hidden' : 'auto';
};

btn.onclick = (e) => { e.stopPropagation(); toggle(true); };

[document.getElementById('close-mobile-menu'), overlay, document].forEach(el => {
    if (!el) return;
    el.addEventListener('click', (e) => {
        if (menu.classList.contains('active') && !menu.contains(e.target)) toggle(false);
    });
});