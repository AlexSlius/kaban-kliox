let modalReady = false;
let modalPromise = null;

function preload() {
    if (!modalPromise) {
        modalPromise = import('@fancyapps/ui').then(({ Fancybox }) => {
            Fancybox.bind('[data-fancybox-inline]', {
                closeButton: false,
                trapFocus: false,
                dragToClose: false,
                Carousel: { gestures: false },
            });

            Fancybox.bind('[data-fancybox]');

            modalReady = true;
            return Fancybox;
        });
    }
    return modalPromise;
}

function initReviewsGallery() {
    const cards = document.querySelectorAll('.reviews__card');
    if (!cards.length) return;

    cards.forEach(function (card, index) {
        const links = card.querySelectorAll('[data-fancybox]');
        links.forEach(function (link) {
            link.setAttribute('data-fancybox', 'reviews-' + index);

            const img = link.querySelector('img');
            if (img && link.getAttribute('href') === '#') {
                link.setAttribute('href', img.src);
            }
        });
    });
}
initReviewsGallery();

export function initModal() {
    const selector = '[data-fancybox-inline], [data-fancybox]';

    document.addEventListener('pointerover', (e) => {
        if (e.pointerType === 'mouse' && e.target.closest(selector)) {
            preload();
        }
    }, { passive: true });

    document.addEventListener('click', async (e) => {
        if (modalReady) return;
        const trigger = e.target.closest(selector);
        if (!trigger) return;
        e.preventDefault();
        const Fancybox = await preload();
        Fancybox.fromEvent(e);
    }, true);
}