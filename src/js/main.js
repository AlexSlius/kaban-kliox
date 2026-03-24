import { initDropdowns } from './components/dropdown.js';
import { initMobileMenu } from './components/mobile-menu.js';
import { initAccordion } from './components/accordion.js';
import { initPhoneMask } from './components/phone-mask.js';
import { initFavourite } from './components/favourite.js';
import { initFilter, initFilterSlider } from './components/filter.js';
import { initModal } from './components/modal.js';


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

    // Phone mask
    if (document.querySelector('.js-phone')) {
        initPhoneMask();
    }

    // Accordion
    if (document.querySelector('[data-accordion-trigger]')) {
        initAccordion();
    }

    // Favourite toggle
    if (document.querySelector('.js-favourite')) {
        initFavourite();
    }

    // Filter + Range slider 
    if (document.querySelector('.filter')) {
        initFilter();
        initFilterSlider();
    }

    // Modal
    initModal();

});
