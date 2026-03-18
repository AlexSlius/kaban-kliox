import { initDropdowns } from './components/dropdown.js';
import { initMobileMenu } from './components/mobile-menu.js';
import { initAccordion } from './components/accordion.js';


document.addEventListener('DOMContentLoaded', () => {

    // Swiper sliders
    if (document.querySelector('.swiper')) {
        import('./components/sliders.js').then(m => m.initSliders());
    }

    // Dropdown 
    if (document.querySelector('[data-dropdown]')) {
        initDropdowns();
    }

    // Mobile menu
    initMobileMenu();

    // Accordion
    if (document.querySelector('[data-accordion-trigger]')) {
        initAccordion();
    }

    // Fancybox
    initFancybox();

});


function initFancybox() {
    let ready = false;
    let promise = null;

    function load() {
        if (!promise) {
            promise = import('@fancyapps/ui').then(({ Fancybox }) => {
                Fancybox.bind('[data-fancybox-inline]', {
                    closeButton: false,
                    trapFocus: false,
                    dragToClose: false,
                    Carousel: { gestures: false },
                });
                ready = true;
                return Fancybox;
            });
        }
        return promise;
    }

    document.addEventListener('pointerover', (e) => {
        if (e.pointerType === 'mouse' && e.target.closest('[data-fancybox-inline]')) {
            load();
        }
    }, { passive: true });

    document.addEventListener('click', async (e) => {
        if (ready) return;
        const trigger = e.target.closest('[data-fancybox-inline]');
        if (!trigger) return;
        e.preventDefault();
        const Fancybox = await load();
        Fancybox.fromEvent(e);
    }, true);
}
