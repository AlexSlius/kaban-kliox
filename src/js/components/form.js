export function initPhoneMask() {
    document.querySelectorAll('.js-phone').forEach(input => {
        input.addEventListener('input', onInput);
        input.addEventListener('keydown', onKeydown);
        input.addEventListener('focus', onFocus);
        input.addEventListener('paste', onPaste);
    });
}

const PREFIX = '+380 (';

function format(digits) {
    let d = digits.slice(0, 9);
    let result = '+380 (';
    if (d.length === 0) return result;
    result += d.slice(0, 2);
    if (d.length <= 2) return result;
    result += ') ' + d.slice(2, 5);
    if (d.length <= 5) return result;
    result += '-' + d.slice(5, 7);
    if (d.length <= 7) return result;
    result += '-' + d.slice(7, 9);
    return result;
}

function getDigits(value) {
    const raw = value.replace(/^\+380\s?\(?\s?/, '').replace(/\D/g, '');
    return raw.slice(0, 9);
}

function onFocus(e) {
    const input = e.target;
    if (!input.value) input.value = PREFIX;
    const len = input.value.length;
    input.setSelectionRange(len, len);
}

function onInput(e) {
    const input = e.target;
    const digits = getDigits(input.value);
    input.value = format(digits);
    const len = input.value.length;
    requestAnimationFrame(() => input.setSelectionRange(len, len));
}

function onKeydown(e) {
    const input = e.target;
    if ((e.key === 'Backspace' || e.key === 'Delete') && input.value === PREFIX) {
        e.preventDefault();
    }
}

function onPaste(e) {
    e.preventDefault();
    const pasted = (e.clipboardData || window.clipboardData).getData('text');
    let digits = pasted.replace(/\D/g, '');
    if (digits.startsWith('380')) digits = digits.slice(3);
    else if (digits.startsWith('0')) digits = digits.slice(1);
    e.target.value = format(digits.slice(0, 9));
}


export function initReviewUpload() {
    document.querySelectorAll('.review-form__upload').forEach(label => {
        const input = label.querySelector('input[type="file"]');
        if (!input) return;

        const preview = document.createElement('div');
        preview.className = 'review-form__preview';
        label.closest('.review-form__group').appendChild(preview);

        // Source of truth — not input.files (browser resets it on each dialog open)
        let accumulated = [];

        function addFiles(incoming) {
            const filtered = incoming.filter(f =>
                f.type === 'image/jpeg' || f.type === 'image/png'
            );
            const combined = [...accumulated, ...filtered];
            accumulated = combined
                .filter((f, i, arr) =>
                    arr.findIndex(x => x.name === f.name && x.size === f.size) === i
                )
                .slice(0, 5);
            syncAndRender();
        }

        function removeAt(index) {
            accumulated.splice(index, 1);
            syncAndRender();
        }

        function syncAndRender() {
            const dt = new DataTransfer();
            accumulated.forEach(f => dt.items.add(f));
            input.files = dt.files;
            renderPreview(accumulated, preview, removeAt);
        }

        input.addEventListener('change', () => {
            addFiles(Array.from(input.files));
        });

        label.addEventListener('dragover', e => {
            e.preventDefault();
            label.classList.add('is-dragover');
        });

        label.addEventListener('dragleave', e => {
            if (!label.contains(e.relatedTarget)) {
                label.classList.remove('is-dragover');
            }
        });

        label.addEventListener('drop', e => {
            e.preventDefault();
            label.classList.remove('is-dragover');
            addFiles(Array.from(e.dataTransfer.files));
        });
    });
}

function renderPreview(files, container, onRemove) {
    container.innerHTML = '';

    files.forEach((file, index) => {
        const url = URL.createObjectURL(file);
        const item = document.createElement('div');
        item.className = 'review-form__preview-item';

        const img = document.createElement('img');
        img.src = url;
        img.alt = file.name;
        img.width = 80;
        img.height = 80;
        img.onload = () => URL.revokeObjectURL(url);

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'review-form__preview-remove';
        btn.setAttribute('aria-label', 'Видалити фото');
        btn.innerHTML = `<svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M1 1L9 9M9 1L1 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`;
        btn.addEventListener('click', e => {
            e.preventDefault();
            onRemove(index);
        });

        item.appendChild(img);
        item.appendChild(btn);
        container.appendChild(item);
    });
}

export function initQuantity() {
    document.querySelectorAll('.quantity').forEach(el => {
        const input = el.querySelector('input');
        const [btnMinus, btnPlus] = el.querySelectorAll('.quantity__arrow');

        btnMinus.addEventListener('click', () => {
            const val = parseInt(input.value) || 1;
            if (val > 1) input.value = val - 1;
        });

        btnPlus.addEventListener('click', () => {
            const val = parseInt(input.value) || 0;
            input.value = val + 1;
        });
    });
}
