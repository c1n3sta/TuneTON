# Объединенный обзор проекта TuneTON

Этот документ предоставляет комплексный, объединенный обзор всего приложения TuneTON, включая все компоненты, схему базы данных, функции и архитектурные элементы с подробной информацией о объеме работ для каждого элемента.

## Содержание
1. [Обзор архитектуры системы](#обзор-архитектуры-системы)
2. [Компоненты фронтенда](#компоненты-фронтенда)
3. [Компоненты бэкенда](#компоненты-бэкенда)
4. [Схема базы данных](#схема-базы-данных)
5. [Функции API](#функции-api)
6. [Вспомогательные функции](#вспомогательные-функции)
7. [Функции хуков](#функции-хуков)
8. [Пограничные функции](#пограничные-функции)
9. [Компоненты аудиодвижка](#компоненты-аудиодвижка)
10. [Зависимости проекта](#зависимости-проекта)

## Обзор архитектуры системы

### Расположение: `src/App.tsx`, `src/main.tsx`
### Связано с: Все компоненты фронтенда, бэкенд Supabase
### Использование: Основная точка входа приложения, инициализирующая React-приложение и оборачивающая его контекстом аутентификации
### Статус реализации: ✅ Завершено
### Этап: Готово к производству

Приложение следует современной архитектуре React с TypeScript, используя Vite в качестве системы сборки. Основная точка входа находится в `src/main.tsx`, которая отображает компонент `App` из `src/App.tsx`. Компонент App оборачивает все приложение `TelegramAuthProvider` для аутентификации и `MusicApp` для основной логики приложения.

### Архитектура фронтенда
- **Фреймворк**: React 18 с TypeScript
- **Система сборки**: Vite с горячей заменой модулей
- **Управление состоянием**: React Context API и пользовательские хуки
- **Компоненты UI**: Примитивы Radix UI со стилизацией Tailwind CSS
- **Маршрутизация**: React Router DOM для навигации на стороне клиента
- **Аудиообработка**: Web Audio API с Tone.js для продвинутых эффектов
- **Мобильная интеграция**: Telegram WebApp SDK для нативной интеграции

### Архитектура бэкенда
- **База данных**: Supabase PostgreSQL с Row Level Security
- **Аутентификация**: Проверка данных Telegram WebApp с Supabase Auth
- **Слой API**: Пограничные функции Supabase (Deno) для серверных функций
- **Хранилище**: Supabase Storage для статических ресурсов
- **Реальное время**: Supabase Realtime для живых обновлений
- **Прокси-сервисы**: Пограничные функции для доступа к внешним API (Jamendo)
- **Развернутые пограничные функции**: 11 активных функций, включая telegram-auth, tracks, playbacks, health, jamendo-proxy, hello, make-server-82f19583, telegram-auth-test, test, test-db-schema, telegram-auth-test-hash

### Архитектура потока данных
1. **Аутентификация пользователя**:
   - Telegram WebApp предоставляет initData с данными пользователя и хэшем
   - Пограничная функция проверяет хэш с использованием алгоритма HMAC-SHA256
   - Запись пользователя создается/обновляется в базе данных
   - Пользователь Supabase Auth создается с фиктивной почтой
   - Токены сессии возвращаются клиенту

2. **Обнаружение музыки**:
   - Клиент запрашивает поиск/рекомендации через утилиту Jamendo API
   - Запросы проксируются через пограничную функцию Supabase для обхода CORS
   - Jamendo возвращает метаданные треков и URL потоковой передачи
   - Клиент отображает результаты и позволяет воспроизведение

3. **Воспроизведение аудио**:
   - Трек загружается в WebAudioEngine
   - Элемент HTML5 Audio используется для потоковой передачи (поддержка preservesPitch)
   - Tone.js PitchShift для независимого управления темпом/питчем
   - 7-полосный эквалайзер, реверберация, lo-fi эффекты применяются через Web Audio API
   - История воспроизведения записывается в базу данных

4. **Взаимодействие пользователя**:
   - Лайки, плейлисты, комментарии хранятся в базе данных
   - Социальные функции (подписки, достижения) отслеживаются
   - Маркетплейс NFT для музыкальных активов
   - Участие в конкурсах и голосование

5. **Сохранение данных**:
   - Все пользовательские данные хранятся в таблицах PostgreSQL
   - Поля JSONB для гибкого хранения метаданных
   - Row Level Security для изоляции данных
   - Автоматическое обновление временных меток

## Компоненты фронтенда

### Основные компоненты приложения

#### Компонент MusicApp
- **Расположение**: `src/components/MusicApp.tsx`
- **Связано с**: TelegramAuthProvider, все компоненты страниц, система маршрутизации
- **Использование**: Основной компонент приложения, обрабатывающий маршрутизацию и управление состоянием для всех страниц
- **Статус реализации**: ✅ Завершено
- **Этап**: Готово к производству
- **Ключевые функции**:
  - Система навигации по вкладкам
  - Интеграция аутентификации пользователя с Telegram
  - Управление воспроизведением треков
  - Поток приветствия
  - Поддержка темного режима
  - Комплексная маршрутизация страниц для всех функций приложения
- **Детальный анализ**: 
  - Компонент управляет глобальным состоянием, включая активную вкладку, текущую страницу и данные навигации
  - Интегрируется с TelegramAuthProvider для аутентификации пользователя
  - Обрабатывает конвертацию треков между разными форматами (Jamendo, UniversalTrack)
  - Поддерживает сложные потоки навигации с передачей данных между страницами
  - Реализует адаптивный дизайн с подходом mobile-first
  - Включает комплексную обработку ошибок для загрузки треков и воспроизведения

#### Компонент TelegramAuthProvider
- **Расположение**: `src/components/TelegramAuthProvider.tsx`
- **Связано с**: Telegram WebApp SDK, система аутентификации Supabase
- **Использование**: Обрабатывает аутентификацию Telegram WebApp и контекст пользователя
- **Статус реализации**: ✅ Завершено
- **Этап**: Готово к производству
- **Ключевые функции**:
  - Управление состоянием аутентификации пользователя
  - Интеграция Telegram WebApp SDK
  - Извлечение данных пользователя и предоставление контекста
  - Управление темой (темный/светлый режим)
  - Интеграция тактильной обратной связи
- **Детальный анализ**:
  - Реализует правильную инициализацию Telegram WebApp с вызовами ready() и expand()
  - Обрабатывает как среду Telegram WebApp, так и резервную аутентификацию Supabase
  - Обеспечивает синхронизацию темы со схемой цвета Telegram WebApp
  - Реализует тактильную обратную связь для улучшения пользовательского опыта
  - Включает правильную обработку ошибок и состояния загрузки
  - Управляет сохранением сессии пользователя с помощью localStorage

#### Компонент MusicPlayer
- **Расположение**: `src/components/MusicPlayer.tsx`
- **Связано с**: хук useAudioPlayer, компоненты аудиодвижка
- **Использование**: полнофункциональный аудиоплеер с эффектами и визуализацией
- **Статус реализации**: ✅ Завершено
- **Этап**: Готово к производству
- **Ключевые функции**:
  - Элементы управления воспроизведением (воспроизведение, пауза, пропуск, перемотка)
  - Регулировка громкости с функцией отключения звука
  - Эквалайзер с настраиваемыми полосами
  - Регулировка скорости воспроизведения
  - Режим микса с эффектами lo-fi
  - Аудиовизуализация
  - Управление очередью
  - Отображение информации о треке
- **Детальный анализ**: 
  - Интегрируется с хуком useAudioPlayer для основной аудиофункциональности
  - Реализует комплексную обработку ошибок для проблем с воспроизведением аудио
  - Поддерживает как источники Jamendo, так и другие аудиоисточники
  - Включает визуальную обратную связь с анимированным отображением формы волны
  - Предоставляет подробную информацию о треке из API Jamendo
  - Реализует адаптивный дизайн для мобильных устройств
  - Обрабатывает ограничения политики автовоспроизведения с запросами пользовательского взаимодействия

### Компоненты страниц

#### Компонент HomePage
- **Расположение**: `src/components/HomePage.tsx`
- **Связано с**: Утилиты API Jamendo, контекст пользователя Telegram
- **Использование**: Главная целевая страница с избранным контентом и рекомендациями
- **Статус реализации**: ✅ Завершено
- **Этап**: Готово к производству
- **Ключевые функции**:
  - Отображение популярных треков
  - Рекомендации по жанрам
  - Недавно воспроизведенные треки
  - Интеграция профиля пользователя
  - Избранные исполнители и плейлисты
- **Детальный анализ**:
  - Получает рекомендации из API Jamendo через вспомогательные функции
  - Реализует адаптивную сетку для отображения треков
  - Интегрируется с контекстом пользователя Telegram для персонализированного контента
  - Поддерживает обновления активности пользователя в реальном времени
  - Включает правильные состояния загрузки и ошибок
  - Реализует навигацию свайпом для мобильных пользователей

#### Компонент SearchPage
- **Расположение**: `src/components/SearchPage.tsx`
- **Связано с**: Утилиты API Jamendo, функции поиска
- **Использование**: Функциональность поиска музыки с фильтрами и отображением результатов
- **Статус реализации**: ✅ Завершено
- **Этап**: Готово к производству
- **Ключевые функции**:
  - Многокритериальный поиск (трек, исполнитель, альбом, жанр)
  - История поиска
  - Фильтрация по тегам и атрибутам
  - Интеграция с API Jamendo
  - Предложения поиска в реальном времени
- **Детальный анализ**:
  - Реализует отложенный поиск для уменьшения количества вызовов API
  - Поддерживает несколько типов поиска (текст, жанр, исполнитель)
  - Обеспечивает сохранение истории поиска
  - Интегрируется с API Jamendo для комплексных результатов поиска
  - Реализует правильную обработку ошибок для сбоев поиска
  - Поддерживает навигацию с клавиатуры для улучшенной доступности

#### Компонент LibraryPageReal
- **Расположение**: `src/components/LibraryPageReal.tsx`
- **Связано с**: База данных Supabase, функции управления плейлистами
- **Использование**: Личная музыкальная библиотека пользователя с плейлистами и избранным
- **Статус реализации**: ✅ Завершено
- **Этап**: Готово к производству
- **Ключевые функции**:
  - Управление избранными треками
  - Создание и редактирование плейлистов
  - История воспроизведения
  - Статистика библиотеки
  - Отслеживание активности пользователя
- **Детальный анализ**:
  - Интегрируется с Supabase для сохранения данных
  - Реализует обновления библиотеки в реальном времени
  - Поддерживает управление плейлистами с операциями CRUD
  - Предоставляет подробную статистику библиотеки
  - Реализует правильную синхронизацию данных с удаленной базой данных
  - Включает комплексную обработку ошибок для операций с данными

#### Компонент UserProfile
- **Расположение**: `src/components/UserProfile.tsx`
- **Связано с**: Данные пользователя Telegram, профили пользователей Supabase
- **Использование**: Управление профилем пользователя и настройки
- **Статус реализации**: ✅ Завершено
- **Этап**: Готово к производству
- **Ключевые функции**:
  - Отображение информации профиля
  - Настройки аккаунта
  - Элементы управления конфиденциальностью
  - Интеграция с Telegram
  - Статистика пользователя и достижения
- **Детальный анализ**:
  - Интегрируется с данными пользователя Telegram для информации профиля
  - Реализует управление настройками с сохранением
  - Предоставляет обзор статистики пользователя и активности
  - Поддерживает элементы управления конфиденциальностью для пользовательских данных
  - Реализует адаптивный дизайн для отображения профиля
  - Включает правильную обработку ошибок для обновлений профиля

## Компоненты бэкенда

### Схема базы данных

Приложение TuneTON использует комплексную схему базы данных PostgreSQL с 34 таблицами в схеме public. Все таблицы имеют включенный Row Level Security для защиты данных.

#### Таблица пользователей
- **Расположение**: `supabase/migrations/20251017000001_create_users_table.sql`
- **Связано с**: Все таблицы, связанные с пользователем, система аутентификации
- **Использование**: Хранит информацию пользователя Telegram
- **Статус реализации**: ✅ Завершено
- **Этап**: Готово к производству
- **Структура**:
  - `id`: UUID PRIMARY KEY DEFAULT gen_random_uuid()
  - `telegram_id`: BIGINT UNIQUE NOT NULL
  - `username`: TEXT
  - `first_name`: TEXT
  - `last_name`: TEXT
  - `photo_url`: TEXT
  - `is_premium`: BOOLEAN DEFAULT false
  - `created_at`: TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  - `updated_at`: TIMESTAMP WITH TIME ZONE DEFAULT NOW()

#### Таблица треков
- **Расположение**: `supabase/migrations/20251016193000_create_tracks_and_playbacks_tables.sql`
- **Связано с**: Воспроизведения, треки плейлиста, ремиксы, библиотека пользователя
- **Использование**: Хранит метаданные треков из Jamendo
- **Статус реализации**: ✅ Завершено
- **Этап**: Готово к производству
- **Структура**:
  - `id`: BIGINT PRIMARY KEY
  - `title`: TEXT NOT NULL
  - `artist`: TEXT
  - `album_id`: BIGINT
  - `album_name`: TEXT
  - `duration`: INTEGER DEFAULT 0
  - `file_url`: TEXT
  - `cover_url`: TEXT
  - `genre`: TEXT
  - `bpm`: INTEGER
  - `key_signature`: TEXT
  - `energy_level`: INTEGER
  - `audio_features`: JSONB
  - `license_info`: JSONB
  - `play_count`: INTEGER DEFAULT 0
  - `like_count`: INTEGER DEFAULT 0
  - `remix_count`: INTEGER DEFAULT 0
  - `slug`: TEXT
  - `created_at`: TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  - `updated_at`: TIMESTAMP WITH TIME ZONE DEFAULT NOW()

#### Таблица воспроизведений
- **Расположение**: `supabase/migrations/20251016193000_create_tracks_and_playbacks_tables.sql`
- **Связано с**: Таблица треков
- **Использование**: Отслеживает количество воспроизведений для аналитики
- **Статус реализации**: ✅ Завершено
- **Этап**: Готово к производству
- **Структура**:
  - `id`: UUID PRIMARY KEY DEFAULT gen_random_uuid()
  - `track_id`: UUID REFERENCES tracks(id) ON DELETE CASCADE
  - `count`: INTEGER DEFAULT 0
  - `created_at`: TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  - `updated_at`: TIMESTAMP WITH TIME ZONE DEFAULT NOW()

#### Таблица истории воспроизведения
- **Расположение**: `supabase/migrations/20251118000001_create_playback_history_table.sql`
- **Связано с**: Таблица пользователей (через telegram_id)
- **Использование**: Отслеживает историю прослушивания пользователя и поведение
- **Статус реализации**: ✅ Завершено
- **Этап**: Готово к производству
- **Структура**:
  - `id`: UUID PRIMARY KEY DEFAULT gen_random_uuid()
  - `user_id`: BIGINT REFERENCES public.users(telegram_id) ON DELETE CASCADE
  - `track_id`: TEXT NOT NULL
  - `track_data`: JSONB
  - `played_at`: TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  - `duration_played`: INTEGER DEFAULT 0
  - `is_completed`: BOOLEAN DEFAULT false

#### Таблица плейлистов
- **Расположение**: `supabase/migrations/20251026000000_create_user_data_elements_tables.sql`
- **Связано с**: Пользователи, треки плейлиста
- **Использование**: Плейлисты, созданные пользователем
- **Статус реализации**: ✅ Завершено
- **Этап**: Готово к производству
- **Структура**:
  - `id`: UUID PRIMARY KEY DEFAULT gen_random_uuid()
  - `user_id`: UUID REFERENCES users(id) ON DELETE CASCADE
  - `name`: TEXT NOT NULL
  - `description`: TEXT
  - `cover`: TEXT
  - `is_private`: BOOLEAN DEFAULT false
  - `created_at`: TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  - `updated_at`: TIMESTAMP WITH TIME ZONE DEFAULT NOW()

#### Таблица треков плейлиста
- **Расположение**: `supabase/migrations/20251118000000_create_playlist_tracks_table.sql`
- **Связано с**: Плейлисты, треки, ремиксы
- **Использование**: Связывает треки с плейлистами
- **Статус реализации**: ✅ Завершено
- **Этап**: Готово к производству
- **Структура**:
  - `id`: UUID PRIMARY KEY DEFAULT gen_random_uuid()
  - `playlist_id`: UUID REFERENCES playlists(id) ON DELETE CASCADE
  - `track_id`: TEXT NOT NULL
  - `track_data`: JSONB
  - `position`: INTEGER
  - `added_at`: TIMESTAMP WITH TIME ZONE DEFAULT NOW()

#### Таблица избранных треков
- **Расположение**: `supabase/migrations/20251026000000_create_user_data_elements_tables.sql`
- **Связано с**: Пользователи, треки
- **Использование**: Избранные треки пользователя
- **Статус реализации**: ✅ Завершено
- **Этап**: Готово к производству
- **Структура**:
  - `id`: UUID PRIMARY KEY DEFAULT gen_random_uuid()
  - `user_id`: UUID REFERENCES users(id) ON DELETE CASCADE
  - `track_id`: TEXT NOT NULL
  - `track_data`: JSONB
  - `liked_at`: TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  - UNIQUE(user_id, track_id)

#### Таблица комментариев
- **Расположение**: `supabase/migrations/20251026000000_create_user_data_elements_tables.sql`
- **Связано с**: Пользователи, треки, плейлисты, NFT
- **Использование**: Комментарии к различным типам контента
- **Статус реализации**: ✅ Завершено
- **Этап**: Готово к производству
- **Структура**:
  - `id`: UUID PRIMARY KEY DEFAULT gen_random_uuid()
  - `user_id`: UUID REFERENCES users(id) ON DELETE CASCADE
  - `entity_type`: TEXT NOT NULL ('track', 'playlist', 'nft', и т.д.)
  - `entity_id`: TEXT NOT NULL
  - `content`: TEXT NOT NULL
  - `parent_comment_id`: UUID REFERENCES comments(id) ON DELETE CASCADE
  - `created_at`: TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  - `updated_at`: TIMESTAMP WITH TIME ZONE DEFAULT NOW()

#### Таблица подписок пользователей
- **Расположение**: `supabase/migrations/20251026000000_create_user_data_elements_tables.sql`
- **Связано с**: Пользователи
- **Использование**: Отношения подписки пользователей
- **Статус реализации**: ✅ Завершено
- **Этап**: Готово к производству
- **Структура**:
  - `id`: UUID PRIMARY KEY DEFAULT gen_random_uuid()
  - `follower_id`: UUID REFERENCES users(id) ON DELETE CASCADE
  - `following_id`: UUID REFERENCES users(id) ON DELETE CASCADE
  - `created_at`: TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  - UNIQUE(follower_id, following_id)
  - CONSTRAINT no_self_follow CHECK (follower_id <> following_id)

#### Таблица активности пользователей
- **Расположение**: `supabase/migrations/20251108000000_create_user_activities_table.sql`
- **Связано с**: Пользователи
- **Использование**: Отслеживает активность и вовлеченность пользователей
- **Статус реализации**: ✅ Завершено
- **Этап**: Готово к производству
- **Структура**:
  - `id`: UUID PRIMARY KEY DEFAULT gen_random_uuid()
  - `user_id`: UUID REFERENCES users(id) ON DELETE CASCADE
  - `activity_type`: TEXT NOT NULL
  - `target_type`: TEXT
  - `target_id`: UUID
  - `session_id`: TEXT
  - `device_info`: JSONB
  - `location_data`: JSONB
  - `activity_metadata`: JSONB
  - `created_at`: TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  - `timestamp`: TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL

#### Таблица ремиксов
- **Расположение**: `supabase/migrations/20251026000000_create_user_data_elements_tables.sql`
- **Связано с**: Пользователи, треки, NFT
- **Использование**: Ремиксы, созданные пользователем
- **Статус реализации**: ✅ Завершено
- **Этап**: Готово к производству
- **Структура**:
  - `id`: UUID PRIMARY KEY DEFAULT gen_random_uuid()
  - `user_id`: UUID REFERENCES users(id) ON DELETE CASCADE
  - `original_track_id`: UUID REFERENCES tracks(id)
  - `title`: TEXT NOT NULL
  - `description`: TEXT
  - `cover_url`: TEXT
  - `duration`: INTEGER
  - `effects_config`: JSONB NOT NULL
  - `processed_file_url`: TEXT
  - `processing_metadata`: JSONB
  - `play_count`: INTEGER DEFAULT 0
  - `like_count`: INTEGER DEFAULT 0
  - `share_count`: INTEGER DEFAULT 0
  - `comment_count`: INTEGER DEFAULT 0
  - `stars_earned`: INTEGER DEFAULT 0
  - `is_public`: BOOLEAN DEFAULT true
  - `is_featured`: BOOLEAN DEFAULT false
  - `contest_entry_id`: UUID
  - `created_at`: TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  - `updated_at`: TIMESTAMP WITH TIME ZONE DEFAULT NOW()

#### Таблица NFT
- **Расположение**: `supabase/migrations/20251117000000_create_contest_and_nft_tables.sql`
- **Связано с**: Пользователи, коллекции NFT, ремиксы
- **Использование**: Музыкальные NFT
- **Статус реализации**: ✅ Завершено
- **Этап**: Готово к производству
- **Структура**:
  - `id`: UUID PRIMARY KEY DEFAULT gen_random_uuid()
  - `collection_id`: UUID REFERENCES nft_collections(id)
  - `token_id`: TEXT NOT NULL UNIQUE
  - `ton_contract_address`: TEXT
  - `name`: TEXT NOT NULL
  - `description`: TEXT
  - `image_url`: TEXT
  - `audio_url`: TEXT
  - `metadata_url`: TEXT
  - `preset_id`: UUID REFERENCES audio_presets(id)
  - `remix_id`: UUID REFERENCES remixes(id)
  - `current_owner_id`: UUID REFERENCES users(id)
  - `creator_id`: UUID REFERENCES users(id)
  - `mint_price_ton`: NUMERIC(15,8)
  - `last_sale_price_ton`: NUMERIC(15,8)
  - `current_listing_price_ton`: NUMERIC(15,8)
  - `is_listed`: BOOLEAN DEFAULT false
  - `rarity_rank`: INTEGER
  - `traits`: JSONB DEFAULT '{}'::JSONB
  - `minted_at`: TIMESTAMP WITH TIME ZONE
  - `created_at`: TIMESTAMP WITH TIME ZONE DEFAULT NOW()

#### Таблица конкурсов
- **Расположение**: `supabase/migrations/20251117000000_create_contest_and_nft_tables.sql`
- **Связано с**: Пользователи, записи конкурсов
- **Использование**: Музыкальные конкурсы
- **Статус реализации**: ✅ Завершено
- **Этап**: Готово к производству
- **Структура**:
  - `id`: UUID PRIMARY KEY DEFAULT gen_random_uuid()
  - `title`: TEXT NOT NULL
  - `description`: TEXT
  - `cover_url`: TEXT
  - `contest_type`: TEXT NOT NULL
  - `rules`: JSONB
  - `prize_pool_ton`: NUMERIC(15,8) DEFAULT 0
  - `prize_pool_stars`: INTEGER DEFAULT 0
  - `prize_distribution`: JSONB
  - `start_date`: TIMESTAMP WITH TIME ZONE
  - `end_date`: TIMESTAMP WITH TIME ZONE
  - `voting_end_date`: TIMESTAMP WITH TIME ZONE
  - `max_participants`: INTEGER
  - `participant_count`: INTEGER DEFAULT 0
  - `entry_count`: INTEGER DEFAULT 0
  - `status`: TEXT DEFAULT 'upcoming'
  - `is_featured`: BOOLEAN DEFAULT false
  - `created_by_user_id`: UUID REFERENCES users(id)
  - `created_at`: TIMESTAMP WITH TIME ZONE DEFAULT NOW()

#### Таблица записей конкурсов
- **Расположение**: `supabase/migrations/20251117000000_create_contest_and_nft_tables.sql`
- **Связано с**: Конкурсы, пользователи, ремиксы
- **Использование**: Участия в конкурсах
- **Статус реализации**: ✅ Завершено
- **Этап**: Готово к производству
- **Структура**:
  - `id`: UUID PRIMARY KEY DEFAULT gen_random_uuid()
  - `contest_id`: UUID REFERENCES contests(id) ON DELETE CASCADE
  - `user_id`: UUID REFERENCES users(id) ON DELETE CASCADE
  - `remix_id`: UUID REFERENCES remixes(id) ON DELETE CASCADE
  - `vote_count`: INTEGER DEFAULT 0
  - `score`: NUMERIC(5,2) DEFAULT 0.0
  - `rank_position`: INTEGER
  - `entry_metadata`: JSONB DEFAULT '{}'::JSONB
  - `submitted_at`: TIMESTAMP WITH TIME ZONE DEFAULT NOW()

#### Таблица голосов конкурсов
- **Расположение**: `supabase/migrations/20251117000000_create_contest_and_nft_tables.sql`
- **Связано с**: Конкурсы, записи конкурсов, пользователи
- **Использование**: Голосование в конкурсах
- **Статус реализации**: ✅ Завершено
- **Этап**: Готово к производству
- **Структура**:
  - `id`: UUID PRIMARY KEY DEFAULT gen_random_uuid()
  - `contest_id`: UUID REFERENCES contests(id) ON DELETE CASCADE
  - `entry_id`: UUID REFERENCES contest_entries(id) ON DELETE CASCADE
  - `voter_id`: UUID REFERENCES users(id) ON DELETE CASCADE
  - `vote_weight`: INTEGER DEFAULT 1
  - `created_at`: TIMESTAMP WITH TIME ZONE DEFAULT NOW()

#### Таблица достижений
- **Расположение**: `supabase/migrations/20251026000000_create_user_data_elements_tables.sql`
- **Связано с**: Пользователи
- **Использование**: Достижения пользователей
- **Статус реализации**: ✅ Завершено
- **Этап**: Готово к производству
- **Структура**:
  - `id`: UUID PRIMARY KEY DEFAULT gen_random_uuid()
  - `user_id`: UUID REFERENCES users(id) ON DELETE CASCADE
  - `name`: TEXT NOT NULL
  - `description`: TEXT
  - `icon_url`: TEXT
  - `earned_at`: TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  - `created_at`: TIMESTAMP WITH TIME ZONE DEFAULT NOW()

#### Таблица кошельков пользователей
- **Расположение**: Схема базы данных
- **Связано с**: Пользователи, транзакции TON
- **Использование**: Адреса кошельков пользователей и балансы
- **Статус реализации**: ✅ Завершено
- **Этап**: Готово к производству
- **Структура**:
  - `id`: UUID PRIMARY KEY DEFAULT gen_random_uuid()
  - `user_id`: UUID REFERENCES users(id) ON DELETE CASCADE
  - `wallet_address`: TEXT NOT NULL
  - `wallet_type`: TEXT
  - `is_primary`: BOOLEAN DEFAULT false
  - `balance_ton`: NUMERIC(15,8) DEFAULT 0
  - `last_synced_at`: TIMESTAMP WITH TIME ZONE
  - `created_at`: TIMESTAMP WITH TIME ZONE DEFAULT NOW()

#### Таблица транзакций TON
- **Расположение**: Схема базы данных
- **Связано с**: Пользователи, транзакции NFT
- **Использование**: Транзакции блокчейна TON
- **Статус реализации**: ✅ Завершено
- **Этап**: Готово к производству
- **Структура**:
  - `id`: UUID PRIMARY KEY DEFAULT gen_random_uuid()
  - `user_id`: UUID REFERENCES users(id)
  - `transaction_hash`: TEXT NOT NULL UNIQUE
  - `transaction_type`: TEXT NOT NULL
  - `amount_ton`: NUMERIC(15,8) NOT NULL
  - `from_address`: TEXT
  - `to_address`: TEXT
  - `gas_used`: BIGINT
  - `gas_fee_ton`: NUMERIC(15,8)
  - `related_type`: TEXT
  - `related_id`: UUID
  - `block_number`: BIGINT
  - `block_timestamp`: TIMESTAMP WITH TIME ZONE
  - `logical_time`: BIGINT
  - `status`: TEXT DEFAULT 'pending'
  - `confirmation_count`: INTEGER DEFAULT 0
  - `created_at`: TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  - `confirmed_at`: TIMESTAMP WITH TIME ZONE

#### Таблица транзакций звезд
- **Расположение**: Схема базы данных
- **Связано с**: Пользователи
- **Использование**: Транзакции звезд (валюта Telegram)
- **Статус реализации**: ✅ Завершено
- **Этап**: Готово к производству
- **Структура**:
  - `id`: UUID PRIMARY KEY DEFAULT gen_random_uuid()
  - `user_id`: UUID REFERENCES users(id) ON DELETE CASCADE
  - `transaction_type`: TEXT NOT NULL
  - `amount`: INTEGER NOT NULL
  - `source_type`: TEXT
  - `source_id`: UUID
  - `telegram_payment_id`: TEXT
  - `telegram_invoice_payload`: TEXT
  - `description`: TEXT
  - `metadata`: JSONB DEFAULT '{}'::JSONB
  - `status`: TEXT DEFAULT 'completed'
  - `created_at`: TIMESTAMP WITH TIME ZONE DEFAULT NOW()

#### Таблица избранных исполнителей пользователей
- **Расположение**: Схема базы данных
- **Связано с**: Пользователи
- **Использование**: Избранные исполнители пользователя
- **Статус реализации**: ✅ Завершено
- **Этап**: Готово к производству
- **Структура**:
  - `id`: UUID PRIMARY KEY DEFAULT gen_random_uuid()
  - `user_id`: UUID REFERENCES users(id) ON DELETE CASCADE
  - `artist_id`: TEXT NOT NULL
  - `artist_name`: TEXT NOT NULL
  - `artist_image`: TEXT
  - `added_at`: TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  - UNIQUE(user_id, artist_id)

#### Таблица недавних треков пользователей
- **Расположение**: Схема базы данных
- **Связано с**: Пользователи аутентификации
- **Использование**: Недавно воспроизведенные треки пользователя
- **Статус реализации**: ✅ Завершено
- **Этап**: Готово к производству
- **Структура**:
  - `id`: UUID PRIMARY KEY DEFAULT gen_random_uuid()
  - `user_id`: UUID REFERENCES auth.users(id) ON DELETE CASCADE
  - `track_id`: TEXT NOT NULL
  - `track_name`: TEXT NOT NULL
  - `artist_name`: TEXT NOT NULL
  - `album_name`: TEXT
  - `duration`: INTEGER DEFAULT 0 NOT NULL
  - `image_url`: TEXT
  - `audio_url`: TEXT
  - `jamendo_id`: TEXT
  - `played_at`: TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  - `play_count`: INTEGER DEFAULT 1
  - `last_position`: INTEGER DEFAULT 0
  - `completed`: BOOLEAN DEFAULT false
  - `created_at`: TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  - `updated_at`: TIMESTAMP WITH TIME ZONE DEFAULT NOW()

#### Таблица сессий пользователей
- **Расположение**: Схема базы данных
- **Связано с**: Пользователи
- **Использование**: Управление сессиями пользователей
- **Статус реализации**: ✅ Завершено
- **Этап**: Готово к производству
- **Структура**:
  - `id`: UUID PRIMARY KEY DEFAULT gen_random_uuid()
  - `user_id`: UUID REFERENCES users(id) ON DELETE CASCADE
  - `session_token`: TEXT NOT NULL UNIQUE
  - `telegram_auth_data`: JSONB
  - `expires_at`: TIMESTAMP WITH TIME ZONE
  - `created_at`: TIMESTAMP WITH TIME ZONE DEFAULT NOW()

#### Таблица метрик платформы
- **Расположение**: Схема базы данных
- **Связано с**: Системная аналитика
- **Использование**: Метрики и аналитика платформы в целом
- **Статус реализации**: ✅ Завершено
- **Этап**: Готово к производству
- **Структура**:
  - `id`: UUID PRIMARY KEY DEFAULT gen_random_uuid()
  - `metric_date`: DATE NOT NULL
  - `metric_type`: TEXT NOT NULL
  - `active_users`: INTEGER DEFAULT 0
  - `new_users`: INTEGER DEFAULT 0
  - `returning_users`: INTEGER DEFAULT 0
  - `tracks_played`: INTEGER DEFAULT 0
  - `remixes_created`: INTEGER DEFAULT 0
  - `presets_shared`: INTEGER DEFAULT 0
  - `likes_given`: INTEGER DEFAULT 0
  - `comments_posted`: INTEGER DEFAULT 0
  - `shares_made`: INTEGER DEFAULT 0
  - `stars_earned`: INTEGER DEFAULT 0
  - `stars_spent`: INTEGER DEFAULT 0
  - `ton_volume`: NUMERIC(15,8) DEFAULT 0
  - `nft_sales`: INTEGER DEFAULT 0
  - `created_at`: TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  - UNIQUE(metric_date, metric_type)

#### Таблица сообщений сообщества
- **Расположение**: Схема базы данных
- **Связано с**: Пользователи
- **Использование**: Социальные сообщения сообщества
- **Статус реализации**: ✅ Завершено
- **Этап**: Готово к производству
- **Структура**:
  - `id`: UUID PRIMARY KEY DEFAULT gen_random_uuid()
  - `user_id`: UUID REFERENCES users(id) ON DELETE CASCADE
  - `post_type`: TEXT NOT NULL
  - `content`: TEXT
  - `media_urls`: TEXT[]
  - `linked_content`: JSONB
  - `like_count`: INTEGER DEFAULT 0
  - `comment_count`: INTEGER DEFAULT 0
  - `share_count`: INTEGER DEFAULT 0
  - `is_public`: BOOLEAN DEFAULT true
  - `is_pinned`: BOOLEAN DEFAULT false
  - `created_at`: TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  - `updated_at`: TIMESTAMP WITH TIME ZONE DEFAULT NOW()

#### Таблица отчетов о контенте
- **Расположение**: Схема базы данных
- **Связано с**: Пользователи
- **Использование**: Отчеты о модерации контента
- **Статус реализации**: ✅ Завершено
- **Этап**: Готово к производству
- **Структура**:
  - `id`: UUID PRIMARY KEY DEFAULT gen_random_uuid()
  - `reporter_user_id`: UUID REFERENCES users(id)
  - `target_type`: TEXT NOT NULL
  - `target_id`: UUID NOT NULL
  - `report_type`: TEXT NOT NULL
  - `description`: TEXT
  - `status`: TEXT DEFAULT 'pending'
  - `moderator_user_id`: UUID REFERENCES users(id)
  - `moderator_notes`: TEXT
  - `resolved_at`: TIMESTAMP WITH TIME ZONE
  - `created_at`: TIMESTAMP WITH TIME ZONE DEFAULT NOW()

#### Таблица социальных взаимодействий
- **Расположение**: Схема базы данных
- **Связано с**: Пользователи
- **Использование**: Отслеживание социальных взаимодействий
- **Статус реализации**: ✅ Завершено
- **Этап**: Готово к производству
- **Структура**:
  - `id`: UUID PRIMARY KEY DEFAULT gen_random_uuid()
  - `user_id`: UUID REFERENCES users(id) ON DELETE CASCADE
  - `target_type`: TEXT NOT NULL
  - `target_id`: UUID NOT NULL
  - `interaction_type`: TEXT NOT NULL
  - `metadata`: JSONB DEFAULT '{}'::JSONB
  - `created_at`: TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  - UNIQUE(user_id, target_type, target_id, interaction_type)

#### Таблица аудио-пресетов
- **Расположение**: Схема базы данных
- **Связано с**: Пользователи, NFT
- **Использование**: Пресеты аудиоэффектов
- **Статус реализации**: ✅ Завершено
- **Этап**: Готово к производству
- **Структура**:
  - `id`: UUID PRIMARY KEY DEFAULT gen_random_uuid()
  - `user_id`: UUID REFERENCES users(id)
  - `name`: TEXT NOT NULL
  - `description`: TEXT
  - `effects_config`: JSONB NOT NULL
  - `is_public`: BOOLEAN DEFAULT true
  - `use_count`: INTEGER DEFAULT 0
  - `like_count`: INTEGER DEFAULT 0
  - `created_at`: TIMESTAMP WITH TIME ZONE DEFAULT NOW()

#### Таблица коллекций NFT
- **Расположение**: Схема базы данных
- **Связано с**: Пользователи, NFT
- **Использование**: Коллекции NFT
- **Статус реализации**: ✅ Завершено
- **Этап**: Готово к производству
- **Структура**:
  - `id`: UUID PRIMARY KEY DEFAULT gen_random_uuid()
  - `creator_id`: UUID REFERENCES users(id)
  - `name`: TEXT NOT NULL
  - `description`: TEXT
  - `symbol`: TEXT
  - `cover_url`: TEXT
  - `total_supply`: INTEGER
  - `minted_count`: INTEGER DEFAULT 0
  - `floor_price_ton`: NUMERIC(15,8)
  - `total_volume_ton`: NUMERIC(15,8) DEFAULT 0
  - `created_at`: TIMESTAMP WITH TIME ZONE DEFAULT NOW()

#### Таблица транзакций NFT
- **Расположение**: Схема базы данных
- **Связано с**: Пользователи, NFT
- **Использование**: Транзакции NFT
- **Статус реализации**: ✅ Завершено
- **Этап**: Готово к производству
- **Структура**:
  - `id`: UUID PRIMARY KEY DEFAULT gen_random_uuid()
  - `nft_id`: UUID REFERENCES nfts(id)
  - `transaction_type`: TEXT NOT NULL
  - `from_user_id`: UUID REFERENCES users(id)
  - `to_user_id`: UUID REFERENCES users(id)
  - `price_ton`: NUMERIC(15,8)
  - `ton_transaction_hash`: TEXT
  - `gas_fee_ton`: NUMERIC(15,8)
  - `platform_fee_ton`: NUMERIC(15,8)
  - `status`: TEXT DEFAULT 'pending'
  - `block_number`: BIGINT
  - `created_at`: TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  - `confirmed_at`: TIMESTAMP WITH TIME ZONE

#### Таблица библиотеки пользователей
- **Расположение**: Схема базы данных
- **Связано с**: Пользователи
- **Использование**: Элементы библиотеки пользователей
- **Статус реализации**: ✅ Завершено
- **Этап**: Готово к производству
- **Структура**:
  - `id`: UUID PRIMARY KEY DEFAULT gen_random_uuid()
  - `user_id`: UUID REFERENCES users(id) ON DELETE CASCADE
  - `item_type`: TEXT NOT NULL
  - `item_id`: UUID NOT NULL
  - `action_type`: TEXT NOT NULL
  - `metadata`: JSONB DEFAULT '{}'::JSONB
  - `created_at`: TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  - UNIQUE(user_id, item_type, item_id, action_type)

#### Таблица исполнителей
- **Расположение**: Схема базы данных
- **Связано с**: Треки, альбомы
- **Использование**: Информация об исполнителях
- **Статус реализации**: ✅ Завершено
- **Этап**: Готово к производству
- **Структура**:
  - `id`: BIGINT PRIMARY KEY DEFAULT nextval('artists_id_seq')
  - `name`: TEXT NOT NULL
  - `slug`: TEXT NOT NULL UNIQUE
  - `avatar_url`: TEXT
  - `is_verified`: BOOLEAN DEFAULT false
  - `monthly_listeners`: INTEGER DEFAULT 0
  - `total_tracks`: INTEGER DEFAULT 0
  - `bio`: TEXT
  - `social_links`: JSONB DEFAULT '{}'::JSONB
  - `created_at`: TIMESTAMP WITH TIME ZONE DEFAULT NOW()

#### Таблица альбомов
- **Расположение**: Схема базы данных
- **Связано с**: Исполнители, треки
- **Использование**: Информация об альбомах
- **Статус реализации**: ✅ Завершено
- **Этап**: Готово к производству
- **Структура**:
  - `id`: BIGINT PRIMARY KEY DEFAULT nextval('albums_id_seq')
  - `artist_id`: BIGINT REFERENCES artists(id)
  - `title`: TEXT NOT NULL
  - `slug`: TEXT NOT NULL
  - `cover_url`: TEXT
  - `release_date`: DATE
  - `genre`: TEXT
  - `total_tracks`: INTEGER DEFAULT 0
  - `created_at`: TIMESTAMP WITH TIME ZONE DEFAULT NOW()

#### Таблица конфигурации приложения
- **Расположение**: Схема базы данных
- **Связано с**: Системная конфигурация
- **Использование**: Конфигурация приложения
- **Статус реализации**: ✅ Завершено
- **Этап**: Готово к производству
- **Структура**:
  - `id`: BIGINT PRIMARY KEY DEFAULT nextval('app_config_id_seq')
  - `config_key`: TEXT NOT NULL UNIQUE
  - `config_value`: JSONB NOT NULL
  - `description`: TEXT
  - `is_active`: BOOLEAN DEFAULT true
  - `updated_by_user_id`: BIGINT
  - `created_at`: TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  - `updated_at`: TIMESTAMP WITH TIME ZONE DEFAULT NOW()

#### Таблица хранилища ключ-значение
- **Расположение**: Схема базы данных
- **Связано с**: Хранилище ключ-значение системы
- **Использование**: Универсальное хранилище ключ-значение
- **Статус реализации**: ✅ Завершено
- **Этап**: Готово к производству
- **Структура**:
  - `key`: TEXT PRIMARY KEY
  - `value`: JSONB NOT NULL

#### Таблица музыкальных треков
- **Расположение**: Схема базы данных
- **Связано с**: Аудиоанализ
- **Использование**: Данные анализа музыкальных треков
- **Статус реализации**: ✅ Завершено
- **Этап**: Готово к производству
- **Структура**:
  - `id`: BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY
  - `track_name`: TEXT NOT NULL
  - `artist_name`: TEXT
  - `spotify_id`: TEXT UNIQUE
  - `embedding`: vector(384)
  - `popularity`: DOUBLE PRECISION
  - `danceability`: DOUBLE PRECISION
  - `energy`: DOUBLE PRECISION
  - `loudness`: DOUBLE PRECISION
  - `speechiness`: DOUBLE PRECISION
  - `acousticness`: DOUBLE PRECISION
  - `instrumentalness`: DOUBLE PRECISION
  - `liveness`: DOUBLE PRECISION
  - `valence`: DOUBLE PRECISION
  - `tempo`: DOUBLE PRECISION
  - `genre`: TEXT
  - `release_year`: INTEGER
  - `added_at`: TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP

## Пограничные функции

### Функция аутентификации Telegram
- **Расположение**: `supabase/functions/telegram-auth/index.ts`
- **Связано с**: Telegram WebApp, Supabase Auth, таблица пользователей
- **Использование**: Проверка данных аутентификации Telegram WebApp и управление записями пользователей
- **Статус реализации**: ✅ Завершено
- **Этап**: Готово к производству
- **Ключевые функции**:
  - Проверка данных Telegram с использованием HMAC-SHA256
  - Создание/обновление записей пользователей
  - Интеграция с Supabase Auth
  - Ограничение скорости
  - Управление сессиями
- **Детальный анализ**:
  - Реализует правильную проверку данных Telegram WebApp согласно документации
  - Поддерживает методы аутентификации WebApp и виджета входа
  - Интегрируется с Supabase Auth для управления сессиями
  - Реализует ограничение скорости для предотвращения злоупотреблений
  - Обеспечивает правильную обработку ошибок при сбоях аутентификации
  - Поддерживает синхронизацию метаданных пользователей между Telegram и Supabase

### Функция прокси Jamendo
- **Расположение**: `supabase/functions/jamendo-proxy/index.ts`
- **Связано с**: API Jamendo, клиентские приложения
- **Использование**: Проксирование запросов к API Jamendo для обхода проблем CORS
- **Статус реализации**: ✅ Завершено
- **Этап**: Готово к производству
- **Ключевые функции**:
  - Проверка параметров запроса
  - Обработка CORS
  - Передача ошибок
  - Ограничение скорости
  - Управление ID клиента
- **Детальный анализ**:
  - Реализует правильные заголовки CORS для кросс-доменных запросов
  - Обеспечивает комплексную обработку ошибок при сбоях API
  - Поддерживает различные конечные точки API Jamendo через параметризацию
  - Реализует правильное логирование запросов/ответов для отладки
  - Обрабатывает парсинг параметров JSON с проверкой
  - Включает ограничение скорости для предотвращения злоупотреблений API

### Функция проверки состояния
- **Расположение**: `supabase/functions/health/index.ts`
- **Связано с**: Системный мониторинг
- **Использование**: Проверки состояния системы
- **Статус реализации**: ✅ Завершено
- **Этап**: Готово к производству

### Функция приветствия
- **Расположение**: `supabase/functions/hello/index.ts`
- **Связано с**: Инфраструктура тестирования
- **Использование**: Простая тестовая функция
- **Статус реализации**: ✅ Завершено
- **Этап**: Готово к производству

### Функция воспроизведений
- **Расположение**: `supabase/functions/playbacks/index.ts`
- **Связано с**: Таблица воспроизведений, аналитика
- **Использование**: Отслеживание воспроизведений и аналитика
- **Статус реализации**: ✅ Завершено
- **Этап**: Готово к производству

### Функция треков
- **Расположение**: `supabase/functions/tracks/index.ts`
- **Связано с**: Таблица треков
- **Использование**: Управление треками
- **Статус реализации**: ✅ Завершено
- **Этап**: Готово к производству

### Тестовые функции
- **Расположение**: `supabase/functions/test/`, `supabase/functions/telegram-auth-test/`, и т.д.
- **Связано с**: Инфраструктура тестирования
- **Использование**: Различные тестовые функции
- **Статус реализации**: ✅ Завершено
- **Этап**: Готово к производству

## Функции API

### Функции клиента Supabase
- **Расположение**: `src/utils/tuneton-api.ts`
- **Связано с**: Сервисы бэкенда Supabase, все компоненты фронтенда
- **Использование**: Интерфейс с сервисами бэкенда Supabase
- **Статус реализации**: ✅ Завершено
- **Этап**: Готово к производству

#### Функции управления плейлистами
- `createPlaylist`: Создать новые плейлисты пользователя
- `getUserPlaylists`: Получить плейлисты пользователя
- `getPlaylist`: Получить детали конкретного плейлиста
- `getPlaylistTracks`: Получить треки в плейлисте
- `removeTrackFromPlaylist`: Удалить трек из плейлиста
- `addTrackToPlaylist`: Добавить трек в плейлист
- `deletePlaylist`: Удалить плейлист пользователя

#### Функции взаимодействия с треками
- `toggleTrackLike`: Лайк/дизлайк треков
- `getLikedTracks`: Получить избранные треки пользователя
- `getLibraryStats`: Получить статистику библиотеки

#### Функции воспроизведения
- `addPlaybackHistory`: Записать воспроизведение трека
- `getRecentPlaybackHistory`: Получить недавнюю историю воспроизведения
- `getLastPlayedTrack`: Получить последний воспроизведенный трек

#### Социальные функции
- `followUser`: Подписаться на другого пользователя
- `unfollowUser`: Отписаться от пользователя
- `getFollowing`: Получить список подписок пользователя
- `getFollowers`: Получить список подписчиков пользователя
- `isFollowing`: Проверить, подписан ли на пользователя

#### Функции активности пользователя
- `recordUserActivity`: Записать активности пользователя

### Функции API Jamendo
- **Расположение**: `src/utils/jamendo-api.ts`
- **Связано с**: Музыкальный сервис Jamendo, прокси-функция
- **Использование**: Интерфейс с музыкальным сервисом Jamendo
- **Статус реализации**: ✅ Завершено
- **Этап**: Готово к производству

#### Функции поиска
- `searchTracks`: Поиск треков по критериям
- `getTrackById`: Получить трек по ID
- `getTracksByArtist`: Получить треки исполнителя
- `getTracksByAlbum`: Получить треки альбома
- `getTracksByGenre`: Получить треки по жанру
- `getFeaturedTracks`: Получить избранные треки
- `getPopularTracks`: Получить популярные треки
- `searchArtists`: Поиск исполнителей
- `searchArtistsByName`: Поиск исполнителей по имени
- `getArtist`: Получить исполнителя по ID
- `getPopularArtists`: Получить популярных исполнителей
- `getArtistTracks`: Получить треки исполнителя
- `searchAlbums`: Поиск альбомов
- `getAlbumTracks`: Получить треки альбома

#### Функции рекомендаций
- `getRemixCandidates`: Получить треки для ремикс-вызовов
- `getLoFiTracks`: Получить треки, подходящие для lo-fi
- `getTrendingTracks`: Получить тренды для страницы обнаружения
- `textSearch`: Поиск по текстовому запросу
- `getGenreMix`: Получить треки по нескольким жанрам для разнообразия

## Вспомогательные функции

### Вспомогательные функции аудио
- **Расположение**: `src/components/player/utils.ts`
- **Связано с**: Компоненты аудиоплеера
- **Использование**: Вспомогательные функции для обработки и форматирования аудио
- **Статус реализации**: ✅ Завершено
- **Этап**: Готово к производству
- **Ключевые функции**:
  - Форматирование времени
  - Конвертация треков между форматами
  - Проверка URL
  - Аудиоанализ
  - Генерация формы волны

### Менеджер музыкальных сервисов
- **Расположение**: `src/utils/music-service-manager.ts`
- **Связано с**: Все музыкальные сервисы
- **Использование**: Универсальный менеджер музыкальных сервисов для работы с несколькими сервисами
- **Статус реализации**: ✅ Завершено
- **Этап**: Готово к производству
- **Ключевые функции**:
  - Универсальный интерфейс треков для нескольких сервисов
  - Регистрация и управление сервисами
  - Поиск по нескольким сервисам
  - Получение URL треков и потоков

### Вспомогательные функции аутентификации Telegram
- **Расположение**: `src/utils/telegramAuth.ts`
- **Связано с**: Telegram WebApp, система аутентификации
- **Использование**: Вспомогательные функции для аутентификации Telegram
- **Статус реализации**: ✅ Завершено
- **Этап**: Готово к производству
- **Ключевые функции**:
  - `verifyTelegramData`: Проверка данных Telegram WebApp
  - `loginWithTelegram`: Обработка входа через Telegram
  - `verifyTelegramWidgetData`: Проверка данных виджета входа Telegram
  - `loginWithTelegramWidget`: Обработка входа через виджет Telegram
  - `logout`: Обработка выхода пользователя
  - `getCurrentUser`: Получение текущего аутентифицированного пользователя

## Функции хуков

### Хук useAudioPlayer
- **Расположение**: `src/hooks/useAudioPlayer.ts`
- **Связано с**: Аудиодвижок, компоненты плеера
- **Использование**: Управление состоянием воспроизведения аудио и эффектами
- **Статус реализации**: ✅ Завершено
- **Этап**: Готово к производству
- **Ключевые функции**:
  - `loadTrack`: Загрузка аудиотрека для воспроизведения
  - `togglePlayPause`: Переключение состояния воспроизведение/пауза
  - `seek`: Перемотка к определенному времени в треке
  - `setVolume`: Установка громкости воспроизведения
  - `toggleMute`: Переключение состояния отключения звука
  - `setPlaybackRate`: Установка скорости воспроизведения
  - `setTempo`: Регулировка темпа
  - `setPitchSemitones`: Регулировка питча
  - `setEffectBypass`: Обход аудиоэффектов
  - `setEffectMix`: Установка уровней микширования эффектов
  - `handleLofiToneChange`: Регулировка тона lo-fi
  - `handleLofiNoiseChange`: Регулировка шума lo-fi
  - `handleLofiWowChange`: Регулировка эффекта wow lo-fi
  - `handleEQBandChange`: Регулировка полосы эквалайзера
  - `handleEQMixChange`: Регулировка микса эквалайзера
  - `handleEQBypassChange`: Обход эквалайзера
  - `handleReverbMixChange`: Регулировка микса реверберации
  - `handleReverbPreDelayChange`: Регулировка предзадержки реверберации
  - `handleReverbDampingChange`: Регулировка демпфирования реверберации
  - `handleReverbPresetChange`: Изменение пресета реверберации
  - `handleReverbBypassChange`: Обход реверберации
  - `handleLowPassToneChange`: Регулировка тона фильтра нижних частот
  - `handleLowPassResonanceChange`: Регулировка резонанса фильтра нижних частот

### Хук useTelegramAuth
- **Расположение**: `src/components/TelegramAuthProvider.tsx`
- **Связано с**: Telegram WebApp, контекст аутентификации
- **Использование**: Управление состоянием аутентификации Telegram
- **Статус реализации**: ✅ Завершено
- **Этап**: Готово к производству
- **Ключевые функции**:
  - `setUser`: Установка данных аутентифицированного пользователя
  - `setIsAuthenticated`: Установка статуса аутентификации
  - `setIsDarkMode`: Установка предпочтения темного режима
  - `login`: Обработка процесса входа пользователя
  - `logout`: Обработка процесса выхода пользователя
  - `triggerHaptic`: Запуск тактильной обратной связи

## Компоненты аудиодвижка

### Класс WebAudioEngine
- **Расположение**: `src/core/audio/AudioEngine.ts`
- **Связано с**: Хук useAudioPlayer, элемент HTML5 Audio
- **Использование**: Реализация Web Audio API низкого уровня для продвинутой обработки аудио
- **Статус реализации**: ✅ Завершено
- **Этап**: Готово к производству
- **Ключевые функции**:
  - Реализация Web Audio API с обработкой эффектов
  - Управление темпом/питчем с интеграцией Tone.js
  - Эффекты lo-fi (тон, шум, wow/flutter)
  - 7-полосный эквалайзер
  - Эффекты реверберации с сверткой
  - Фильтрация нижних частот
  - Поддержка аудиовизуализации
- **Детальный анализ**:
  - Реализует комплексную цепочку аудиоэффектов с сухим/влажным микшированием
  - Поддерживает пути воспроизведения как HTMLMediaElement, так и AudioBuffer
  - Интегрирует Tone.js для продвинутых возможностей сдвига питча
  - Реализует правильное управление аудиоконтекстом с соблюдением политики автовоспроизведения
  - Обеспечивает детальный контроль параметров для всех аудиоэффектов
  - Включает правильную очистку и управление ресурсами
  - Поддерживает как AudioWorklet, так и резервные реализации

### Класс AudioEngineWrapper
- **Расположение**: `src/core/audio/AudioEngineWrapper.ts`
- **Связано с**: WebAudioEngine, система пользовательского взаимодействия
- **Использование**: Оберточный класс для инициализации аудиодвижка и обработки пользовательского взаимодействия
- **Статус реализации**: ✅ Завершено
- **Этап**: Готово к производству
- **Ключевые функции**:
  - Ленивая инициализация при пользовательском взаимодействии
  - Прокси-методы для всех функций аудиодвижка
  - Соблюдение политики автовоспроизведения
- **Детальный анализ**:
  - Реализует правильное обнаружение пользовательского взаимодействия для инициализации аудиоконтекста
  - Обеспечивает прозрачное проксирование всех методов аудиодвижка
  - Гарантирует соблюдение политик браузера по автовоспроизведению
  - Обрабатывает граничные случаи для неинициализированных состояний движка

## Зависимости проекта

### Зависимости производства
- `@radix-ui/react-*`: Библиотеки компонентов UI
- `@supabase/supabase-js`: Клиентская библиотека Supabase
- `@telegram-apps/sdk`: Telegram WebApp SDK
- `@telegram-apps/sdk-react`: React-хуки Telegram WebApp
- `@ton/*`: Библиотеки блокчейна TON
- `tone`: Библиотека Web Audio API для продвинутой обработки аудио
- `react`: Основная библиотека React
- `react-dom`: Библиотека отображения React DOM
- `react-router-dom`: Библиотека маршрутизации React

### Зависимости разработки
- `@types/*`: Определения типов TypeScript
- `@typescript-eslint/*`: Инструменты линтинга TypeScript
- `@vitejs/plugin-react`: Плагин React для Vite
- `eslint`: Линтинг JavaScript/TypeScript
- `prettier`: Форматирование кода
- `tailwindcss`: CSS-фреймворк
- `typescript`: Компилятор TypeScript
- `vite`: Инструмент сборки и сервер разработки

## Сводка статуса реализации

### Завершенные функции
- ✅ Вся основная функциональность воспроизведения аудио
- ✅ Аутентификация пользователя через Telegram
- ✅ Управление плейлистами и библиотекой
- ✅ Функциональность поиска
- ✅ Социальные функции
- ✅ Функции маркет