#!/bin/bash

# Build script для WASM аудио модуля
# Компилирует Rust код в WebAssembly и подготавливает JavaScript файлы

set -e  # Останавливаемся при любой ошибке

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Функция для логирования
log() {
    echo -e "${BLUE}[BUILD]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# Проверяем наличие необходимых инструментов
check_dependencies() {
    log "Checking dependencies..."
    
    if ! command -v rustc &> /dev/null; then
        error "Rust is not installed. Please install from https://rustup.rs/"
        exit 1
    fi
    
    if ! command -v wasm-pack &> /dev/null; then
        error "wasm-pack is not installed. Installing..."
        curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh
    fi
    
    if ! command -v cargo &> /dev/null; then
        error "Cargo is not installed"
        exit 1
    fi
    
    success "All dependencies are available"
}

# Очистка предыдущих сборок
clean() {
    log "Cleaning previous builds..."
    
    rm -rf dist/
    rm -rf target/
    rm -rf pkg/
    
    success "Clean completed"
}

# Настройка структуры папок
setup_directories() {
    log "Setting up directory structure..."
    
    mkdir -p dist/
    mkdir -p src/wasm/dsp/
    mkdir -p src/js/
    
    success "Directories created"
}

# Создание Cargo.toml если не существует
create_cargo_toml() {
    if [ ! -f "src/wasm/Cargo.toml" ]; then
        log "Creating Cargo.toml..."
        
        cat > src/wasm/Cargo.toml << EOF
[package]
name = "audio-effects-wasm"
version = "0.1.0"
edition = "2021"

[lib]
crate-type = ["cdylib"]

[dependencies]
wasm-bindgen = "0.2"
js-sys = "0.3"
web-sys = "0.3"

[dependencies.web-sys]
version = "0.3"
features = [
  "console",
  "AudioContext",
  "AudioWorkletGlobalScope",
]

# Оптимизации для размера WASM
[profile.release]
opt-level = 's'          # Оптимизация размера
lto = true              # Link Time Optimization
debug = false           # Отключаем debug символы
panic = 'abort'         # Используем abort вместо unwind

# Дополнительные оптимизации
[profile.release.package."*"]
opt-level = 's'
EOF
        
        success "Cargo.toml created"
    fi
}

# Компиляция WASM модуля
build_wasm() {
    log "Building WASM module..."
    
    cd src/wasm
    
    # Проверяем наличие исходников
    if [ ! -f "lib.rs" ]; then
        error "lib.rs not found in src/wasm/"
        exit 1
    fi
    
    # Компилируем с wasm-pack
    wasm-pack build \
        --target web \
        --out-dir ../../pkg \
        --release \
        --no-typescript \
        --no-pack
    
    cd ../..
    
    # Копируем WASM файлы в dist
    cp pkg/audio_effects_wasm.wasm dist/audio_effects.wasm
    cp pkg/audio_effects_wasm.js dist/audio_effects_wasm.js
    
    success "WASM module built successfully"
}

# Копирование JavaScript файлов
copy_js_files() {
    log "Copying JavaScript files..."
    
    # Копируем основные JS файлы
    cp src/js/audio-worklet-processor.js dist/
    cp src/js/audio-processor-manager.js dist/
    cp src/js/wasm-loader.js dist/
    
    success "JavaScript files copied"
}

# Проверка размера WASM файла
check_wasm_size() {
    log