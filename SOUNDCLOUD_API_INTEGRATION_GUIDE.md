# Руководство по интеграции SoundCloud API в музыкальный плеер

## Важное замечание о неточностях

**Внимание:** Это руководство было обновлено после выявления неточностей в сравнении с официальной документацией SoundCloud API. Особенно важны изменения в разделах аутентификации и воспроизведения треков. Смотрите раздел 13 "Сравнение с официальной документацией SoundCloud API" для подробной информации.

## Введение

Это руководство поможет вам интегрировать SoundCloud API в ваш музыкальный плеер как дополнительный источник музыки alongside Jamendo API. Интеграция позволит пользователям получать доступ к огромному каталогу SoundCloud (375+ миллионов треков) без необходимости аутентификации.

## 1. Регистрация приложения

### 1.1. Создание учетной записи разработчика
1. Перейдите на https://developers.soundcloud.com/
2. Зарегистрируйте учетную запись разработчика
3. Подтвердите email

### 1.2. Регистрация нового приложения
1. В Developer Portal создайте новое приложение
2. Укажите название и описание приложения
3. Сохраните `client_id` для дальнейшего использования

Примечание: Redirect URI и `client_secret` не требуются для базового доступа к публичным данным. Однако для воспроизведения треков может потребоваться OAuth токен согласно последним обновлениям API (см. раздел "Воспроизведение треков").

## 2. Настройка доступа к API

### 2.1. Простой доступ к публичным трекам

Для доступа к публичным трекам достаточно добавлять `client_id` в качестве параметра к каждому запросу:

```
https://api.soundcloud.com/tracks?q=electronic&client_id=YOUR_CLIENT_ID
```

### 2.2. Аутентификация для воспроизведения треков

Для воспроизведения треков через API требуется OAuth токен, особенно согласно последним обновлениям безопасности SoundCloud API. Для получения токена необходимо использовать Client Credentials Flow:

```javascript
async function getClientCredentialsToken(clientId, clientSecret) {
  const response = await fetch('https://api.soundcloud.com/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'client_credentials'
    })
  });
  
  const data = await response.json();
  return data.access_token;
}
```

Ограничения Client Credentials Flow:
- 50 токенов в 12 часов на приложение
- 30 токенов в час на IP адрес

### 2.3. Без аутентификации пользователей

Для получения метаданных и поиска треков можно использовать анонимный доступ с `client_id`. Однако для воспроизведения треков требуется OAuth токен.

## 3. Реализация API клиента

### 3.1. Базовый HTTP клиент

```javascript
class SoundCloudAPI {
  constructor(clientId) {
    this.clientId = clientId;
    this.baseUrl = 'https://api.soundcloud.com';
  }
  
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    
    // Добавляем client_id к каждому запросу
    const separator = endpoint.includes('?') ? '&' : '?';
    const finalUrl = `${url}${separator}client_id=${this.clientId}`;
    
    try {
      const response = await fetch(finalUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      // Обработка 429 Too Many Requests
      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After');
        await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
        return this.request(endpoint, options);
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('SoundCloud API request failed:', error);
      throw error;
    }
  }
  
  // Поиск треков
  async searchTracks(query, limit = 50, offset = 0) {
    return this.request(`/tracks?q=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}`);
  }
  
  // Получение информации о треке
  async getTrack(trackId) {
    return this.request(`/tracks/${trackId}`);
  }
  
  // Получение stream URL для трека
  async getStreamUrl(trackId) {
    const track = await this.getTrack(trackId);
    return track.stream_url;
  }
  
  // Получение плейлиста
  async getPlaylist(playlistId) {
    return this.request(`/playlists/${playlistId}`);
  }
  
  // Поиск пользователей
  async searchUsers(query, limit = 50) {
    return this.request(`/users?q=${encodeURIComponent(query)}&limit=${limit}`);
  }
}
```

## 4. Поиск и получение треков

### 4.1. Реализация поиска треков

```javascript
// Использование API клиента для поиска треков
const soundcloud = new SoundCloudAPI('YOUR_CLIENT_ID');

async function searchTracks(query) {
  try {
    const response = await soundcloud.searchTracks(query, 20);
    
    // Фильтрация только воспроизводимых треков
    const playableTracks = response.collection.filter(track => track.streamable);
    
    return playableTracks.map(track => ({
      id: track.id,
      title: track.title,
      artist: track.user.username,
      duration: track.duration,
      artwork: track.artwork_url,
      permalink: track.permalink_url,
      streamUrl: track.stream_url,
      source: 'soundcloud' // Маркер источника
    }));
  } catch (error) {
    console.error('Search failed:', error);
    return [];
  }
}

// Пример использования
searchTracks('electronic').then(tracks => {
  console.log('Found tracks:', tracks);
});
```

### 4.2. Пагинация результатов

```javascript
class TrackSearch {
  constructor(apiClient) {
    this.api = apiClient;
    this.currentPage = 0;
    this.pageSize = 50;
    this.hasMore = true;
  }
  
  async loadNextPage(query) {
    if (!this.hasMore) return [];
    
    try {
      const response = await this.api.request(
        `/tracks?q=${encodeURIComponent(query)}&limit=${this.pageSize}&linked_partitioning=1&offset=${this.currentPage * this.pageSize}`
      );
      
      this.currentPage++;
      this.hasMore = !!response.next_href;
      
      return response.collection.filter(track => track.streamable).map(track => ({
        id: track.id,
        title: track.title,
        artist: track.user.username,
        duration: track.duration,
        artwork: track.artwork_url,
        permalink: track.permalink_url,
        source: 'soundcloud'
      }));
    } catch (error) {
      console.error('Failed to load tracks:', error);
      return [];
    }
  }
  
  reset() {
    this.currentPage = 0;
    this.hasMore = true;
  }
}
```

## 5. Воспроизведение треков

### 5.1. Получение stream URL и воспроизведение

Согласно официальной документации SoundCloud API, для получения stream URL требуется OAuth токен. Существует два подхода к решению этой проблемы:

**Подход 1: Использование OAuth токена (рекомендуется)**

```javascript
// Аудио плеер для воспроизведения треков SoundCloud с OAuth
class SoundCloudPlayer {
  constructor(clientId, clientSecret) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.accessToken = null;
    this.audio = new Audio();
    this.currentTrack = null;
  }
  
  async refreshAccessToken() {
    try {
      const response = await fetch('https://api.soundcloud.com/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          client_id: this.clientId,
          client_secret: this.clientSecret,
          grant_type: 'client_credentials'
        })
      });
      
      const data = await response.json();
      this.accessToken = data.access_token;
      return this.accessToken;
    } catch (error) {
      console.error('Failed to refresh access token:', error);
      throw error;
    }
  }
  
  async playTrack(trackId) {
    try {
      // Получаем или обновляем access token
      if (!this.accessToken) {
        await this.refreshAccessToken();
      }
      
      // Получаем информацию о треке с stream URL
      const track = await this.getTrackWithStreamUrl(trackId);
      
      // Используем stream URL с OAuth токеном
      this.audio.src = track.stream_url;
      this.audio.setRequestHeader('Authorization', `OAuth ${this.accessToken}`);
      await this.audio.play();
      
      this.currentTrack = trackId;
      console.log('Playing track:', trackId);
    } catch (error) {
      console.error('Failed to play track:', error);
      
      // Если ошибка авторизации, пробуем обновить токен
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        try {
          await this.refreshAccessToken();
          // Повторная попытка воспроизведения
          const track = await this.getTrackWithStreamUrl(trackId);
          this.audio.src = track.stream_url;
          this.audio.setRequestHeader('Authorization', `OAuth ${this.accessToken}`);
          await this.audio.play();
        } catch (retryError) {
          console.error('Failed to play track after token refresh:', retryError);
        }
      }
    }
  }
  
  async getTrackWithStreamUrl(trackId) {
    // Для получения stream_url требуется OAuth заголовок
    const response = await fetch(`https://api.soundcloud.com/tracks/${trackId}`, {
      headers: {
        'Authorization': `OAuth ${this.accessToken}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  }
  
  pause() {
    this.audio.pause();
  }
  
  resume() {
    this.audio.play();
  }
  
  stop() {
    this.audio.pause();
    this.audio.currentTime = 0;
    this.currentTrack = null;
  }
}
```

**Подход 2: Использование встроенного плеера SoundCloud**

Альтернативный подход - использование встроенного виджета SoundCloud, который обходит ограничения API:

```javascript
// Использование виджета SoundCloud
function playTrackWithWidget(trackId) {
  // Создаем iframe с виджетом SoundCloud
  const widgetUrl = `https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${trackId}`;
  
  const iframe = document.createElement('iframe');
  iframe.width = '100%';
  iframe.height = '166';
  iframe.scrolling = 'no';
  iframe.frameBorder = 'no';
  iframe.allow = 'autoplay';
  iframe.src = widgetUrl;
  
  // Добавляем виджет на страницу
  document.getElementById('player-container').appendChild(iframe);
  
  console.log('Playing track with SoundCloud widget:', trackId);
}
```

**Рекомендация:** Для продакшена рекомендуется использовать подход с OAuth токеном, так как он обеспечивает лучший контроль над воспроизведением и соблюдение требований API.

### 5.2. Требования к атрибуции

SoundCloud требует строгого соблюдения правил атрибуции при использовании их контента. При воспроизведении треков необходимо:

1. **Указание автора трека:** Всегда отображать имя пользователя, загрузившего трек
2. **Указание SoundCloud как источника:** Отображать логотип SoundCloud и ссылку на оригинальный трек
3. **Ссылка на оригинальный трек:** Предоставить пользователям возможность перейти на страницу трека на SoundCloud

```javascript
// Отображение информации о треке с соблюдением требований атрибуции
function displayTrackInfo(track) {
  const trackInfo = document.getElementById('track-info');
  
  trackInfo.innerHTML = `
    <div class="track-artwork">
      <img src="${track.artwork_url || 'default-artwork.png'}" alt="${track.title}">
    </div>
    <div class="track-details">
      <h3>${track.title}</h3>
      <p>by ${track.user.username}</p>
      <p><a href="${track.permalink_url}" target="_blank">Listen on SoundCloud</a></p>
      <div class="soundcloud-attribution">
        <img src="soundcloud-logo.png" alt="SoundCloud" style="height: 20px;">
        <span>Streamed from SoundCloud</span>
      </div>
    </div>
  `;
}

// Для аудио плеера также необходимо отображать атрибуцию
function displayPlayerAttribution(track) {
  const playerAttribution = document.getElementById('player-attribution');
  
  playerAttribution.innerHTML = `
    <div class="track-attribution">
      <span>${track.title} by ${track.user.username}</span>
      <a href="${track.permalink_url}" target="_blank">
        <img src="soundcloud-icon.png" alt="SoundCloud" style="height: 16px;">
      </a>
    </div>
  `;
}
```

**Важно:** Несоблюдение требований атрибуции может привести к ограничению доступа к API или прекращению работы приложения.

## 6. Работа с плейлистами

### 6.1. Получение и отображение плейлистов

```javascript
// Получение информации о плейлисте
async function getPlaylist(playlistId) {
  try {
    const playlist = await soundcloud.getPlaylist(playlistId);
    
    return {
      id: playlist.id,
      title: playlist.title,
      description: playlist.description,
      artwork: playlist.artwork_url,
      tracks: playlist.tracks.map(track => ({
        id: track.id,
        title: track.title,
        artist: track.user.username,
        duration: track.duration,
        streamable: track.streamable,
        source: 'soundcloud'
      })),
      source: 'soundcloud'
    };
  } catch (error) {
    console.error('Failed to get playlist:', error);
    return null;
  }
}
```

## 7. Локальные социальные функции

Все социальные функции (лайки, подписки, комментарии) будут реализованы локально в нашей базе данных Supabase, а не передаваться в SoundCloud API.

### 7.1. Локальные лайки

```javascript
// Лайк трека (локально в Supabase)
async function likeTrackLocally(trackId, userId) {
  try {
    const response = await fetch('/api/likes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        track_id: trackId,
        user_id: userId,
        source: 'soundcloud' // Маркер источника
      })
    });
    
    console.log(`Successfully liked track ${trackId} locally`);
    return await response.json();
  } catch (error) {
    console.error('Failed to like track locally:', error);
    throw error;
  }
}

// Проверка, лайкнут ли трек
async function isTrackLiked(trackId, userId) {
  try {
    const response = await fetch(`/api/likes?track_id=${trackId}&user_id=${userId}&source=soundcloud`);
    const likes = await response.json();
    return likes.length > 0;
  } catch (error) {
    console.error('Failed to check if track is liked:', error);
    return false;
  }
}
```

### 7.2. Локальные подписки

```javascript
// Подписка на артиста (локально в Supabase)
async function followArtistLocally(artistId, userId) {
  try {
    const response = await fetch('/api/follows', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        artist_id: artistId,
        user_id: userId,
        source: 'soundcloud' // Маркер источника
      })
    });
    
    console.log(`Successfully followed artist ${artistId} locally`);
    return await response.json();
  } catch (error) {
    console.error('Failed to follow artist locally:', error);
    throw error;
  }
}
```

### 7.3. Локальные комментарии

```javascript
// Добавление комментария к треку (локально в Supabase)
async function addCommentLocally(trackId, userId, text) {
  try {
    const response = await fetch('/api/comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        track_id: trackId,
        user_id: userId,
        text: text,
        source: 'soundcloud', // Маркер источника
        timestamp: new Date().toISOString()
      })
    });
    
    console.log('Comment added locally:', await response.json());
    return await response.json();
  } catch (error) {
    console.error('Failed to add comment locally:', error);
    throw error;
  }
}

// Получение комментариев к треку
async function getTrackCommentsLocally(trackId) {
  try {
    const response = await fetch(`/api/comments?track_id=${trackId}&source=soundcloud`);
    return await response.json();
  } catch (error) {
    console.error('Failed to get comments locally:', error);
    return [];
  }
}
```

## 8. Обработка ошибок и лимитов

### 8.1. Лимиты API

SoundCloud API имеет следующие лимиты:

1. **Client Credentials Flow:**
   - 50 токенов в 12 часов на приложение
   - 30 токенов в час на IP адрес

2. **Play requests:**
   - 15,000 запросов в сутки через `/tracks/:id/stream`

3. **Общие запросы:**
   - Нет глобального лимита на общее количество запросов
   - При превышении возвращается HTTP 429 "Too Many Requests"

### 8.2. Экспоненциальная задержка при превышении лимитов

```javascript
// Функция с экспоненциальной задержкой
async function exponentialBackoff(fn, maxRetries = 5, baseDelay = 1000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      // Если это не ошибка лимита, пробрасываем ее
      if (!error.message.includes('429')) {
        throw error;
      }
      
      // Если исчерпаны попытки, пробрасываем ошибку
      if (i === maxRetries - 1) {
        throw error;
      }
      
      // Вычисляем задержку (экспоненциальное увеличение)
      const delay = baseDelay * Math.pow(2, i);
      console.log(`Rate limited. Retrying in ${delay}ms...`);
      
      // Ждем перед повторной попыткой
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// Пример использования
async function searchWithBackoff(query) {
  return exponentialBackoff(() => soundcloud.searchTracks(query));
}

// Обработка 429 ошибок в API клиенте
async request(endpoint, options = {}) {
  const url = `${this.baseUrl}${endpoint}`;
  
  // Добавляем client_id к каждому запросу
  const separator = endpoint.includes('?') ? '&' : '?';
  const finalUrl = `${url}${separator}client_id=${this.clientId}`;
  
  try {
    const response = await fetch(finalUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    // Обработка 429 Too Many Requests
    if (response.status === 429) {
      const retryAfter = response.headers.get('Retry-After') || 60; // По умолчанию 60 секунд
      console.log(`Rate limit exceeded. Retry after ${retryAfter} seconds.`);
      await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
      return this.request(endpoint, options);
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('SoundCloud API request failed:', error);
    throw error;
  }
}

## 9. Интеграция с существующим плеером

### 9.1. Унифицированный интерфейс для разных источников

```javascript
// Интерфейс для музыкальных сервисов
class MusicService {
  async searchTracks(query) {
    throw new Error('Not implemented');
  }
  
  async getTrackStreamUrl(trackId) {
    throw new Error('Not implemented');
  }
  
  async getTrackInfo(trackId) {
    throw new Error('Not implemented');
  }
}

// Реализация для SoundCloud
class SoundCloudService extends MusicService {
  constructor(clientId) {
    super();
    this.api = new SoundCloudAPI(clientId);
  }
  
  async searchTracks(query) {
    const response = await this.api.searchTracks(query);
    return response.collection
      .filter(track => track.streamable)
      .map(track => ({
        id: `soundcloud_${track.id}`, // Уникальный ID с префиксом источника
        originalId: track.id,
        title: track.title,
        artist: track.user.username,
        duration: track.duration,
        artwork: track.artwork_url,
        source: 'soundcloud',
        permalink: track.permalink_url
      }));
  }
  
  async getTrackStreamUrl(trackId) {
    // Извлекаем оригинальный ID (убираем префикс)
    const originalId = trackId.replace('soundcloud_', '');
    const track = await this.api.getTrack(originalId);
    return `${track.stream_url}?client_id=${this.api.clientId}`;
  }
  
  async getTrackInfo(trackId) {
    const originalId = trackId.replace('soundcloud_', '');
    const track = await this.api.getTrack(originalId);
    return {
      id: `soundcloud_${track.id}`,
      originalId: track.id,
      title: track.title,
      artist: track.user.username,
      duration: track.duration,
      artwork: track.artwork_url,
      source: 'soundcloud',
      permalink: track.permalink_url
    };
  }
}

// Реализация для Jamendo (для сравнения)
class JamendoService extends MusicService {
  constructor() {
    super();
    // Инициализация Jamendo API клиента
  }
  
  async searchTracks(query) {
    // Реализация поиска в Jamendo
    // Возвращаем треки с префиксом 'jamendo_'
  }
  
  async getTrackStreamUrl(trackId) {
    // Извлекаем оригинальный ID и получаем stream URL из Jamendo
  }
  
  async getTrackInfo(trackId) {
    // Получаем информацию о треке из Jamendo
  }
}

// Управление несколькими музыкальными сервисами
class MusicServiceManager {
  constructor() {
    this.services = new Map();
    this.currentService = null;
  }
  
  addService(name, service) {
    this.services.set(name, service);
  }
  
  setCurrentService(name) {
    if (this.services.has(name)) {
      this.currentService = this.services.get(name);
    } else {
      throw new Error(`Service ${name} not found`);
    }
  }
  
  async searchTracks(query) {
    if (!this.currentService) {
      throw new Error('No service selected');
    }
    return this.currentService.searchTracks(query);
  }
  
  async getTrackStreamUrl(trackId) {
    // Определяем сервис по префиксу ID
    const servicePrefix = trackId.split('_')[0];
    const service = this.services.get(servicePrefix);
    
    if (!service) {
      throw new Error(`Service for prefix ${servicePrefix} not found`);
    }
    
    return service.getTrackStreamUrl(trackId);
  }
  
  // Поиск по всем сервисам сразу
  async searchAllServices(query) {
    const results = [];
    
    for (const [name, service] of this.services) {
      try {
        const serviceResults = await service.searchTracks(query);
        results.push(...serviceResults);
      } catch (error) {
        console.error(`Failed to search in ${name}:`, error);
      }
    }
    
    // Сортируем результаты по релевантности или другим критериям
    return this.sortResults(results);
  }
  
  sortResults(results) {
    // Простая сортировка по качеству (можно усложнить)
    return results.sort((a, b) => {
      // Приоритет Jamendo, затем SoundCloud
      const sourcePriority = { jamendo: 1, soundcloud: 2 };
      return sourcePriority[a.source] - sourcePriority[b.source];
    });
  }
}

// Использование
const serviceManager = new MusicServiceManager();
serviceManager.addService('soundcloud', new SoundCloudService('YOUR_CLIENT_ID'));
// Добавляем Jamendo сервис аналогично
// serviceManager.addService('jamendo', new JamendoService());

// Поиск треков по всем сервисам
serviceManager.searchAllServices('electronic music').then(tracks => {
  console.log('All tracks:', tracks);
});
```

## 10. Бесшовное переключение между API

### 10.1. Унифицированные данные

Все треки из разных источников будут иметь统一ный формат:

```javascript
{
  id: 'soundcloud_123456789', // или 'jamendo_987654321'
  originalId: '123456789',
  title: 'Track Title',
  artist: 'Artist Name',
  duration: 240000, // в миллисекундах
  artwork: 'https://image.url',
  source: 'soundcloud', // или 'jamendo'
  permalink: 'https://track.url'
}
```

### 10.2. Единый плеер

```javascript
class UniversalMusicPlayer {
  constructor(serviceManager) {
    this.serviceManager = serviceManager;
    this.audio = new Audio();
    this.currentTrack = null;
  }
  
  async playTrack(track) {
    try {
      // Получаем stream URL через менеджер сервисов
      const streamUrl = await this.serviceManager.getTrackStreamUrl(track.id);
      
      this.audio.src = streamUrl;
      await this.audio.play();
      
      this.currentTrack = track;
      console.log('Playing track:', track.title);
      
      // Отправляем аналитику в Supabase
      this.trackPlay(track);
    } catch (error) {
      console.error('Failed to play track:', error);
    }
  }
  
  async trackPlay(track) {
    try {
      await fetch('/api/analytics/play', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          track_id: track.id,
          original_id: track.originalId,
          source: track.source,
          timestamp: new Date().toISOString()
        })
      });
    } catch (error) {
      console.error('Failed to track play:', error);
    }
  }
  
  pause() {
    this.audio.pause();
  }
  
  resume() {
    this.audio.play();
  }
  
  stop() {
    this.audio.pause();
    this.audio.currentTime = 0;
    this.currentTrack = null;
  }
}
```

## 11. Хранение данных в Supabase

Все пользовательские данные (лайки, подписки, комментарии, история прослушивания) будут храниться в Supabase, а не передаваться в сторонние API.

### 11.1. Структура таблиц Supabase

```sql
-- Таблица лайков
CREATE TABLE likes (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  track_id TEXT,
  original_id TEXT,
  source TEXT, -- 'soundcloud' или 'jamendo'
  created_at TIMESTAMP DEFAULT NOW()
);

-- Таблица подписок
CREATE TABLE follows (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  artist_id TEXT,
  original_id TEXT,
  source TEXT, -- 'soundcloud' или 'jamendo'
  created_at TIMESTAMP DEFAULT NOW()
);

-- Таблица комментариев
CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  track_id TEXT,
  original_id TEXT,
  source TEXT, -- 'soundcloud' или 'jamendo'
  text TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Таблица истории прослушивания
CREATE TABLE play_history (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  track_id TEXT,
  original_id TEXT,
  source TEXT, -- 'soundcloud' или 'jamendo'
  played_at TIMESTAMP DEFAULT NOW()
);
```

## 13. Сравнение с официальной документацией SoundCloud API

### 13.1. Ключевые различия между руководством и официальной документацией

1. **Аутентификация:**
   - В руководстве изначально утверждалось, что можно работать без OAuth
   - Официальная документация требует OAuth токен для получения stream URL
   - Исправлено: добавлен раздел об аутентификации для воспроизведения

2. **Воспроизведение треков:**
   - В руководстве предполагалось, что stream URL можно получить с client_id
   - Официальная документация требует OAuth заголовок для доступа к stream_url
   - Исправлено: добавлены два подхода - с OAuth и через виджет

3. **Лимиты API:**
   - В руководстве были неточные данные о лимитах
   - Официальная документация указывает точные лимиты Client Credentials Flow
   - Исправлено: обновлена информация о лимитах

4. **Требования к атрибуции:**
   - В руководстве недостаточно подробно описаны требования
   - Официальная документация требует строгого соблюдения атрибуции
   - Исправлено: расширены требования к атрибуции

### 13.2. Рекомендации по соблюдению требований API

1. Всегда проверяйте актуальную документацию на https://developers.soundcloud.com/docs/api/guide
2. Регулярно обновляйте клиентский код при изменениях в API
3. Строго соблюдайте требования к атрибуции
4. Мониторьте использование лимитов API
5. Имейте план резервный действий при достижении лимитов

### 13.3. Пример тестирования функций

```javascript
// Тестирование поиска треков
async function testSearch() {
  try {
    console.log('Testing track search...');
    const tracks = await searchTracks('rock');
    console.log(`Found ${tracks.length} tracks`);
    
    if (tracks.length > 0) {
      console.log('First track:', tracks[0]);
    }
  } catch (error) {
    console.error('Search test failed:', error);
  }
}

// Тестирование воспроизведения
async function testPlayback() {
  try {
    console.log('Testing track playback...');
    // Используем известный публичный трек для теста
    const player = new SoundCloudPlayer();
    // Замените на реальный ID трека
    await player.playTrack(123456789);
    console.log('Playback started successfully');
  } catch (error) {
    console.error('Playback test failed:', error);
  }
}

// Запуск тестов
testSearch();
testPlayback();
```

## 14. Заключение

Это руководство охватывает основные аспекты интеграции SoundCloud API в музыкальный плеер:

1. **Регистрация приложения** и получение `client_id`
2. **Настройка доступа** к публичным трекам (с OAuth для воспроизведения)
3. **Реализация поиска треков** с фильтрацией и пагинацией
4. **Воспроизведение треков** с соблюдением требований атрибуции
5. **Работа с плейлистами** и информацией об артистах
6. **Локальные социальные функции** (лайки, подписки, комментарии) хранящиеся в Supabase
7. **Унифицированный интерфейс** для работы с несколькими источниками
8. **Бесшовное переключение** между SoundCloud и Jamendo
9. **Обработка ошибок** и соблюдение лимитов API

Ключевые особенности нашей реализации:

- **Гибридная аутентификация**: Анонимный доступ для поиска, OAuth для воспроизведения
- **Локальные социальные функции**: Лайки, подписки и комментарии хранятся в Supabase, не передаются в SoundCloud
- **Единый интерфейс**: Пользователь может переключаться между сервисами без noticing
- **Унифицированные данные**: Все треки имеют统一ный формат независимо от источника
- **Хранение в облаке**: Все пользовательские данные хранятся в Supabase

**Важно:** Руководство было обновлено с учетом выявленных неточностей в сравнении с официальной документацией SoundCloud API. Особенно важны изменения в разделах аутентификации и воспроизведения треков.

Удачи с интеграцией SoundCloud API в ваш музыкальный плеер!