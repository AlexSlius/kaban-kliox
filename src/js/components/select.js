import Choices from 'choices.js';

function optionImage(customProperties) {
    if (!customProperties?.image) return '';
    return `<img src="${customProperties.image}" alt="" role="presentation" width="20" height="20" style="flex-shrink:0">`;
}

export function initSelect() {

    // Delivery method — no search, with image in selected item and dropdown
    const deliveryEl = document.querySelector('.js-select-delivery');
    if (deliveryEl) {
        new Choices(deliveryEl, {
            searchEnabled: false,
            itemSelectText: '',
            shouldSort: false,
            callbackOnCreateTemplates(strToEl, escapeForTemplate, getClassNames) {
                return {
                    item: ({ classNames }, data) => strToEl(`
                        <div class="${getClassNames(classNames.item).join(' ')} ${!data.disabled ? classNames.itemSelectable : classNames.itemDisabled}"
                             data-item data-id="${data.id}" data-value="${escapeForTemplate(true, data.value)}"
                             ${data.active ? 'aria-selected="true"' : ''}
                             ${data.disabled ? 'aria-disabled="true"' : ''}>
                            ${optionImage(data.customProperties)}
                            <span>${data.label}</span>
                        </div>
                    `),
                    choice: ({ classNames }, data) => strToEl(`
                        <div class="${getClassNames(classNames.item).join(' ')} ${getClassNames(classNames.itemChoice).join(' ')} ${data.disabled ? classNames.itemDisabled : classNames.itemSelectable}"
                             data-select-text="" data-choice
                             ${data.disabled ? 'data-choice-disabled aria-disabled="true"' : 'data-choice-selectable'}
                             data-id="${data.id}" data-value="${escapeForTemplate(true, data.value)}"
                             ${data.groupId > 0 ? 'role="treeitem"' : 'role="option"'}>
                            ${optionImage(data.customProperties)}
                            <span>${data.label}</span>
                        </div>
                    `),
                };
            },
        });
    }

    // Searchable selects (city, branch)
    document.querySelectorAll('.js-select').forEach(el => {
        new Choices(el, {
            searchEnabled: true,
            searchPlaceholderValue: 'Пошук...',
            itemSelectText: '',
            shouldSort: false,
            noResultsText: 'Нічого не знайдено',
            noChoicesText: 'Немає варіантів',
        });
    });
}
