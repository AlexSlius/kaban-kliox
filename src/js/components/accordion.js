export function initAccordion() {
    const triggers = document.querySelectorAll('[data-accordion-trigger]');

    triggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const content = trigger.nextElementSibling;
            if (!content || !content.hasAttribute('data-accordion-content')) return;

            const isOpen = trigger.getAttribute('aria-expanded') === 'true';

            if (isOpen) {
                content.classList.remove('is-open');
                trigger.setAttribute('aria-expanded', 'false');
            } else {
                const group = trigger.closest('[data-accordion-group]') || trigger.parentElement.parentElement;
                group.querySelectorAll('[data-accordion-trigger][aria-expanded="true"]').forEach(openTrigger => {
                    if (openTrigger === trigger) return;
                    const openContent = openTrigger.nextElementSibling;
                    if (openContent && openContent.hasAttribute('data-accordion-content')) {
                        openContent.classList.remove('is-open');
                        openTrigger.setAttribute('aria-expanded', 'false');
                    }
                });

                trigger.setAttribute('aria-expanded', 'true');
                content.classList.add('is-open');
            }
        });
    });
}
