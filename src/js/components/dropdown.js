export function initDropdowns() {
    document.querySelectorAll('[data-dropdown]').forEach(initDropdown);
}

function initDropdown(container) {
    const trigger = container.querySelector('[data-dropdown-trigger]');
    const list = container.querySelector('[data-dropdown-list]');
    const valueEl = container.querySelector('[data-dropdown-value]');
    const options = [...list.querySelectorAll('[role="option"]')];

    function open() {
        trigger.setAttribute('aria-expanded', 'true');
        list.hidden = false;

        const selected = list.querySelector('[aria-selected="true"]');
        if (selected) selected.focus();
    }

    function close() {
        trigger.setAttribute('aria-expanded', 'false');
        list.hidden = true;
    }

    function select(option) {

        options.forEach(o => o.setAttribute('aria-selected', 'false'));
        option.setAttribute('aria-selected', 'true');
        valueEl.textContent = option.textContent;
        close();
        trigger.focus();

        requestIdleCallback(() => {
            container.dispatchEvent(new CustomEvent('dropdown:change', {
                detail: { value: option.dataset.value },
            }));
        }, { timeout: 2000 });
    }

    trigger.addEventListener('click', () => {
        trigger.getAttribute('aria-expanded') === 'true' ? close() : open();
    });

    trigger.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            open();
        }
    });

    list.addEventListener('click', (e) => {
        const option = e.target.closest('[role="option"]');
        if (option) select(option);
    });

    list.addEventListener('keydown', (e) => {
        const focused = document.activeElement;
        const index = options.indexOf(focused);

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                if (index < options.length - 1) options[index + 1].focus();
                break;
            case 'ArrowUp':
                e.preventDefault();
                if (index > 0) options[index - 1].focus();
                break;
            case 'Enter':
            case ' ':
                e.preventDefault();
                if (focused.getAttribute('role') === 'option') select(focused);
                break;
            case 'Escape':
                close();
                trigger.focus();
                break;
            case 'Home':
                e.preventDefault();
                options[0]?.focus();
                break;
            case 'End':
                e.preventDefault();
                options[options.length - 1]?.focus();
                break;
        }
    });

    document.addEventListener('click', (e) => {
        if (!container.contains(e.target) && trigger.getAttribute('aria-expanded') === 'true') {
            close();
        }
    });
}
