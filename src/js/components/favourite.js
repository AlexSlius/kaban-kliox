export function initFavourite() {
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.js-favourite');
        if (!btn) return;

        const isActive = btn.classList.toggle('is-favourite');
        btn.setAttribute('aria-pressed', isActive);

        const label = isActive ? btn.dataset.labelActive : btn.dataset.labelInactive;
        if (label) btn.setAttribute('aria-label', label);
    });
}
