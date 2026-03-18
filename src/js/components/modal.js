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
            modalReady = true;
            return Fancybox;
        });
    }
    return modalPromise;
}

export function initModal() {
    // Desktop: preload при наведении на триггер
    document.addEventListener('pointerover', (e) => {
        if (e.pointerType === 'mouse' && e.target.closest('[data-fancybox-inline]')) {
            preload();
        }
    }, { passive: true });

    // Клик: перехватываем только если Fancybox ещё не готов
    document.addEventListener('click', async (e) => {
        if (modalReady) return;
        const trigger = e.target.closest('[data-fancybox-inline]');
        if (!trigger) return;
        e.preventDefault();
        const Fancybox = await preload();
        Fancybox.fromEvent(e);
    }, true);
}
