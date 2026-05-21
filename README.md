# Реактивация клиентов для Bitrix24

Frontend-шаблон SaaS-интерфейса по PNG-макетам.

## Страницы

- `index.html` - Dashboard
- `recommendations.html` - Рекомендации
- `coupons.html` - Купоны
- `risk-clients.html` - Клиенты в зоне риска
- `settings.html` - Настройки

## Запуск

```bash
npm run dev
```

Локальный адрес по умолчанию:

```text
http://127.0.0.1:5173/
```

## Структура

- `css/` - модульные CSS-файлы
- `js/` - данные, общий код и page-specific логика
- `assets/` - SVG-иконки
- `vendor/` - локальные vendor-скрипты
- `maket/` - исходные PNG-макеты

Все данные сейчас статические и находятся в `js/data.js`; для backend-интеграции их можно заменить на API-ответы через слой `js/data-service.js`.
