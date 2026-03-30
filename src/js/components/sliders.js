import { scheduleIdle } from "../utils/scheduleIdle.js";
import Swiper from "swiper";
import { Navigation, Pagination, Thumbs } from "swiper/modules";

function initCritical() {
	if (document.querySelector(".hero__slider")) {
		new Swiper(".hero__slider", {
			modules: [Navigation, Pagination],
			slidesPerView: 1,
			loop: true,
			speed: 700,
			navigation: {
				nextEl: ".hero__next",
				prevEl: ".hero__prev",
			},
			pagination: {
				el: ".hero__pagination",
				clickable: true,
			},
		});
	}


	if (document.querySelector(".product-gallery__slider")) {
		const thumb = new Swiper(".product-gallery__thumb", {
			modules: [Navigation],
			slidesPerView: 4,
			spaceBetween: 10,
			watchSlidesProgress: true,
			breakpoints: {
				1280: {
					slidesPerView: 5,
				},
			},
		});

		new Swiper(".product-gallery__slider", {
			modules: [Pagination, Thumbs],
			slidesPerView: 1,
			loop: true,
			speed: 700,
			pagination: {
				el: ".product-gallery__pagination",
				clickable: true,
			},
			thumbs: {
				swiper: thumb,
			},
		});
	}


	document.querySelectorAll(".product__slider").forEach((el) => {
		new Swiper(el, {
			modules: [Navigation],
			slidesPerView: 2.02,
			spaceBetween: 8,
			speed: 700,
			navigation: {
				nextEl: el.closest(".product").querySelector(".product__next"),
				prevEl: el.closest(".product").querySelector(".product__prev"),
			},
			breakpoints: {
				1200: {
					slidesPerView: 5,
					spaceBetween: 20,
				},
				1024: {
					slidesPerView: 4,
				},
				768: {
					slidesPerView: 3.2,
				},
			},
		});
	});
}

function initDeferred() {

	if (document.querySelector(".cat__slider")) {
		const bp = window.matchMedia("(min-width: 1280px)");
		let catSwiper;

		const initCatSlider = () => {
			catSwiper = new Swiper(".cat__slider", {
					modules: [Navigation],
					slidesPerView: 2.02,
					spaceBetween: 8,
					speed: 700,
					navigation: {
						nextEl: ".cat__next",
						prevEl: ".cat__prev",
					},
					breakpoints: {
						1024: { slidesPerView: 4 },
						768: { slidesPerView: 3.2 },
					},
			});
		};

		const check = () => {
			if (bp.matches) {
					catSwiper?.destroy(true, true);
					catSwiper = undefined;
			} else if (!catSwiper) {
					initCatSlider();
			}
		};

		bp.addEventListener("change", check);
		check();
	}
	 
	if (document.querySelector(".reviews__slider")) {
		new Swiper(".reviews__slider", {
			modules: [Navigation],
			slidesPerView: 1.1,
			spaceBetween: 8,
			speed: 700,
			touchEventsTarget: "wrapper",
			navigation: {
					nextEl: ".reviews__next",
					prevEl: ".reviews__prev",
			},
			breakpoints: {
					1024: {
						slidesPerView: 3,
						spaceBetween: 20,
						watchSlidesProgress: true,
					},
					768: {
						slidesPerView: 2.2,
						spaceBetween: 20,
					},
			},
		});
	}

	if (document.querySelector(".reviews__gal")) {
		new Swiper(".reviews__gal", {
			slidesPerView: "auto",
			spaceBetween: 10,
			loop: true,
			speed: 700,
			breakpoints: {
				1024: {
					spaceBetween: 5,
				},
			},
		});
	}

	document.querySelectorAll(".reviews__gallery").forEach((el) => {
		let swiperInstance = null;
		const nextBtn = el.closest(".reviews__gallery-wrap").querySelector(".reviews__gallery-next");
		const prevBtn = el.closest(".reviews__gallery-wrap").querySelector(".reviews__gallery-prev");

		const mq = window.matchMedia("(min-width: 1280px)");

		function createSwiper(isDesktop) {
			if (swiperInstance) {
					swiperInstance.destroy(true, true);
			}

			swiperInstance = new Swiper(el, {
					modules: [Navigation],
					nested: true,
					loop: true,
					slidesPerView: "auto",
					spaceBetween: 10,
					speed: 500,
					...(isDesktop && {
						direction: "vertical",
						slidesPerView: "auto",
					}),
					navigation: {
						nextEl: nextBtn,
						prevEl: prevBtn,
					},
			});
		}

		function handleBreakpoint(e) {
			createSwiper(e.matches);
		}

		mq.addEventListener("change", handleBreakpoint);
		createSwiper(mq.matches);
	});

	if (document.querySelector(".blogs__slider")) {
		new Swiper(".blogs__slider", {
			modules: [Navigation],
			slidesPerView: 1.12,
			spaceBetween: 8,
			speed: 700,
			navigation: {
				nextEl: ".blogs__next",
				prevEl: ".blogs__prev",
			},
			breakpoints: {
				1024: {
					slidesPerView: 3,
					spaceBetween: 20,
				},
				768: {
					slidesPerView: 2.2,
					spaceBetween: 20,
				},
			},
		});
	}

}

export function initSliders() {
	initCritical();

	scheduleIdle(
		() => {
			initDeferred();
		},
		{ timeout: 2000 },
	);
}
