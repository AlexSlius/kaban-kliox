# Kaban — HTML Template

## Стек

| Інструмент                                | Роль                                      |
|-------------------------------------------|-------------------------------------------|
| [Bun](https://bun.sh)                     | Runtime / package manager                 |
| [Vite](https://vitejs.dev)                | Bundler / dev server                      |
| [TailwindCSS v4](https://tailwindcss.com) | CSS фреймворк (через `@tailwindcss/vite`) |
| [Handlebars](https://handlebarsjs.com)    | Шаблонізатор                              |

## Передумови

- [Bun](https://bun.sh) >= 1.0 або Node.js >= 18

## Встановлення

```bash
bun install
```

## Команди

| Команда           | Опис                                               |
|-------------------|----------------------------------------------------|
| `bun run dev`     | Запустити dev сервер з HMR (http://localhost:5173) |
| `bun run build`   | Зібрати production build у `dist/`                 |
| `bun run preview` | Переглянути production build локально              |

## Сторінки

| URL                    | Файл                      | Опис                                      |
|------------------------|---------------------------|-------------------------------------------|
| `/`                    | `src/index.html`          | Головна — hero, товари, переваги магазину |
| `/pages/contacts.html` | `src/pages/contacts.html` | Контакти — форма, адреса, карта           |

## Структура проекту

```
htmlKaban/
├── src/
│   ├── assets/
│   │   ├── images/              # Зображення (обробляються Vite)
│   │   ├── icons/               # Іконки
│   │   └── fonts/               # Шрифти
│   ├── js/
│   │   ├── main.js              # Точка входу JS: import CSS + мобільне меню
│   │   └── components/          # JS-компоненти
│   ├── pages/
│   │   └── contacts.html        # Сторінка контактів
│   ├── partials/                # Handlebars партіали
│   │   ├── header.html          # header
│   │   ├── footer.html          # footer
│   │   ├── hero.html            # Hero секція (головна)
│   │   ├── product-card.html    # Картка товару
│   │   └── contact-form.html    # Форма зворотного зв'язку
│   ├── styles/
│   │   ├── main.css             # Tailwind import + @layer base
│   │   └── components/          # CSS-компоненти
│   │       ├── buttons.css      # .btn-primary, .btn-secondary
│   │       ├── cards.css        # .card
│   │       ├── forms.css        # .form-label, .form-input
│   │       ├── layout.css       # .skip-link, .below-fold-section
│   │       └── navigation.css   # .nav-link, .section-heading
│   └── index.html               # Головна сторінка
├── vite.config.js
└── package.json
```

## Як працює Handlebars

Партіали підключаються у HTML через синтаксис `{{> назва-партіалу}}`:

```html
{{> header}}
{{> hero}}
{{> product-card}}
{{> footer}}
```

Партіали зберігаються у `src/partials/*.html`. Налаштування — у `vite.config.js`:

```js
handlebars({
    partialDirectory: resolve(__dirname, 'src/partials'),
})
```

