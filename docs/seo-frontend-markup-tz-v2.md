# ТЗ: SEO-оптимізована верстка (HTML / CSS / JS)

**На основі офіційних рекомендацій Google (2024–2026)**

---

## 1. HTML-структура

### 1.1. Базовий шаблон сторінки

```html
<!DOCTYPE html>
<html lang="uk">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Ключова фраза сторінки — Бренд</title>
        <meta name="description" content="Унікальний опис до 160 символів, що мотивує до кліку" />
        <link rel="canonical" href="https://example.com/page" />

        <!-- Preconnect до зовнішніх доменів (CDN, шрифти) -->
        <link rel="preconnect" href="https://fonts.googleapis.com" crossorigin />

        <!-- Preload LCP-ресурсу -->
        <link rel="preload" as="image" href="hero.webp" fetchpriority="high" />

        <!-- Critical CSS inline -->
        <style>
            /* above-the-fold стилі, < 14KB */
        </style>

        <!-- Решта CSS — async -->
        <link rel="preload" href="styles.css" as="style" onload="this.onload=null;this.rel='stylesheet'" />
        <noscript><link rel="stylesheet" href="styles.css" /></noscript>
    </head>
    <body>
        <a href="#main-content" class="skip-link">Перейти до основного контенту</a>

        <header>
            <nav aria-label="Головна навігація">
                <!-- навігація -->
            </nav>
        </header>

        <main id="main-content">
            <article>
                <h1>Один H1 — основна тема сторінки</h1>
                <section>
                    <h2>Підрозділ</h2>
                    <p>Контент...</p>
                </section>
            </article>
        </main>

        <aside>
            <!-- бічний контент -->
        </aside>

        <footer>
            <nav aria-label="Навігація підвалу">
                <!-- посилання -->
            </nav>
        </footer>

        <!-- JS — defer -->
        <script src="app.js" defer></script>
    </body>
</html>
```

### 1.2. Семантичні теги

| Тег                         | Коли використовувати                     | Коли НЕ використовувати            |
| --------------------------- | ---------------------------------------- | ---------------------------------- |
| `<header>`                  | Шапка сторінки або секції                | Як обгортка для будь-чого          |
| `<nav>`                     | Основна та допоміжна навігація           | Для кожного списку посилань        |
| `<main>`                    | Основний контент, **один на сторінку**   | Ніколи більше одного               |
| `<article>`                 | Самодостатній блок (стаття, товар, пост) | Для простих div-обгорток           |
| `<section>`                 | Тематичний підрозділ зі своїм заголовком | Без заголовка (використай `<div>`) |
| `<aside>`                   | Побічний контент (сайдбар, пов'язане)    | Для основного контенту             |
| `<footer>`                  | Підвал сторінки або секції               | Як обгортка стилювання             |
| `<figure>` + `<figcaption>` | Зображення/діаграма з підписом           | Декоративні елементи               |

**Заборони:**

- `<table>` — тільки для табличних даних, **ніколи** для макету
- `<br>` — тільки для переносів у контенті (вірші, адреси), **не** для відступів
- `<h1>`–`<h6>` — тільки для ієрархії контенту, **не** для візуального стилювання
- `<em>` — смисловий наголос, `<strong>` — сильна важливість (не як заміна bold/italic)
- `<i>` — для технічних термінів, іноземних слів; `<b>` — для візуального виділення без семантичної ваги

### 1.3. Ієрархія заголовків

```
h1 — Основна тема сторінки (один на сторінку)
  h2 — Розділ
    h3 — Підрозділ
      h4 — Деталізація
```

- Один `<h1>` на сторінку, він відповідає тематиці сторінки
- Не пропускати рівні: після `<h2>` йде `<h3>`, не `<h4>`
- Кожна `<section>` повинна починатися із заголовка

---

## 2. Зображення

Google знаходить зображення **тільки** через `<img src>` (включаючи всередині `<picture>`). CSS `background-image` **не індексується**.

### 2.1. LCP-зображення (hero, перший екран)

```html
<!-- Preload в <head> -->
<link
    rel="preload"
    as="image"
    href="hero.webp"
    imagesrcset="hero-400.webp 400w, hero-800.webp 800w, hero-1200.webp 1200w"
    imagesizes="100vw"
    fetchpriority="high"
/>

<!-- В body -->
<img
    src="hero-800.webp"
    srcset="hero-400.webp 400w, hero-800.webp 800w, hero-1200.webp 1200w"
    sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 800px"
    width="800"
    height="450"
    alt="Описовий текст зображення"
    fetchpriority="high"
    decoding="async"
/>
```

**Правила для LCP-зображення:**

- `fetchpriority="high"` — підвищити пріоритет завантаження
- **НЕ ставити** `loading="lazy"` — інакше LCP деградує
- `decoding="async"` — неблокуюче декодування
- Завжди `width` + `height` — запобігає CLS
- Preload в `<head>` — браузер почне завантаження раніше

### 2.2. Зображення нижче першого екрана

```html
<img
    src="photo.webp"
    srcset="photo-400.webp 400w, photo-800.webp 800w"
    sizes="(max-width: 600px) 100vw, 400px"
    width="400"
    height="300"
    alt="Описовий alt-текст"
    loading="lazy"
    decoding="async"
/>
```

### 2.3. Art direction через `<picture>`

```html
<picture>
    <source media="(min-width: 1200px)" srcset="hero-desktop.avif" type="image/avif" />
    <source media="(min-width: 1200px)" srcset="hero-desktop.webp" type="image/webp" />
    <source media="(min-width: 600px)" srcset="hero-tablet.webp" type="image/webp" />
    <source srcset="hero-mobile.webp" type="image/webp" />
    <img src="hero-mobile.jpg" width="400" height="300" alt="Опис" fetchpriority="high" />
</picture>
```

### 2.4. Правила для всіх зображень

| Правило                       | Деталі                                                                             |
| ----------------------------- | ---------------------------------------------------------------------------------- |
| **Завжди `width` + `height`** | Або CSS `aspect-ratio`. Без цього — CLS                                            |
| **Завжди `alt`**              | Описовий, з ключовими словами в контексті. Без keyword stuffing                    |
| **Декоративні**               | `alt=""` + `role="presentation"`                                                   |
| **Формат**                    | WebP або AVIF (з fallback JPEG/PNG через `<picture>`)                              |
| **Responsive**                | `srcset` + `sizes` для різних екранів                                              |
| **Іменування файлів**         | Описові: `bihovi-krosivky-nike.webp`, не `IMG_2847.jpg`                            |
| **Не CSS background**         | Контентні зображення — тільки через `<img>`. Google не індексує `background-image` |
| **URL-консистентність**       | Одне зображення — один URL (не дублювати з різних шляхів)                          |

---

## 3. Оптимізація LCP через CSS

### 3.1. Critical CSS (inline)

```html
<head>
    <style>
        /* ТІЛЬКИ стилі для першого екрана, до 14KB */
        *,
        *::before,
        *::after {
            box-sizing: border-box;
        }
        body {
            margin: 0;
            font-family:
                system-ui,
                -apple-system,
                sans-serif;
            color: #333;
        }
        .header {
            /* ... */
        }
        .hero {
            /* ... */
        }
        .nav {
            /* ... */
        }
    </style>

    <!-- Решта CSS — асинхронно -->
    <link rel="preload" href="styles.css" as="style" onload="this.onload=null;this.rel='stylesheet'" />
    <noscript><link rel="stylesheet" href="styles.css" /></noscript>
</head>
```

**Чому 14KB:** це приблизний розмір першого TCP-пакету. Inline CSS в межах цього ліміту приходить разом з HTML і не потребує додаткового запиту.

### 3.2. Шрифти

```css
/* font-display: swap — текст видимий одразу, шрифт підміняється після завантаження */
@font-face {
    font-family: "MainFont";
    src: url("/fonts/main.woff2") format("woff2");
    font-display: swap;
    unicode-range: U+0400-04FF, U+0000-00FF; /* кирилиця + базова латиниця */
}

/* Зменшення CLS при зміні шрифту — size-adjust */
@font-face {
    font-family: "MainFont";
    src: url("/fonts/main.woff2") format("woff2");
    font-display: swap;
    size-adjust: 105%;
    ascent-override: 90%;
    descent-override: 20%;
}
```

```html
<!-- В <head> — preload тільки для критичних шрифтів (1-2 файли) -->
<link rel="preload" as="font" href="/fonts/main.woff2" type="font/woff2" crossorigin />
```

**Правила:**

- Формат: тільки WOFF2
- Subsetting: тільки потрібні символи (`unicode-range`)
- Preload: максимум 1-2 шрифти (основний + bold)
- `font-display: swap` або `optional` (optional — менше CLS, але шрифт може не завантажитись)
- Використовувати `system-ui` як fallback
- Мінімум гарнітур: 1-2 сімейства на весь сайт

### 3.3. CSS що блокує рендеринг

```html
<!-- ❌ ПОГАНО — блокує рендеринг ВСІЄЇ сторінки -->
<link rel="stylesheet" href="all-styles.css" />

<!-- ✅ ДОБРЕ — розділити на critical (inline) та решту (async) -->
<style>
    /* critical */
</style>
<link rel="preload" href="styles.css" as="style" onload="this.onload=null;this.rel='stylesheet'" />

<!-- ✅ Опціонально — media-based splitting -->
<link rel="stylesheet" href="base.css" />
<link rel="stylesheet" href="desktop.css" media="(min-width: 1024px)" />
<link rel="stylesheet" href="print.css" media="print" />
```

---

## 4. Оптимізація CLS через CSS

### 4.1. Резервування місця

```css
/* Зображення — aspect-ratio як fallback до width/height */
img {
    max-width: 100%;
    height: auto;
}

.hero-image {
    aspect-ratio: 16 / 9;
    width: 100%;
    object-fit: cover;
}

/* Рекламні слоти / банери — зарезервувати висоту */
.ad-slot {
    min-height: 250px;
    width: 100%;
    background: #f5f5f5; /* placeholder колір */
}

/* Вбудований контент (iframe, embed) */
.video-wrapper {
    aspect-ratio: 16 / 9;
    width: 100%;
}
.video-wrapper iframe {
    width: 100%;
    height: 100%;
}
```

### 4.2. Динамічний контент без зсувів

```css
/* Cookie-банер, нотифікації — НЕ зсувати контент */
.cookie-banner {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    /* НЕ використовувати position: static/relative зверху */
}

/* Динамічно вставлений контент — contain */
.dynamic-section {
    contain: layout;
}
```

### 4.3. Анімації

```css
/* ✅ ДОБРЕ — transform + opacity НЕ викликають layout */
.fade-in {
    transition:
        transform 0.3s ease,
        opacity 0.3s ease;
}
.slide-up {
    transform: translateY(20px);
    opacity: 0;
    transition:
        transform 0.3s ease,
        opacity 0.3s ease;
}
.slide-up.visible {
    transform: translateY(0);
    opacity: 1;
}

/* ❌ ПОГАНО — width/height/top/left/margin/padding викликають layout shift */
.bad-animation {
    transition:
        width 0.3s,
        margin-top 0.3s,
        left 0.3s; /* УНИКАТИ */
}
```

**Правило:** анімувати **тільки** `transform` та `opacity`. Все інше провокує layout recalculation → CLS.

### 4.4. Off-screen контент

```css
/* Пропустити рендеринг секцій за межами viewport */
.below-fold-section {
    content-visibility: auto;
    contain-intrinsic-size: 0 500px; /* орієнтовна висота для стабільності скролу */
}
```

---

## 5. Оптимізація INP через JavaScript

### 5.1. Підключення скриптів

```html
<!-- Основний JS — defer (виконується після парсингу HTML, зберігає порядок) -->
<script src="app.js" defer></script>

<!-- Незалежний JS (аналітика) — async (виконується одразу після завантаження) -->
<script src="analytics.js" async></script>

<!-- Third-party — відкладене завантаження після інтерактивності -->
<script>
    window.addEventListener("load", () => {
        setTimeout(() => {
            const s = document.createElement("script");
            s.src = "https://third-party.com/widget.js";
            document.body.appendChild(s);
        }, 3000);
    });
</script>
```

| Атрибут  | Коли виконується    | Блокує парсинг | Порядок |
| -------- | ------------------- | -------------- | ------- |
| (нічого) | Одразу при зустрічі | Так            | Так     |
| `async`  | Після завантаження  | Ні             | Ні      |
| `defer`  | Після парсингу HTML | Ні             | Так     |

**Правило:** ніколи не підключати `<script>` без `defer` або `async` (крім inline critical JS).

### 5.2. Розбиття довгих задач

```javascript
// ❌ ПОГАНО — блокує main thread > 50ms
function processAllItems(items) {
    items.forEach((item) => heavyComputation(item)); // може зайняти 200ms+
}

// ✅ ДОБРЕ — віддати контроль браузеру між чанками
async function processAllItems(items) {
    const CHUNK = 10;
    for (let i = 0; i < items.length; i += CHUNK) {
        const chunk = items.slice(i, i + CHUNK);
        chunk.forEach((item) => heavyComputation(item));
        // Дозволити браузеру обробити взаємодію користувача
        await new Promise((resolve) => setTimeout(resolve, 0));
    }
}

// ✅ ДОБРЕ — scheduler.yield() (сучасний API)
async function processItem(item) {
    doPartOne(item);
    await scheduler.yield();
    doPartTwo(item);
    await scheduler.yield();
    doPartThree(item);
}

// ✅ ДОБРЕ — некритичні задачі в requestIdleCallback
requestIdleCallback(
    () => {
        sendAnalytics();
        prefetchNextPage();
    },
    { timeout: 2000 },
);
```

**Правило:** жодна JS-задача не повинна блокувати main thread > 50 мс.

### 5.3. Event handlers

```javascript
// ❌ ПОГАНО — важка робота прямо в обробнику
button.addEventListener("click", () => {
    processData(); // 100ms
    updateDOM(); // 50ms
    sendToServer(); // мережевий запит
    logAnalytics(); // ще робота
});

// ✅ ДОБРЕ — мінімум роботи в обробнику, решта відкладено
button.addEventListener("click", () => {
    updateDOM(); // тільки візуальний відгук — швидко

    // Решта — відкладено
    requestIdleCallback(() => {
        processData();
        sendToServer();
        logAnalytics();
    });
});
```

### 5.4. Web Workers для важких обчислень

```javascript
// main.js
const worker = new Worker("heavy-work.js");
worker.postMessage({ data: largeDataset });
worker.onmessage = (e) => {
    updateUI(e.data.result); // Main thread вільний весь час обчислень
};

// heavy-work.js
self.onmessage = (e) => {
    const result = heavyComputation(e.data);
    self.postMessage({ result });
};
```

### 5.5. Мінімізація DOM

| Параметр                         | Ліміт                   |
| -------------------------------- | ----------------------- |
| Загальна кількість DOM-елементів | < 1500 (ідеально < 800) |
| Максимальна глибина вкладеності  | < 32 рівнів             |
| Дочірніх елементів на вузол      | < 60                    |

Великий DOM збільшує час layout/style recalculation при кожній взаємодії → погіршує INP.

---

## 6. Mobile-First верстка

З липня 2024 Google індексує **тільки** мобільну версію. Якщо контент не доступний на мобільному — він не існує для Google.

### 6.1. CSS-підхід

```css
/* Базові стилі — для мобільних */
.container {
    width: 100%;
    padding: 0 16px;
}

.grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
}

/* Планшет — доповнення */
@media (min-width: 768px) {
    .container {
        max-width: 720px;
        margin: 0 auto;
    }
    .grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

/* Десктоп — доповнення */
@media (min-width: 1200px) {
    .container {
        max-width: 1140px;
    }
    .grid {
        grid-template-columns: repeat(3, 1fr);
    }
}
```

### 6.2. Вимоги

| Вимога                         | Значення                              |
| ------------------------------ | ------------------------------------- |
| Мінімальний розмір тексту      | 16px для body                         |
| Tap target (кнопки, посилання) | ≥ 48×48 px                            |
| Відстань між tap targets       | ≥ 8px                                 |
| Горизонтальний скрол           | Заборонено                            |
| Viewport overflow              | Контент не виходить за межі           |
| Інтерстиціальні popup          | Заборонено (Google знижує ранжування) |

```css
/* Tap targets */
a,
button,
[role="button"],
input,
select,
textarea {
    min-height: 48px;
    min-width: 48px;
}

/* Запобігти overflow */
html {
    overflow-x: hidden;
}
img,
video,
iframe,
table {
    max-width: 100%;
}
```

### 6.3. Паритет контенту

- Мобільна та десктопна версії повинні мати **ідентичний** контент
- Однакові заголовки, текст, зображення, `alt`-тексти
- Не ховати контент на мобільних через `display: none` якщо він потрібен для SEO
- Accordion / tab-контент — нормально, якщо він є в HTML (Google індексує прихований контент у tabs/accordions)

---

## 7. Навігація та lazy loading

### 7.1. Breadcrumbs

```html
<nav aria-label="Breadcrumb">
    <ol>
        <li><a href="/">Головна</a></li>
        <li><a href="/category">Категорія</a></li>
        <li aria-current="page">Поточна сторінка</li>
    </ol>
</nav>
```

Breadcrumbs на кожній внутрішній сторінці — Google використовує їх для розуміння структури сайту та відображення в пошуковій видачі.

### 7.2. Lazy loading контенту

> "Don't lazy-load primary content upon user interaction. Google won't load content that requires user interactions (swiping, clicking, or typing) to load."
> — Google Mobile-first Indexing Best Practices

- Контент, що з'являється тільки після кліку/скролу/свайпу — **не індексується**
- `loading="lazy"` для `<img>` і `<iframe>` — нормально (Google підтримує)
- Infinite scroll — реалізовувати з `<a href>` для пагінації як fallback

---

## 8. Accessibility (a11y)

Google використовує сигнали доступності як частину page experience. Accessibility покращує crawlability та user experience, що впливає на ранжування.

### 8.1. Обов'язкове

```html
<!-- Мова -->
<html lang="uk">
    <!-- Skip link -->
    <a href="#main-content" class="skip-link">Перейти до основного контенту</a>

    <!-- alt для всіх зображень -->
    <img src="product.webp" alt="Чорні бігові кросівки Nike Air Max 2025, вид збоку" />
    <img src="decorative-line.svg" alt="" role="presentation" />

    <!-- ARIA для кнопок без тексту -->
    <button aria-label="Закрити меню">
        <svg><!-- іконка --></svg>
    </button>

    <!-- Form labels -->
    <label for="email">Електронна пошта</label>
    <input type="email" id="email" name="email" required autocomplete="email" />

    <!-- ARIA landmarks (якщо семантичні теги недостатні) -->
    <nav aria-label="Головна навігація">...</nav>
    <nav aria-label="Навігація підвалу">...</nav>
</html>
```

### 8.2. CSS для accessibility

```css
/* Skip link — видимий тільки при фокусі */
.skip-link {
    position: absolute;
    top: -40px;
    left: 0;
    background: #000;
    color: #fff;
    padding: 8px 16px;
    z-index: 9999;
    transition: top 0.2s;
}
.skip-link:focus {
    top: 0;
}

/* Focus — НІКОЛИ не видаляти без заміни */
:focus-visible {
    outline: 2px solid #2563eb;
    outline-offset: 2px;
}

/* ❌ НІКОЛИ ТАК */
*:focus {
    outline: none;
}

/* Мінімальний контраст: 4.5:1 для тексту, 3:1 для великого (≥18px bold або ≥24px) */
body {
    color: #333333; /* на #ffffff — контраст 12.6:1 ✅ */
    font-size: 16px;
    line-height: 1.5;
}

/* Prefers reduced motion */
@media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
    }
}

/* Приховати візуально, але залишити для screen readers */
.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}
```

---

## 9. Чеклист верстальника

### HTML

- [ ] Валідний HTML5 (DOCTYPE, charset, lang)
- [ ] `<meta name="viewport">` присутній
- [ ] Семантична структура: `header` → `nav` → `main` → `footer`
- [ ] Один `<h1>` на сторінку
- [ ] Ієрархія заголовків без пропусків
- [ ] Унікальні `<title>` та `<meta description>` для кожної сторінки
- [ ] `<link rel="canonical">` на кожній сторінці
- [ ] `<html lang="uk">` встановлений
- [ ] Skip navigation link
- [ ] Breadcrumbs з `aria-label`

### Зображення

- [ ] Всі `<img>` мають `alt`
- [ ] Всі `<img>` мають `width` + `height` (або CSS `aspect-ratio`)
- [ ] LCP-зображення: `fetchpriority="high"`, БЕЗ `loading="lazy"`, preload в `<head>`
- [ ] Зображення нижче viewport: `loading="lazy"`
- [ ] Формат: WebP/AVIF з fallback через `<picture>`
- [ ] Responsive: `srcset` + `sizes`
- [ ] Контентні зображення через `<img>`, не CSS `background-image`
- [ ] Описові імена файлів

### CSS

- [ ] Critical CSS inline в `<head>` (< 14KB)
- [ ] Решта CSS — async loading
- [ ] Mobile-first media queries
- [ ] `font-display: swap` для web fonts
- [ ] Шрифти: WOFF2, subset, preload (1-2 файли)
- [ ] Анімації тільки через `transform` / `opacity`
- [ ] `content-visibility: auto` для секцій нижче viewport
- [ ] Резервування місця для динамічного контенту (ads, iframes)
- [ ] `:focus-visible` стилі (не видаляти outline)
- [ ] Контраст тексту ≥ 4.5:1
- [ ] `prefers-reduced-motion` підтримка

### JavaScript

- [ ] Всі скрипти: `defer` або `async` (нічого blocking)
- [ ] Third-party скрипти — відкладене завантаження
- [ ] Жодна задача > 50 мс на main thread
- [ ] Мінімум роботи в event handlers
- [ ] Контент не залежить від user interaction для завантаження

### Mobile

- [ ] Responsive дизайн (mobile-first)
- [ ] Tap targets ≥ 48×48 px, відстань ≥ 8px
- [ ] Текст ≥ 16px без зуму
- [ ] Немає горизонтального скролу
- [ ] Контент ідентичний desktop-версії
- [ ] Немає blocking interstitials/popups

### DOM

- [ ] Загалом < 1500 елементів
- [ ] Глибина < 32 рівнів
- [ ] Дочірніх на вузол < 60

---

## 10. Інструменти перевірки

| Інструмент                                             | Що перевіряє                          |
| ------------------------------------------------------ | ------------------------------------- |
| **Lighthouse** (Chrome DevTools → Lighthouse)          | Performance, Accessibility, SEO score |
| **Chrome DevTools → Performance**                      | Long tasks, layout shifts, INP        |
| **Chrome DevTools → Rendering → Layout Shift Regions** | Візуалізація CLS                      |
| **PageSpeed Insights** (pagespeed.web.dev)             | Core Web Vitals (lab + field)         |
| **W3C Validator** (validator.w3.org)                   | HTML валідність                       |
| **Axe DevTools** (розширення)                          | Accessibility аудит                   |

---

## 11. Джерела

- [SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide) — оновлено 2025-12-10
- [Google Search Essentials](https://developers.google.com/search/docs/essentials) — оновлено 2025-12-10
- [Core Web Vitals](https://developers.google.com/search/docs/appearance/core-web-vitals) — оновлено 2025-12-10
- [Page Experience](https://developers.google.com/search/docs/appearance/page-experience) — оновлено 2025-12-10
- [JavaScript SEO Basics](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics) — оновлено 2025-12-18
- [Mobile-first Indexing](https://developers.google.com/search/docs/crawling-indexing/mobile/mobile-sites-mobile-first-indexing) — оновлено 2025-12-10
- [Image SEO Best Practices](https://developers.google.com/search/docs/appearance/google-images) — оновлено 2025-12-10
- [HTML Semantic Tagging](https://developers.google.com/style/semantic-tagging) — оновлено 2024-10-15
- [Succeeding in AI Search](https://developers.google.com/search/blog/2025/05/succeeding-in-ai-search) — 2025-05
- [web.dev — Top CWV optimizations](https://web.dev/articles/top-cwv)

---

_Актуально на лютий 2026._
