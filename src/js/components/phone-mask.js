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
    if (!input.value) {
        input.value = PREFIX;
    }

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
