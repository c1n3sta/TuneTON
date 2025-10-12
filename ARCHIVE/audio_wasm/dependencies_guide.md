# 📋 Зависимости для WASM Audio Module

## 🛠️ Основные инструменты сборки

### 1. **Rust и Cargo** (обязательно)
```bash
# Установка через rustup
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.cargo/env

# Проверка версии
rustc --version  # должно быть >= 1.65.0
cargo --version
```

### 2. **wasm-pack** (обязательно)
```bash
# Установка
curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh

# Или через cargo
cargo install wasm-pack

# Проверка
wasm-pack --version  # должно быть >= 0.10.0
```

### 3. **Node.js** (для тестирования и dev-сервера)
```bash
# Через nvm (рекомендуется)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install node
nvm use node

# Проверка
node --version  # должно быть >= 16.0.0
npm --version
```

## 🔧 Дополнительные Rust зависимости

### Добавить в `src/wasm/Cargo.toml`:
```toml
[dependencies]
wasm-bindgen = "0.2"
js-sys = "0.3"
web-sys = { version = "0.3", features = [
  "console",
  "AudioContext", 
  "AudioWorkletGlobalScope",
  "AudioParam",
  "AudioWorkletNode",
  "Float32Array"
]}

# Для математических операций (опционально)
libm = "0.2"

# Для более сложной DSP обработки (опционально)
rustfft = "6.0"
realfft = "3.0"
```

### Установка Rust target для WebAssembly:
```bash
rustup target add wasm32-unknown-unknown
```

## 📦 JavaScript зависимости (опционально)

### package.json для dev-среды:
```json
{
  "name": "wasm-audio-effects",
  "version": "1.0.0",
  "type": "module",
  "devDependencies": {
    "terser": "^5.16.0",
    "http-server": "^14.1.1",
    "concurrently": "^7.6.0"
  },
  "scripts": {
    "build": "./build.sh",
    "serve": "http-server dist -p 8000 -c-1",
    "dev": "concurrently \"npm run build -- --watch\" \"npm run serve\"",
    "minify": "./build.sh --minify"
  }
}
```

```bash
# Установка JavaScript зависимостей
npm install
```

## 🌐 Браузерные требования

### Минимальные версии браузеров:
- **Chrome**: 66+ (AudioWorklet)
- **Firefox**: 76+ (AudioWorklet)
- **Safari**: 14.1+ (AudioWorklet)
- **Edge**: 79+ (AudioWorklet)

### Проверка поддержки WebAssembly:
```javascript
// Проверить в консоли браузера
console.log('WebAssembly supported:', typeof WebAssembly !== 'undefined');
console.log('AudioWorklet supported:', 'audioWorklet' in AudioContext.prototype);
```

## 🖥️ Системные зависимости

### Linux (Ubuntu/Debian):
```bash
# Базовые инструменты
sudo apt update
sudo apt install -y curl build-essential

# Для некоторых Rust зависимостей
sudo apt install -y pkg-config libssl-dev

# Git (если нужен)
sudo apt install -y git
```

### macOS:
```bash
# Через Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Инструменты сборки (если нужны)
xcode-select --install
```

### Windows:
```bash
# Установить Git Bash или WSL2
# Для компиляции может потребоваться Visual Studio Build Tools
```

## 🚀 Быстрая настройка окружения

### Скрипт автоматической установки:
```bash
#!/bin/bash
# setup-env.sh

set -e

echo "🚀 Setting up WASM Audio Effects environment..."

# 1. Проверяем и устанавливаем Rust
if ! command -v rustc &> /dev/null; then
    echo "Installing Rust..."
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
    source ~/.cargo/env
fi

# 2. Устанавливаем wasm-pack
if ! command -v wasm-pack &> /dev/null; then
    echo "Installing wasm-pack..."
    curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh
fi

# 3. Добавляем WASM target
rustup target add wasm32-unknown-unknown

# 4. Проверяем Node.js
if ! command -v node &> /dev/null; then
    echo "Please install Node.js from https://nodejs.org/"
    echo "Or use nvm: curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash"
fi

# 5. Устанавливаем дополнительные инструменты
cargo install basic-http-server
npm install -g terser

echo "✅ Environment setup complete!"
echo "Run: ./build.sh to build the project"
```

## 🔍 Проверка зависимостей

### Скрипт проверки (`check-deps.sh`):
```bash
#!/bin/bash
# check-deps.sh

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

check_cmd() {
    if command -v $1 &> /dev/null; then
        echo -e "${GREEN}✅ $1${NC} - $(which $1)"
        $1 --version | head -1
    else
        echo -e "${RED}❌ $1 not found${NC}"
        return 1
    fi
    echo
}

echo "🔍 Checking dependencies..."
echo

# Основные инструменты
check_cmd rustc
check_cmd cargo
check_cmd wasm-pack

# Дополнительные
check_cmd node
check_cmd npm

# Проверяем Rust target
echo "📦 Checking Rust WASM target..."
if rustup target list --installed | grep -q "wasm32-unknown-unknown"; then
    echo -e "${GREEN}✅ wasm32-unknown-unknown target installed${NC}"
else
    echo -e "${YELLOW}⚠️  Installing wasm32-unknown-unknown target...${NC}"
    rustup target add wasm32-unknown-unknown
fi

echo
echo "🎯 Dependencies check complete!"
```

## 📁 Минимальная структура проекта

```
project/
├── src/
│   ├── wasm/
│   │   ├── Cargo.toml     # Rust зависимости
│   │   └── lib.rs         # WASM исходники
│   └── js/                # JavaScript файлы
├── build.sh               # Скрипт сборки
├── setup-env.sh           # Установка окружения
├── check-deps.sh          # Проверка зависимостей
└── package.json           # JS зависимости (опционально)
```

## ⚡ Быстрый старт

```bash
# 1. Клонируем проект (или создаем новый)
git clone <your-repo>
cd wasm-audio-effects

# 2. Устанавливаем зависимости
chmod +x setup-env.sh check-deps.sh build.sh
./setup-env.sh

# 3. Проверяем установку
./check-deps.sh

# 4. Собираем проект
./build.sh --clean --test

# 5. Запускаем демо
basic-http-server dist -a 127.0.0.1:8000
# Открываем http://127.0.0.1:8000/demo.html
```

## 🐛 Решение проблем

### Ошибки сборки WASM:
```bash
# Обновить инструменты
rustup update
cargo install wasm-pack --force

# Очистить кеш
cargo clean
rm -rf target/ pkg/
```

### Ошибки в браузере:
```bash
# Проверить CORS (нужен HTTP сервер, не file://)
python -m http.server 8000
# или
npx http-server dist -c-1
```

### Проблемы с памятью:
```rust
// В Cargo.toml добавить оптимизации
[profile.release]
opt-level = "s"
lto = true
codegen-units = 1
panic = "abort"
```

## 📊 Размеры финальных файлов

Ожидаемые размеры после сборки:
- `audio_effects.wasm`: ~150-300KB
- `audio-worklet-processor.js`: ~10-15KB  
- `audio-processor-manager.js`: ~8-12KB
- `wasm-loader.js`: ~3-5KB
- Общий размер: ~170-330KB

Это обеспечивает быструю загрузку и эффективную работу в браузере! 🚀