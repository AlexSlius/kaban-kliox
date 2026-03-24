import { scheduleIdle } from '../utils/scheduleIdle.js';
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';


function initCritical() {

	if (document.querySelector('.hero-slider')) {
		new Swiper('.hero-slider', {
				modules: [Navigation, Pagination],
				slidesPerView: 1,
				navigation: {
					nextEl: '.hero-slider__next',
					prevEl: '.hero-slider__prev',
				},
				pagination: {
					el: '.hero-slider__pagination',
					clickable: true,
				},
		});
	}

}


function initDeferred() {



}

export function initSliders() {
	initCritical();

	scheduleIdle(() => {
		initDeferred();
	}, { timeout: 2000 });
}
