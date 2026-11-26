# ПРОМПТ ДЛЯ CLAUDE CODE — лендинг фотостудии LUMEN

> Положи в корень проекта `TZ.md` и этот файл, а содержимое `lumen-fonts.zip` — в `public/fonts/`. Затем отправь Claude Code текст ниже: целиком или по этапам (раздел «Этапы» в конце).

---

Ты — senior frontend-разработчик и моушн-дизайнер. Собери одностраничный лендинг фотостудии **LUMEN** строго по этому документу и `TZ.md`. Все размеры, позиции, отступы и цвета указаны явно — **не импровизируй, не добавляй блоков, эффектов и декора, которых здесь нет**. Если что-то не описано — выбирай самый сдержанный вариант и отмечай это в отчёте.

## 0. Жёсткие правила

1. Стек: **Next.js 16** (App Router, TypeScript, `src/` не нужен), **Tailwind CSS v4** (`@import "tailwindcss";` в `app/globals.css`, без `@tailwind`), **GSAP 3** (+ `ScrollTrigger`, `SplitText` — плагины бесплатные, входят в пакет `gsap`), **Lenis** (пакет `lenis`). Других UI-библиотек не ставить.
2. Шрифты только локальные через `next/font/local`. Никаких Google Fonts CDN.
3. Пути и имена файлов — только латиница.
4. Анимации — **только 4 эффекта** из раздела 3. Никаких других: без parallax-«плаваний», без magnetic-кнопок, без кастомного курсора, без бегущей строки, без прелоадера, без декоративных пузырей и градиентных пятен.
5. **Никаких надзаголовков** (мелких лейблов над H2). **Никакого курсива** нигде.
6. GSAP: начальное состояние ставь через `gsap.set()` в JS (не через CSS `opacity:0`), анимируй через `gsap.to()`. Каждый эффект — через `gsap.context()`/`useGSAP` с очисткой при размонтировании.
7. Весь контент (тексты, залы, цены, опции, FAQ, отзывы, контакты, ссылки, пути к фото) — в `content/site.ts`, с типами. В компонентах не должно быть ни одной строки русского текста.
8. Все цвета — CSS-переменные из раздела 2.2, прокинутые в Tailwind через `@theme`. HEX в компонентах запрещены.

## 1. Структура проекта

```
app/
  layout.tsx          // шрифты, метаданные из конфига, JSON-LD, <SmoothScroll/>, <BookingProvider/>
  page.tsx            // порядок секций
  globals.css         // токены, @theme, базовые стили, классы эффектов
  api/booking/route.ts
  sitemap.ts, robots.ts
components/
  layout/Header.tsx, MobileMenu.tsx, Footer.tsx, Container.tsx
  sections/Hero.tsx, About.tsx, Halls.tsx, Works.tsx, Why.tsx, Prices.tsx, Steps.tsx, Reviews.tsx, Faq.tsx, Contacts.tsx
  booking/BookingProvider.tsx, BookingModal.tsx, StepHall.tsx, StepDate.tsx, StepOptions.tsx, StepContacts.tsx, StepDone.tsx, Summary.tsx
  ui/Button.tsx, Heading.tsx (с поддержкой акцента), DashList.tsx, HoverFill.tsx
  motion/SmoothScroll.tsx, SplitStagger.tsx, FadeReveal.tsx, BlurIn.tsx
content/site.ts
lib/format.ts         // форматирование ₸: 12 000 ₸ (неразрывный пробел)
public/fonts/  public/images/
```

**Акцент в заголовках.** В `site.ts` заголовок задаётся строкой с квадратными скобками: `"СТУДИЯ, ГДЕ [свет] УЖЕ ВЫСТАВЛЕН"`. `Heading` разбирает скобки: слово в скобках выводится шрифтом `--font-serif`, **в нижнем регистре, прямым начертанием**, тем же кеглем; скобки не выводятся.

## 2. Дизайн-система

### 2.1 Шрифты
- `public/fonts/DefecticaClean-Regular.woff2` → переменная `--font-sans`, family `Defectica Clean`, fallback `Arial, sans-serif`. Шрифт только с прописными — весь текст на нём отображается капсом.
- `public/fonts/StylishJournalSerif-Regular.woff2` → `--font-serif`, fallback `Georgia, serif`.
- Unbounded 500 (через пакет `@fontsource/unbounded`) — **только** для слова `alexwebstudio` в подвале.
- `font-display: swap`. Знак ₸ рисуется fallback-шрифтом — так и задумано.

### 2.2 Цвета (`:root` в globals.css)
```css
--bg:#E4E1DC; --surface:#D7D3CC; --surface-2:#C9C4BC;
--ink:#2B2926; --ink-soft:#6B665F; --line:rgba(43,41,38,.18);
--dark:#2B2926; --on-dark:#ECE9E4; --on-dark-soft:#A39E96;
--accent:#9A7A63; --accent-soft:#E9DDD2;
```
`body { background: var(--bg); color: var(--ink); }`. Выделение текста: `::selection { background: var(--accent); color: var(--on-dark); }`. Все `<img>` контента получают `filter: saturate(.85)`.

### 2.3 Типографика (на `--font-sans`, если не указано иное)
| Токен | Десктоп ≥1024 | Мобайл <768 | LH | Трекинг |
|---|---|---|---|---|
| `display` | `clamp(96px, 21vw, 300px)` — подбирается так, чтобы слово заняло ширину контейнера | `24vw` | 0.82 | -0.04em |
| `h2` | `clamp(40px, 4.6vw, 68px)` | 34px | 0.95 | -0.02em |
| `h3` | 44px | 30px | 1.0 | -0.01em |
| `h4` | 22px | 18px | 1.1 | 0 |
| `body` | 14px | 13px | 1.55 | 0.02em |
| `small` | 12px | 11px | 1.45 | 0.06em |
| `nav` | 13px | 28px (в мобильном меню) | 1 | 0.04em |
| `num` (serif) | 32px | 26px | 1 | 0 |
| `stat` (serif) | 80px | 56px | 0.9 | -0.02em |
| `price` (serif) | 40px | 32px | 1 | 0 |

Максимальная ширина абзаца — 46ch.

### 2.4 Сетка
- Контейнер: `max-width: 1440px; margin: 0 auto; padding-inline: 40px` (≥1024), `32px` (768–1023), `20px` (<768).
- Колонки: 12 (≥1024, gap 24px), 8 (768–1023, gap 20px), 4 (<768, gap 16px).
- Вертикальный отступ секций: `padding-block: 160px` (≥1024), `120px` (768–1023), `88px` (<768).
- Отступ от H2 до контента секции: 72px / 56px / 40px.
- Скругления: **0 везде**, кроме кнопок и бейджей (`999px`).

### 2.5 Кнопки
- **Primary:** высота 52px, `padding: 0 28px`, фон `--ink`, текст `--on-dark`, `small` 12px, трекинг 0.08em, radius 999px. Hover: фон `--accent`, transition `background .35s`. Справа стрелка `↗` 12px, отступ 10px.
- **Secondary (текстовая):** без фона, текст `--ink` 12px, трекинг 0.08em, нижняя линия 1px `currentColor`, стрелка `→`, к тексту применён эффект Hover Fill.
- **На тёмном фоне:** primary инвертируется (фон `--on-dark`, текст `--ink`, hover — фон `--accent`, текст `--on-dark`).
- Фокус: `outline: 2px solid var(--accent); outline-offset: 3px`.

### 2.6 Списки с тире (`DashList`)
Каждая строка: линия 28px × 1px `--ink-soft`, отступ 14px, текст `body`. Между строками 10px.

## 3. Анимации — 4 эффекта AW-Flow (GSAP)

Общее: триггер `ScrollTrigger` `start: "top 80%"`, `once: true`. При `prefers-reduced-motion: reduce` — сразу финальное состояние, без твинов.

**3.1 SplitStagger** (aw-flow/effects/text-split)
```
SplitText(el, { type: mode, mask: false })   // mode: "chars" | "words"
gsap.set(parts, { yPercent: 0, y: 40, rotate: 8, opacity: 0, transformOrigin: "0% 100%" })
gsap.to(parts, { y: 0, rotate: 0, opacity: 1, duration: 0.7, ease: "power2.out",
                 stagger: mode === "chars" ? 0.022 : 0.06, delay })
```
Применение: LUMEN в hero (`chars`, delay 0.15 после загрузки, без скролл-триггера); все H2 (`words`); названия залов h3 (`chars`). После анимации вызывать `split.revert()`. Для строк с акцентом сплить и обычные, и серифные части.

**3.2 FadeReveal** (aw-flow/effects/text-fade)
CSS на элементе:
```css
.fade-reveal{ -webkit-mask-image:linear-gradient(90deg,#000 40%,transparent 60%); mask-image:linear-gradient(90deg,#000 40%,transparent 60%);
  -webkit-mask-size:300% 100%; mask-size:300% 100%; }
```
`gsap.set(el,{ maskPosition:"100% 0", webkitMaskPosition:"100% 0", filter:"blur(4px)" })` → `gsap.to(el,{ maskPosition:"0% 0", webkitMaskPosition:"0% 0", filter:"blur(0px)", duration:1.3, ease:"power1.out" })`. После завершения снять маску (`clearProps`). Применение: все абзацы, описания, подписи, строки DashList (stagger 0.08 между строками).

**3.3 HoverFill** (aw-flow/effects/text-hover-fill)
Компонент `<HoverFill>` оборачивает текст: внутри два слоя — базовый текст и абсолютный дубликат с `color: var(--accent)`, `clip-path: inset(0 100% 0 0)`. При `mouseenter` — `clip-path: inset(0 0% 0 0)`, при `mouseleave` — снова `inset(0 100% 0 0)`. Transition `clip-path .55s cubic-bezier(.33,1,.68,1)`. Дубликат `aria-hidden`. Без `background-clip:text`. Применение: пункты меню, кнопка-ссылка Secondary, названия в «Коллекциях», ссылки подвала, «5.0 на 2ГИС →», «Маршрут в 2ГИС →». На тач-устройствах (`(hover: none)`) не активировать.

**3.4 BlurIn** (aw-flow/effects/blur-in)
`gsap.set(el,{ opacity:0, filter:"blur(16px)", scale:1.05 })` → `gsap.to(el,{ opacity:1, filter:"blur(0px)", scale:1, duration:0.9, ease:"power1.out" })`. Для групп — `stagger: 0.08`. У фото анимировать обёртку с `overflow:hidden`, а `scale` — у `<img>`. Применение: все фото, карточки, ячейки цифр, плитки «Почему у нас», карточки цен, отзывы, открытие попапа.

**3.5 Lenis**
`new Lenis({ lerp: 0.1, smoothWheel: true })`, `lenis.on("scroll", ScrollTrigger.update)`, `gsap.ticker.add(t => lenis.raf(t * 1000))`, `gsap.ticker.lagSmoothing(0)`. Якорные ссылки — `lenis.scrollTo(target, { offset: -80, duration: 1.2 })`. При открытом попапе и мобильном меню — `lenis.stop()`, при закрытии — `lenis.start()`. Экспортировать инстанс через контекст.

## 4. Секции — точная вёрстка

Базовая ширина — 1440px. «Кол. 1–5» означает `grid-column: 1 / 6` в 12-колоночной сетке.

### 4.0 Header
- `position: fixed; top:0; inset-inline:0; z-index:50; height:80px` (мобайл 64px).
- Внутри — Container, flex, `justify-content: space-between; align-items:center`.
- **Слева:** лого `LUMEN` — `--font-sans` 20px, трекинг 0.08em, после слова точка 6×6px `--accent` (круг) на базовой линии, отступ 4px.
- **По центру** (только ≥1024): 5 ссылок `nav` 13px, gap 40px, каждая в `HoverFill`. Абсолютное центрирование по ширине вьюпорта (`left:50%; transform:translateX(-50%)`), чтобы меню стояло ровно по центру, как у Light Lab.
- **Справа:** Primary-кнопка «Забронировать», высота 44px. На <1024 вместо неё — кнопка «Меню» (текст 12px + две линии 20×1px, gap 5px).
- **Состояния:** над hero фон прозрачный. После 80px скролла — фон `rgba(228,225,220,.82)`, `backdrop-filter: blur(14px)`, нижняя линия 1px `--line`, transition `.3s`. При скролле вниз больше 200px шапка уезжает (`translateY(-100%)`), при скролле вверх — возвращается. Transition `transform .45s cubic-bezier(.33,1,.68,1)`.

**MobileMenu** (<1024): fixed, inset 0, фон `--bg`, z-index 60. Сверху строка как в шапке, справа «Закрыть». Ниже, `padding-top: 120px`, 5 ссылок 28px с gap 24px; у каждой: слева номер `01`–`05` serif 14px `--ink-soft`, справа `→`; разделитель 1px `--line`, высота строки 72px. Внизу (`position:absolute; bottom:32px`) — Primary «Забронировать зал» на всю ширину, под ним телефон и Telegram/WhatsApp `small`. Появление: BlurIn для списка с stagger 0.06.

### 4.1 Hero (`#top`)
- `height: 100svh; min-height: 720px; position: relative; overflow: hidden`. Мобайл — `min-height: 640px`.
- **Фон:** `hero.jpg` (`next/image`, `fill`, `priority`, `object-fit: cover`, `object-position: 50% 60%`). Поверх — градиент для читаемости: `linear-gradient(180deg, rgba(228,225,220,.0) 55%, rgba(228,225,220,.55) 100%)`. BlurIn на фото при загрузке (без скролла), длительность 1.2s.
- **LUMEN:** `position:absolute; left:40px; right:40px; top:50%; transform:translateY(-58%)`, `display` (размер подогнать так, чтобы ширина слова = ширина контейнера минус паддинги; посчитать JS-ом через `ResizeObserver`, ограничение 300px), цвет `--ink`, `text-align:center`, `white-space:nowrap`. SplitStagger `chars`.
- **Подзаголовок:** сразу под словом, `margin-top: 20px`, по центру, `h4` 22px, трекинг 0.04em: «ФОТОСТУДИЯ В КАРАГАНДЕ · 3 ЗАЛА». FadeReveal, delay 0.6.
- **Нижняя полоса:** `position:absolute; bottom:40px; left:40px; right:40px`, grid 12 колонок:
  - кол. 1–4 — текст `body`, max 34ch, FadeReveal, delay 0.8;
  - кол. 9–12 — flex `justify-content:flex-end; gap:28px; align-items:center`: Secondary «Смотреть залы» → `#halls`, Primary «Забронировать зал». BlurIn, delay 0.9.
- **Мобайл:** слово LUMEN `top: 38%`; подзаголовок 16px; нижний блок в одну колонку: текст, под ним (16px) Primary на всю ширину, Secondary под ней по центру.

### 4.2 О студии (`#about`)
- H2 по центру, `max-width: 1100px; margin-inline:auto; text-align:center`. SplitStagger `words`.
- Grid, `margin-top:72px`, `align-items:start`:
  - кол. 1–5: три абзаца `body`, gap 18px, `padding-top: 8px`, max-width 46ch. FadeReveal.
  - кол. 7–12: фото `about.jpg`, `aspect-ratio: 3/2`. BlurIn.
- **Ряд цифр:** `margin-top:120px`, `border-top:1px solid var(--line)`, grid 4 × `col-span-3`. Каждая ячейка: `padding: 28px 24px 0 24px`, `border-left:1px solid var(--line)` (у первой нет, `padding-left:0`).
  - число — `stat` serif;
  - `margin-top:16px` — подпись `h4` 22px (например, «ЗАЛА»);
  - `margin-top:20px` — описание `small` `--ink-soft`, max 28ch.
  - BlurIn группой, stagger 0.08.
- **Мобайл:** фото над текстом; цифры 2 × 2 (`border-left` только у правой колонки, у второй строки — `border-top`), `padding: 24px 16px`.

### 4.3 Залы (`#halls`)
- Шапка секции: grid; H2 в кол. 1–7 (SplitStagger `words`); текст в кол. 9–12, выравнивание по нижнему краю H2 (`align-self:end`), `body` `--ink-soft`, FadeReveal.
- `margin-top:72px`, три зала в столбик, между ними 120px, у каждого сверху `border-top:1px solid var(--line); padding-top: 40px`.
- **Зал (нечётный — фото слева):** grid 12, `align-items: start`:
  - кол. 1–7: фото `aspect-ratio: 4/3`, `position:relative`. У новогоднего — бейдж `position:absolute; top:20px; left:20px`, фон `--accent`, текст `--on-dark` `small` 11px, `padding: 8px 14px`, radius 999px. BlurIn.
  - кол. 9–12 — колонка-flex с `min-height` по высоте фото и `justify-content: space-between`:
    - верх: номер `01` (`num` serif `--ink-soft`), `margin-top:16px` название `h3` (SplitStagger `chars`), `margin-top:20px` описание `body` (FadeReveal), `margin-top:28px` DashList (4 строки);
    - низ: строка цены — `price` serif + `small` «/ ЧАС» с отступом 8px, под ней `small` `--ink-soft` «МИНИМУМ 1 ЧАС», `margin-top:24px` Primary «Забронировать этот зал» → открывает попап с `hallId`.
- **Чётный зал (02):** зеркально — фото в кол. 6–12, текст в кол. 1–4.
- **Мобайл:** фото сверху (`aspect-ratio: 4/5`), текст под ним, кнопка на всю ширину, между залами 72px.

### 4.4 Коллекции съёмок (`#works`)
- H2 слева (кол. 1–8), SplitStagger `words`.
- Список `margin-top:72px`, `border-top:1px solid var(--line)`. Каждый ряд — `<button>` на всю ширину, `aria-expanded`, `border-bottom:1px solid var(--line)`:
  - высота заголовочной строки 104px (мобайл 76px), grid 12, `align-items:center`;
  - кол. 1–2: `01 /` — `num` serif;
  - кол. 4–10: название `h4` 22px (мобайл 16px), в `HoverFill`;
  - кол. 12: `→` 22px, `justify-self:end`; при открытии поворот на 90° (`transform .45s`).
  - **Раскрытие:** панель с grid 4 × `col-span-3` (мобайл — горизонтальный скролл, карточки шириной 72vw, `scroll-snap`), фото `aspect-ratio: 3/4`, `padding-bottom:32px`. Высота анимируется GSAP `height: 0 → auto`, 0.6s, `power2.out`; фото внутри — BlurIn с stagger 0.08 в момент открытия. Одновременно открыт только один ряд. По умолчанию все закрыты.

### 4.5 Почему у нас (`#why`)
- H2 слева (кол. 1–8).
- Grid `margin-top:72px`: 4 колонки (каждая `col-span-3`), 2 ряда, gap 16px. Все ячейки `aspect-ratio: 3/4`. Порядок: **[текст] [текст] [фото why-1] [графит с текстом] / [фото why-2] [графит пустой] [текст] [текст]**.
  - **Текстовая карточка:** `border:1px solid var(--line)`, `padding: 24px`, flex-column `justify-content: space-between`. Вверху — заголовок 16px с акцентом в квадратных скобках (акцентная часть serif 18px), max 18ch. Внизу — описание `small` `--ink-soft`, max 30ch.
  - **Графит с текстом:** фон `--dark`, `padding:24px`, текст `small` `--on-dark` прижат к низу.
  - **Графит пустой:** просто фон `--dark`.
  - **Фото:** `object-fit:cover`.
  - BlurIn: ряд 1 и ряд 2 отдельными группами, stagger 0.08.
- **Планшет:** 2 колонки (`col-span-4` из 8). **Мобайл:** 2 колонки, `aspect-ratio: 3/4`, gap 10px, `padding:16px`, текст заголовка 13px.

### 4.6 Форматы и цены (`#prices`)
- H2 по центру (как в Light Lab), SplitStagger `words`.
- Grid `margin-top:72px`: 3 карточки `col-span-4`, gap 16px, `min-height: 560px`, `padding: 36px 32px`, flex-column `justify-content: space-between`.
  - **Карточка 1** — фон `--dark`, текст `--on-dark`, линии списка `--on-dark-soft`, кнопка инвертированная.
  - **Карточки 2–3** — фон `--surface`.
  - Верх: название `h4` 22px; `margin-top:12px` подзаголовок `small` (soft); `margin-top:36px` DashList.
  - Низ: цена `price` serif, `margin-top:24px` Primary «Записаться» → попап (без предвыбора зала).
  - BlurIn группой, stagger 0.08.
- **Мобайл:** карточки в столбик, gap 12px, `min-height:auto`, отступ между верхом и низом 40px.

### 4.7 Как проходит съёмка (`#steps`)
- H2 слева (кол. 1–8).
- Grid `margin-top:72px`: 4 шага `col-span-3`. У каждого: `border-top:1px solid var(--ink)` (именно `--ink`, не `--line`), `padding-top:24px`; номер `01` `num` serif; `margin-top:40px` название `h4`; `margin-top:12px` текст `body` `--ink-soft`. Шаги — BlurIn с stagger 0.1, текст — FadeReveal.
- **Мобайл:** 1 колонка, gap 32px.

### 4.8 Отзывы (`#reviews`)
- Шапка: grid; H2 кол. 1–8; справа кол. 10–12, `align-self:end; justify-self:end` — ссылка «5.0 НА 2ГИС →» (`HoverFill`, `small`, `target="_blank"`, URL из конфига).
- Grid `margin-top:72px`: 3 карточки `col-span-4`, фон `--surface`, `padding:32px`, `min-height:340px`, flex-column `justify-content: space-between`.
  - Верх: `“` serif 56px `--accent`, высота строки 0.6; `margin-top:20px` текст отзыва `body`.
  - Низ: `border-top:1px solid var(--line); padding-top:18px`; имя `h4` 16px, под ним формат `small` `--ink-soft`.
- **Мобайл:** горизонтальный скролл со `scroll-snap`, карточка 84vw, gap 12px. Нативный скролл, без JS-слайдера.

### 4.9 FAQ (`#faq`)
- Grid: кол. 1–4 — H2, `position: sticky; top: 120px` (только ≥1024).
- Кол. 6–12 — аккордеон, `border-top:1px solid var(--line)`. Пункт: `<button aria-expanded>` высотой 84px, flex `justify-content: space-between`, вопрос `h4` 18px, справа `+` 22px (при открытии поворачивается на 45°, `.35s`). Ответ — `body` `--ink-soft`, `padding: 0 64px 28px 0`, высота `0 → auto` через GSAP 0.5s `power2.out`. `border-bottom:1px solid var(--line)`. Можно открывать несколько пунктов.
- **Мобайл:** одна колонка, H2 не липкий.

### 4.10 Контакты (`#contacts`)
- Grid, gap 16px, `align-items: stretch`:
  - кол. 1–6: карточка `--surface-2`, `padding:48px` (мобайл 28px), flex-column `justify-content: space-between`, `min-height: 640px` (мобайл auto).
    - Верх: H2 (SplitStagger `words`); `margin-top:24px` текст `body` max 40ch; `margin-top:32px` Primary «Забронировать зал».
    - Низ (`margin-top:56px`): 2 колонки gap 24px. Левая: «АДРЕС» `small` soft + адрес `body` + ссылка «Маршрут в 2ГИС →» (`HoverFill`); «ВРЕМЯ» + часы. Правая: «ТЕЛЕФОН» + `tel:`-ссылка; «СОЦСЕТИ» + Telegram / WhatsApp / Instagram в столбик, каждая в `HoverFill`.
  - кол. 7–12: фото `contacts.jpg`, `object-fit:cover`, высота = высота карточки. BlurIn.
- **Мобайл:** фото сверху `aspect-ratio: 4/5`, карточка под ним.

### 4.11 Footer
- Фон `--dark`, текст `--on-dark`, `padding-top:120px` (мобайл 80px).
- Верх: grid 12. Кол. 1–4: `small` `--on-dark-soft` «ФОТОСТУДИЯ В КАРАГАНДЕ. ТРИ ЗАЛА, СВЕТ И РЕКВИЗИТ — В ЦЕНЕ ЧАСА.» max 32ch. Кол. 6–7: меню (5 ссылок, `small`, gap 12px). Кол. 8–9: контакты. Кол. 10–12: соцсети + инвертированная Primary «Забронировать». Все ссылки в `HoverFill`.
- `margin-top:96px` — слово **LUMEN** на всю ширину контейнера (тот же расчёт, что в hero), цвет `--on-dark`, `line-height:.8`, SplitStagger `chars` при скролле.
- Нижняя строка: `margin-top:40px`, `border-top:1px solid rgba(236,233,228,.14)`, `padding: 24px 0 32px`, flex `space-between`, `small` `--on-dark-soft`:
  - «© LUMEN, 2026. Концепт-сайт.»
  - «Политика конфиденциальности» (`/privacy` — сделать простую страницу-заглушку на том же лейауте)
  - «Разработано — **alexwebstudio**»: слово `alexwebstudio` — строчными, шрифт Unbounded 500, цвет `--on-dark`, ссылка `https://www.alexwebstudio.ru/`, `target="_blank" rel="noopener"`, `HoverFill`. Это обязательный элемент, не удалять.
  - «Наверх ↑» → `lenis.scrollTo(0)`.
- **Мобайл:** колонки в столбик с gap 40px; нижняя строка — столбик, gap 12px.

### 4.12 Мобильная плашка брони
На <768: после прохождения hero снизу появляется фиксированная плашка (`bottom:12px; left:12px; right:12px`, высота 56px, фон `--ink`, radius 999px): слева «ЗАБРОНИРОВАТЬ ЗАЛ», справа «от 9 000 ₸/ч». Появление/скрытие — `translateY(150%) → 0`, `.4s`. Скрывается, когда виден блок Контакты или подвал.

## 5. Попап бронирования

- Глобальный контекст `useBooking()` с методом `open(hallId?)`. Все CTA вызывают его.
- Оверлей: fixed, inset 0, z-index 100, фон `rgba(43,41,38,.55)` + `backdrop-filter: blur(6px)`, opacity `0 → 1` за 0.3s. Клик по оверлею или Esc — закрыть (с подтверждением, если заполнены контакты). Ловушка фокуса, `role="dialog"`, `aria-modal`, `aria-labelledby`. `lenis.stop()` при открытии.
- **Панель (≥1024):** по центру, `width: min(1180px, 100vw - 80px)`, `height: min(760px, 100svh - 80px)`, фон `--bg`, grid `5fr 7fr`, без скруглений. Появление — BlurIn (0.9s).
  - **Левая колонка (Summary):** фото выбранного зала на всю высоту колонки, `object-fit:cover`. При смене зала — кроссфейд 0.5s (новое фото поверх старого: BlurIn). Снизу поверх фото — плашка `--dark` (`position:absolute; left:20px; right:20px; bottom:20px; padding:24px`, текст `--on-dark`): название зала `h4`, затем построчно `small` «ДАТА · ВРЕМЯ · ДЛИТЕЛЬНОСТЬ · ОПЦИИ» (пустые — «—»), разделитель, «ИТОГО» + сумма `price` serif. Пока зал не выбран — фото `booking-empty.jpg` и текст «ВЫБЕРИТЕ ЗАЛ».
  - **Правая колонка:** `padding: 40px 48px`, flex-column.
    - Шапка: слева «БРОНИРОВАНИЕ» `small` soft; справа «Закрыть ✕» `small`. Под ней — прогресс: 4 сегмента (шаги 1–4) в ряд, gap 6px, высота 2px, фон `--line`, пройденные и активный — `--ink`, transition `.4s`. Под ними — «ШАГ 2 ИЗ 4» `small` soft.
    - Заголовок шага — H2 34px, `margin-top:32px`, SplitStagger `words` при каждой смене шага.
    - Контент шага — `margin-top:28px`, `flex:1; overflow-y:auto` (через `data-lenis-prevent`). Смена шага: старый контент `opacity → 0` за 0.2s, новый — FadeReveal.
    - Футер: `border-top:1px solid var(--line); padding-top:20px`, flex `space-between`: Secondary «← Назад» (скрыта на шаге 1), Primary «Далее» / на шаге 4 — «Отправить бронь». Кнопка неактивна (`opacity .4`, `cursor:not-allowed`), пока шаг невалиден.
- **Мобайл (<1024):** полноэкранный лист (`inset:0`), Summary — свёрнутая плашка вверху (высота 64px: миниатюра 48×48 + название зала + сумма). По тапу раскрывается вниз с полным итогом. Футер прилипает к низу, кнопки на всю ширину (Назад — иконка 52×52 слева).

**Шаг 1 — «ВЫБЕРИТЕ [зал]»:** 3 карточки в столбик, gap 12px. Карточка — `<button role="radio">`, grid `120px 1fr auto`, высота 120px, `border:1px solid var(--line)`, `padding:12px`: миниатюра 96×96 cover | название `h4` 18px + `small` soft «80 М² · ЦИКЛОРАМА» | цена `num` serif 22px + `small` «/ЧАС». У новогоднего — мини-бейдж «СЕЗОН» `--accent`. Выбранная: `border-color: var(--ink)`, фон `--accent-soft`, слева внутренняя полоса 3px `--accent`. Hover — `border-color: var(--ink-soft)`.

**Шаг 2 — «ДАТА И [время]»:** лента 14 дней — горизонтальный скролл, ячейка 64×76px, gap 8px, `border:1px solid var(--line)`: сверху день недели `small` («ПН»), снизу число `num` serif 24px. Выбранная — фон `--ink`, текст `--on-dark`. Ниже, `margin-top:28px`, «ВРЕМЯ» `small` soft и сетка слотов: 4 колонки, gap 8px, высота 48px, текст 14px («09:00»). Занятые (демо: детерминированно от даты, ~30 %) — зачёркнуты, `--ink-soft` 40 %, `disabled`. Выбранный — фон `--ink`. Слот считается доступным, только если свободны все часы выбранной длительности (по умолчанию 1 ч; при смене длительности на шаге 3 перепроверять и при конфликте показывать предупреждение `small` `--accent`).

**Шаг 3 — «ДЛИТЕЛЬНОСТЬ И [опции]»:** сегменты «1 Ч · 2 Ч · 3 Ч · 4 Ч» — 4 кнопки в ряд, высота 52px, общая рамка `--line`, выбранная — фон `--ink`. Ниже, `margin-top:32px`, «ДОПОЛНИТЕЛЬНО» и 4 карточки-чекбокса 2 × 2, gap 10px, высота 88px, `padding:16px`: название 14px, цена `small` soft («+15 000 ₸/Ч»), справа квадрат 18×18 (`border 1px --ink`, в отмеченном состоянии — заливка `--accent` и ✓). Цена «/Ч» умножается на длительность.

**Шаг 4 — «КАК С ВАМИ [связаться]»:** поля — подпись `small` soft над полем, поле высотой 52px, без фона, только нижняя линия 1px `--ink`, текст 16px (на мобайле важно: не меньше 16px — иначе iOS зумит). Имя (обязательно, ≥2 символа); телефон с маской `+7 (___) ___-__-__` (обязательно, 11 цифр); «Способ связи» — 3 чипа radio (Telegram / WhatsApp / Звонок), высота 40px, radius 999px; комментарий — textarea, 3 строки; чекбокс «Согласен с политикой конфиденциальности» (ссылка на `/privacy`). Ошибки — `small` `--accent` под полем, показываются после blur или попытки отправки.

**Шаг 5 — «Готово»:** правая колонка: крупная ✓ в круге 72px (`border 1px --ink`), H2 «БРОНЬ [отправлена]», текст «ПОДТВЕРДИМ В ТЕЧЕНИЕ 15 МИНУТ В ВЫБРАННОМ МЕССЕНДЖЕРЕ.», Primary «Закрыть». Прогресс скрыт. Состояние формы сбрасывается после закрытия.

**Отправка:** `POST /api/booking` (`app/api/booking/route.ts`) — валидировать тело, `console.log`, вернуть `{ ok: true }`; задержка UI — показать на кнопке «ОТПРАВЛЯЕМ…». В коде — комментарий `// TODO: Telegram Bot API — токен и chat_id из env`.

**Расчёт:** `итог = цена_зала × часы + Σ(опции: perHour ? цена × часы : цена)`. Формат: `lib/format.ts` → `12 000 ₸` (неразрывные пробелы).

## 6. `content/site.ts`

Типизированный объект: `brand` (name, city, tagline, description), `nav[]`, `hero`, `about` (title, paragraphs[], stats[]), `halls[]` (id, num, name, badge?, short, description, specs[], pricePerHour, minHours, image, gallery?), `works[]` (num, title, images[4]), `why[]` (type: "text" | "image" | "dark", title?, text?, image?), `prices[]` (title, subtitle, items[], price, dark?), `steps[]`, `reviews[]`, `faq[]`, `contacts` (address, hours, phone, telegram, whatsapp, instagram, gis2Url, gisRating, coords), `booking` (options[]: id, title, price, perHour; days: 14; hours: [9..21]), `footer` (text, credit: { label: "alexwebstudio", url: "https://www.alexwebstudio.ru/" }), `seo`. **Тексты — дословно из `TZ.md`, раздел 7.**

## 7. Фото

Положи в `public/images/` (JPG, длинная сторона 2000px, качество ~80). Бери с **Unsplash** или **Pexels** (бесплатная коммерческая лицензия). Если доступа к ним нет — создай нейтральные серые плейсхолдеры (`--surface`) с названием файла по центру, вёрстку не ломай. Список источников сохрани в `public/images/CREDITS.md`.

| Файл | Поисковый запрос | Кадр |
|---|---|---|
| `hero.jpg` | photo studio cyclorama lights | светлая пустая студия, стойки света, белый фон, горизонт |
| `about.jpg` | photography studio interior softbox window | студия со светом и окном, 3:2 |
| `hall-newyear.jpg` | christmas tree cozy interior photoshoot | ёлка, гирлянды, кресло, тёплый свет |
| `hall-white.jpg` | white cyclorama studio | белая циклорама, свет по бокам |
| `hall-loft.jpg` | loft studio daylight large windows | окна в пол, кирпич, лён |
| `works-portrait-1…4.jpg` | studio portrait neutral background | портреты на сером/бежевом |
| `works-family-1…4.jpg` | family christmas photoshoot | семья, Новый год |
| `works-love-1…4.jpg` | couple studio photoshoot | пара в студии |
| `works-business-1…4.jpg` | product flat lay studio / brand content | контент для бренда |
| `why-1.jpg`, `why-2.jpg` | photographer behind camera studio | процесс съёмки, вертикаль |
| `contacts.jpg` | photo studio make-up room mirror lights | гримёрка, вертикаль |
| `booking-empty.jpg` | empty photo studio light stand | пустая студия, вертикаль |
| `og.jpg` | — | собрать из hero 1200×630 |

## 8. SEO и прочее

- `metadata` из `site.seo`: title «LUMEN — фотостудия в Караганде · 3 зала», description, Open Graph с `og.jpg`, `lang="ru"`.
- JSON-LD `LocalBusiness` (name, address, telephone, openingHours, geo, priceRange «9 000–12 000 ₸»).
- `sitemap.ts`, `robots.ts`, favicon — буква «L» + точка `--accent` (SVG).
- Все изображения через `next/image` с `sizes`, кроме hero — `loading="lazy"`.
- `ScrollTrigger.refresh()` после загрузки шрифтов (`document.fonts.ready`) и изображений.

## 9. Проверка перед сдачей (сделай сам и приложи отчёт)

1. `npm run build` без ошибок и предупреждений TypeScript.
2. Просмотр на 1440, 1024, 768, 390: ничего не вылезает, LUMEN занимает ширину контейнера, нет горизонтального скролла.
3. Каждая секция появляется только своими эффектами из раздела 3, лишней анимации нет.
4. Попап: открытие из каждой CTA; предвыбор зала из карточки зала; итог считается верно (проверь 2–3 комбинации); Esc, фокус, мобильный лист, отправка → экран «Готово».
5. `prefers-reduced-motion` — контент виден сразу.
6. В компонентах нет русских строк и HEX-цветов (`grep`).
7. В подвале есть «Разработано — alexwebstudio» со ссылкой на alexwebstudio.ru.
8. Lighthouse mobile: Performance ≥ 85, Accessibility ≥ 95.

---

## Этапы (если отправлять по частям)

1. **Каркас:** проект, шрифты, токены, Container, Button, Heading, `site.ts` с полным контентом, Lenis, 4 эффекта в `components/motion`. Показать пустую страницу с типографической таблицей.
2. **Header + Hero + О студии.**
3. **Залы + Коллекции + Почему у нас.**
4. **Цены + Шаги + Отзывы + FAQ + Контакты + Footer + мобильная плашка.**
5. **Попап бронирования + API-заглушка.**
6. **Фото, SEO, адаптив, чек-лист из раздела 9.**

На каждом этапе: сначала перечитай соответствующие пункты этого файла, после — короткий отчёт, что сделано и что отклонено от ТЗ (если отклонено — почему).
