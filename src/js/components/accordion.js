export function initAccordion() {
    const triggers = document.querySelectorAll('[data-accordion-trigger]');

    triggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const content = trigger.nextElementSibling;
            if (!content || !content.hasAttribute('data-accordion-content')) return;

            const isOpen = trigger.getAttribute('aria-expanded') === 'true';

            if (isOpen) {
                slideUp(content, () => {
                    trigger.setAttribute('aria-expanded', 'false');
                });
            } else {
                const group = trigger.closest('[data-accordion-group]') || trigger.parentElement.parentElement;
                group.querySelectorAll('[data-accordion-trigger][aria-expanded="true"]').forEach(openTrigger => {
                    if (openTrigger === trigger) return;
                    const openContent = openTrigger.nextElementSibling;
                    if (openContent && openContent.hasAttribute('data-accordion-content')) {
                        slideUp(openContent, () => {
                            openTrigger.setAttribute('aria-expanded', 'false');
                        });
                    }
                });

                trigger.setAttribute('aria-expanded', 'true');
                slideDown(content);
            }
        });
    });
}

function slideDown(el, duration = 300) {
    if (el._animating) el._animating.cancel();

    el.classList.add('is-open');
    el.style.overflow = 'hidden';

    const styles = getComputedStyle(el);
    const height = el.scrollHeight;
    const pt = styles.paddingTop;
    const pb = styles.paddingBottom;
    const mt = styles.marginTop;
    const mb = styles.marginBottom;

    const anim = el.animate([
        { height: '0px', paddingTop: '0px', paddingBottom: '0px', marginTop: '0px', marginBottom: '0px' },
        { height: height + 'px', paddingTop: pt, paddingBottom: pb, marginTop: mt, marginBottom: mb }
    ], { duration, easing: 'ease' });

    el._animating = anim;

    anim.onfinish = () => {
        el.style.overflow = '';
        el._animating = null;
    };
}

function slideUp(el, onComplete, duration = 300) {
    if (el._animating) el._animating.cancel();

    const styles = getComputedStyle(el);
    const height = el.offsetHeight;
    const pt = styles.paddingTop;
    const pb = styles.paddingBottom;
    const mt = styles.marginTop;
    const mb = styles.marginBottom;

    el.style.overflow = 'hidden';

    const anim = el.animate([
        { height: height + 'px', paddingTop: pt, paddingBottom: pb, marginTop: mt, marginBottom: mb },
        { height: '0px', paddingTop: '0px', paddingBottom: '0px', marginTop: '0px', marginBottom: '0px' }
    ], { duration, easing: 'ease' });

    el._animating = anim;

    anim.onfinish = () => {
        el.classList.remove('is-open');
        el.style.overflow = '';
        el._animating = null;
        if (onComplete) onComplete();
    };
}
