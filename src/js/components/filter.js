export function initFilter() {
    const filter = document.querySelector('.filter');

    const openBtn = document.querySelector('.js-filter-open');
    const footer = document.querySelector('.footer');

    if (openBtn && footer) {
        new IntersectionObserver(([entry]) => {
            openBtn.classList.toggle('is-on-dark', entry.isIntersecting);
        }).observe(footer);
    }

    openBtn?.addEventListener('click', () => {
        filter?.classList.add('is-open');
        document.body.classList.add('is-filter-open');
    });

    filter?.querySelector('.js-filter-close')?.addEventListener('click', () => {
        filter.classList.remove('is-open');
        document.body.classList.remove('is-filter-open');
    });

    const triggers = document.querySelectorAll('[data-filter-trigger]');

    triggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const isOpen = trigger.getAttribute('aria-expanded') === 'true';
            const body = trigger.nextElementSibling;
            if (!body) return;

            trigger.setAttribute('aria-expanded', String(!isOpen));
            body.classList.toggle('is-open', !isOpen);
        });
    });
}

export function initFilterSlider() {
    const el = document.getElementById('filter-price-slider');
    if (!el) return;

    import('nouislider').then(({ default: noUiSlider }) => {
        const min = Number(el.dataset.min) || 0;
        const max = Number(el.dataset.max) || 100000;
        const from = Number(el.dataset.from) || min;
        const to = Number(el.dataset.to) || max;

        const labelEl = document.querySelector('[data-filter-price-label]');
        const fromEl  = document.querySelector('[data-filter-price-from]');
        const toEl    = document.querySelector('[data-filter-price-to]');

        noUiSlider.create(el, {
            start: [from, to],
            connect: true,
            range: { min, max },
            step: 10,
            format: {
                to: v => Math.round(v).toLocaleString('uk-UA'),
                from: v => Number(v.replace(/\s/g, '')),
            },
        });

        el.noUiSlider.on('update', (values) => {
            if (fromEl) fromEl.textContent = values[0];
            if (toEl)   toEl.textContent   = values[1];
            if (labelEl) labelEl.textContent = `${values[0]} — ${values[1]}`;
        });
    });
}
