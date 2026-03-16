import { initDropdowns } from './components/dropdown.js';
import { initMobileMenu } from './components/mobile-menu.js';
import { initAccordion } from './components/accordion.js';

document.addEventListener('DOMContentLoaded', () => {

    // Swiper sliders
    if (document.querySelector('.swiper')) {
        import('./components/sliders.js').then(m => m.initSliders());
    }

    // Кастомные дропдауны (above the fold — инициализируем сразу)
    if (document.querySelector('[data-dropdown]')) {
        initDropdowns();
    }

    // Мобильное меню
    initMobileMenu();

    // Аккордеон
    if (document.querySelector('[data-accordion-trigger]')) {
        initAccordion();
    }

});
