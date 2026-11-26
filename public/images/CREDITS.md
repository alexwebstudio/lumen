# Фото — источники

Фото для прототипа взяты из архива «фотки для сайта.zip» (подборка с Pinterest по `PHOTOS-PINTEREST.md`).
⚠️ Pinterest — источник для поиска, а не лицензия. На сайт реального клиента — его собственные фото или стоки с коммерческой лицензией (Unsplash, Pexels).

Раскладка и кроп — `node scripts/photos.mjs <папка с фото>` (кроп по самой содержательной зоне кадра, без апскейла).
Если фото нет — `node scripts/placeholders.mjs` вернёт серые плейсхолдеры.

| Файл | Исходник из архива | Что на фото |
|---|---|---|
| hero.jpg, og.jpg | отдельное фото от заказчика (2000×1600) | циклорама, софтбоксы, кубы |
| works/* (12 шт.) | подборка людей из «Загрузок» — см. scripts/collections.mjs | портреты, семьи, пары, бизнес |
| about.jpg | отдельное фото (1501×2000) | кожаное кресло, софтбокс Godox, окна в пол |
| halls/newyear.jpg, works/family-1.jpg | Без названия (12).jpg | ёлка, кресло, подарки |
| halls/white.jpg | отдельное фото (1333×2000) | арочное окно, белый фон, свет на стойках |
| halls/loft.jpg, works/love-1.jpg | Без названия (15).jpg | лофт, окна в пол, дерево |
| works/portrait-2.jpg, why/why-4.jpg | Behind the scenes bastiaan woudt.jpg | фотограф за работой |
| works/portrait-3.jpg, why/why-1.jpg | Без названия (17).jpg | свет на стойках |
| works/family-3.jpg, why/why-8.jpg | Coffee.jpg | кофе, кресло |
| works/love-2.jpg, why/why-3.jpg, booking-empty.jpg | Без названия (19).jpg | пустой зал с окнами |
| works/love-3.jpg, why/why-7.jpg | Geometry.jpg | высокий пролёт |
| works/business-1.jpg, why/why-2.jpg | Без названия (16).jpg | кубы-подиумы на белом |
| works/business-3.jpg, why/why-5.jpg | Beauty Mirror _ Low Exposure _ Dark Aesthetic.jpg | гримёрка, зеркало с лампами |
| why/why-6.jpg | Без названия (18).jpg | собака на стуле |

В архиве 13 фото на 25 мест, коллекции и hero теперь заменены отдельными фото.
