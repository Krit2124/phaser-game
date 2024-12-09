
# Простая игра на Phaser 3 с использованием Matter.js
Ссылка на задание: https://docs.google.com/document/d/1cT4-YV3CSurr3cjkgGYHHqZmXs30zUoutWA8OUJ0e1M

При разработке были использованы также React и сборщик Vite.

## Структура проекта

Для приложения была использована архитектура FSD: https://feature-sliced.design/docs/get-started/overview
```
- public/                     // Папка для статических файлов, доступных на сервере (например, изображений)
- src/                        // Главная папка с исходным кодом приложения
  - app/                        // Входная точка приложения и основные настройки
    - layouts/                    // Макеты страниц
    - main.tsx                    // Главный файл, точка входа в приложение
    - vite-env.d.ts               // Файл для определения типов окружения в Vite
  - pages/                      // Страницы приложения
    - CharacterSelection/         // Страница выбора персонажа
    - ErrorPage/                  // Страница для вывода ошибки при навигации
    - GamePage/                   // Страница с игрой
  - shared/                     // Общие модули и ресурсы, используемые в приложении
    - hooks/                      // Пользовательские хуки
    - store/                      // Redux-хранилище и редьюсеры (здесь можно легко добавить новых персонажей)
    - styles/                     // Общие стили приложения
    - types/                      // Общие типы и интерфейсы TypeScript
    - ui/                         // Компоненты пользовательского интерфейса
    - utils/                      // Утилиты и вспомогательные функции
  - widgets/                    // Виджеты (самостоятельные блоки UI, которые могут использоваться повторно)
    - CharacterList/              // Компонент отображения списка персонажей
- .gitignore                  // Файлы и папки, игнорируемые Git
- eslint.config.js            // Конфигурация для линтера ESLint
- index.html                  // Основной HTML-файл, используемый Vite
- package.json                // Список зависимостей и скриптов проекта
- README.md                   // Документация проекта
- tsconfig.app.json           // Конфигурация TypeScript для приложения
- tsconfig.json               // Общая конфигурация TypeScript
- tsconfig.node.json          // Конфигурация TypeScript для серверных/Node.js файлов
- vite.config.ts              // Конфигурация Vite
- yarn.lock                   // Фиксация версий зависимостей для Yarn
```

## Отличия от задания

В данном проекте их всего 2:
1) Интерфейс выбора персонажа был реализован без использования Phaser, так как в данном конкретном приложении использовать только React для данной задачи было гораздо проще
2) Весь интерфейс сделан на английском языке, чтобы не было смешения разных языков

## Возможные улучшения

1) Улучшение интерфейса выбора персонажа
Сейчас в этом нет большой необходимости, так как проект не рассчитан на работу с обычными пользователями. Но в обратном случае это было бы полезно, чтобы улучшить пользовательский опыт.
2) Использование ассетов для оформления
Для улучшения визуальной привлекательности можно использовать графические ассеты: оформить рамки всплывающего текста, счётчик жизней, а также добавить анимации для падающих камней и других объектов. Тем не менее, в рамках тестового задания это нецелесообразно, так как поиск и подбор подходящих ассетов может занять значительное время.
3) Добавление уникальных особенностей персонажам
Разные персонажи могли бы обладать уникальными характеристиками, такими как увеличенное количество жизней, высокая скорость или особые умения. Однако это не было предусмотрено в требованиях, а также может оказаться лишним, если такие функции не востребованы в проекте. Кроме того, реализация подобного функционала может оказаться достаточно трудозатратной.
4) Сохранение результатов мини-игры с падающими камнями
Добавление системы сохранения результатов было бы полезно для пользователей, которые стремятся побить собственные рекорды или конкурировать с другими (так называемые "ачиверы"). Это повысило бы интерес к игре.
5) Разные уровни сложности
Добавление разных уровней сложности может быть полезно для пользователей, для которых стандартная сложность кажется слишком лёгкой или слишком сложной.
6) Оптимизация приложения
Оптимизация всегда актуальна, особенно для улучшения производительности и уменьшения использования ресурсов. Однако, поскольку я впервые работаю с Phaser, эта задача представляет для меня определённую сложность и может потребовать больше времени на изучение и реализацию.


## Развёртывание проекта

Ссылка на деплой: https://phaser-game-xi.vercel.app/

Для локального запуска веб-приложение нужно выполнить следующие инструкции:

### 1. Клонирование репозитория

```bash
git clone https://github.com/Krit2124/phaser-game
```

---

### 2. Перейдите в директорию проекта 

```bash 
cd phaser-game
```

---

### 3. Убедитесь, что у вас установлены следующие зависимости

- [Node.js](https://nodejs.org/) (рекомендуется версия **16.x** или выше)
- [npm](https://www.npmjs.com/) или [yarn](https://yarnpkg.com/) для управления пакетами

Проверьте версии Node.js и npm, выполнив:
```bash
node -v
npm -v
```

---

### 4. Установка зависимостей

Для установки всех необходимых пакетов выполните:

```bash
npm install
```

Или, если вы используете Yarn:

```bash
yarn
```

---

### 5. Запуск приложения в режиме разработки

После установки зависимостей запустите проект локально:

```bash
npm run dev
```

Или с использованием Yarn:

```bash
yarn dev
```

После запуска вы увидите в консоли URL-адрес. Обычно это:

```
  Local:   http://localhost:5173/
```

Перейдите по указанному адресу в вашем браузере.

---

### 6. Сборка приложения для продакшена

Для сборки оптимизированной версии приложения выполните:

```bash
npm run build
```

Или с использованием Yarn:

```bash
yarn build
```

Это создаст папку `dist`, содержащую готовую к развертыванию версию приложения.

---

### 7. Предпросмотр продакшн-сборки (опционально)

Чтобы запустить предварительный просмотр продакшн-версии:

```bash
npm run preview
```

Или с использованием Yarn:

```bash
yarn preview
```