export function initMobileMenu() {
    const openBtns = document.querySelectorAll('[data-menu-open]');
    const closeBtns = document.querySelectorAll('.js-menu-close');

    function updateBodyScroll() {
        const hasOpenMenu = document.querySelector('.menu.is-open');
        document.body.classList.toggle('is-menu-open', !!hasOpenMenu);
    }

    function openMenu(menuId) {
        const menu = document.getElementById(menuId);
        if (!menu) return;

        menu.classList.add('is-open');
        updateBodyScroll();

        document.querySelectorAll(`[data-menu-open="${menuId}"]`).forEach(trigger => {
            trigger.setAttribute('aria-expanded', 'true');
            if (trigger.closest('.fixed-menu')) {
                trigger.classList.add('is-active');
            }
        });
    }

    function closeMenu(menu) {
        menu.classList.remove('is-open');
        updateBodyScroll();

        document.querySelectorAll(`[data-menu-open="${menu.id}"]`).forEach(trigger => {
            trigger.setAttribute('aria-expanded', 'false');
            if (trigger.closest('.fixed-menu')) {
                trigger.classList.remove('is-active');
            }
        });
    }

    function closeTopLevelMenus() {
        document.querySelectorAll('.menu.is-open').forEach(m => {
            const hasFixedTrigger = document.querySelector(`.fixed-menu [data-menu-open="${m.id}"]`);
            if (hasFixedTrigger) closeMenu(m);
        });
    }

    openBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.dataset.menuOpen;
            const menu = document.getElementById(targetId);
            if (!menu) return;

            const isNested = btn.closest('.menu');

            if (menu.classList.contains('is-open')) {
                closeMenu(menu);
            } else {
                if (!isNested) closeTopLevelMenus();
                openMenu(targetId);
            }
        });
    });

    const categoryBtns = document.querySelectorAll('.menu__category-card[aria-expanded]');
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const submenu = btn.nextElementSibling;
            if (!submenu || !submenu.classList.contains('menu')) return;

            if (submenu.classList.contains('is-open')) {
                submenu.classList.remove('is-open');
                btn.setAttribute('aria-expanded', 'false');
            } else {
                submenu.classList.add('is-open');
                btn.setAttribute('aria-expanded', 'true');
            }
            updateBodyScroll();
        });
    });

    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const menu = btn.closest('.menu');
            if (!menu) return;

            const categoryItem = menu.closest('.menu__category-item');
            if (categoryItem) {
                const trigger = categoryItem.querySelector('.menu__category-card[aria-expanded]');
                menu.classList.remove('is-open');
                if (trigger) trigger.setAttribute('aria-expanded', 'false');
                updateBodyScroll();
            } else {
                closeMenu(menu);
            }
        });
    });
}
