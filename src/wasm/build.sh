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
    log "Checking WASM file size..."
    
    if [ -f "dist/audio_effects.wasm" ]; then
        size=$(stat -f%z "dist/audio_effects.wasm" 2>/dev/null || stat -c%s "dist/audio_effects.wasm" 2>/dev/null)
        size_kb=$((size / 1024))
        
        if [ $size_kb -gt 500 ]; then
            warn "WASM file is large: ${size_kb}KB (consider optimization)"
        else
            success "WASM file size: ${size_kb}KB"
        fi
    else
        error "WASM file not found"
        exit 1
    fi
}

# Минификация JavaScript (опционально)
minify_js() {
    log "Minifying JavaScript files..."
    
    # Если установлен uglifyjs или terser, минифицируем JS файлы
    if command -v terser &> /dev/null; then
        for jsfile in dist/*.js; do
            if [[ $jsfile != *".min.js" ]]; then
                log "Minifying $(basename $jsfile)..."
                terser "$jsfile" -o "${jsfile%.js}.min.js" --compress --mangle
            fi
        done
        success "JavaScript files minified"
    elif command -v uglifyjs &> /dev/null; then
        for jsfile in dist/*.js; do
            if [[ $jsfile != *".min.js" ]]; then
                log "Minifying $(basename $jsfile)..."
                uglifyjs "$jsfile" -o "${jsfile%.js}.min.js" --compress --mangle
            fi
        done
        success "JavaScript files minified"
    else
        warn "No minification tool found (terser or uglifyjs). Skipping minification."
    fi
}

# Создание демонстрационного HTML файла
create_demo() {
    log "Creating demo HTML file..."
    
    cat > dist/demo.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>WASM Audio Effects Demo</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: #f0f0f0;
        }
        .control-group {
            background: white;
            padding: 15px;
            margin: 10px 0;
            border-radius: 5px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .slider-container {
            margin: 10px 0;
        }
        label {
            display: inline-block;
            width: 150px;
            font-weight: bold;
        }
        input[type="range"] {
            width: 200px;
            vertical-align: middle;
        }
        .value-display {
            display: inline-block;
            width: 50px;
            text-align: right;
        }
        button {
            background: #007acc;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            margin: 5px;
        }
        button:hover {
            background: #005a9e;
        }
        button:disabled {
            background: #ccc;
            cursor: not-allowed;
        }
        #status {
            padding: 10px;
            border-radius: 5px;
            margin: 10px 0;
        }
        .status-ok {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        .status-error {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
    </style>
</head>
<body>
    <h1>WASM Audio Effects Demo</h1>
    
    <div class="control-group">
        <h2>Audio Controls</h2>
        <button id="startAudio">Start Audio</button>
        <button id="stopAudio" disabled>Stop Audio</button>
    </div>
    
    <div class="control-group">
        <h2>Effects</h2>
        
        <div class="slider-container">
            <label for="pitchShift">Pitch Shift:</label>
            <input type="range" id="pitchShift" min="0.5" max="2.0" step="0.01" value="1.0">
            <span class="value-display" id="pitchShiftValue">1.00</span>
        </div>
        
        <div class="slider-container">
            <label for="bassBoost">Bass Boost (dB):</label>
            <input type="range" id="bassBoost" min="-10" max="10" step="0.5" value="0">
            <span class="value-display" id="bassBoostValue">0.0</span>
        </div>
        
        <div class="slider-container">
            <label for="loFiBitDepth">Lo-Fi Bit Depth:</label>
            <input type="range" id="loFiBitDepth" min="4" max="16" step="1" value="16">
            <span class="value-display" id="loFiBitDepthValue">16</span>
        </div>
        
        <div class="slider-container">
            <label for="loFiDownsample">Lo-Fi Downsample:</label>
            <input type="range" id="loFiDownsample" min="1" max="8" step="1" value="1">
            <span class="value-display" id="loFiDownsampleValue">1</span>
        </div>
        
        <h3>EQ Bands (dB)</h3>
        <div class="slider-container">
            <label for="eq100">100 Hz:</label>
            <input type="range" id="eq100" min="-15" max="15" step="0.5" value="0">
            <span class="value-display" id="eq100Value">0.0</span>
        </div>
        
        <div class="slider-container">
            <label for="eq250">250 Hz:</label>
            <input type="range" id="eq250" min="-15" max="15" step="0.5" value="0">
            <span class="value-display" id="eq250Value">0.0</span>
        </div>
        
        <div class="slider-container">
            <label for="eq500">500 Hz:</label>
            <input type="range" id="eq500" min="-15" max="15" step="0.5" value="0">
            <span class="value-display" id="eq500Value">0.0</span>
        </div>
        
        <div class="slider-container">
            <label for="eq1000">1 kHz:</label>
            <input type="range" id="eq1000" min="-15" max="15" step="0.5" value="0">
            <span class="value-display" id="eq1000Value">0.0</span>
        </div>
        
        <div class="slider-container">
            <label for="eq2000">2 kHz:</label>
            <input type="range" id="eq2000" min="-15" max="15" step="0.5" value="0">
            <span class="value-display" id="eq2000Value">0.0</span>
        </div>
        
        <div class="slider-container">
            <label for="eq4000">4 kHz:</label>
            <input type="range" id="eq4000" min="-15" max="15" step="0.5" value="0">
            <span class="value-display" id="eq4000Value">0.0</span>
        </div>
        
        <div class="slider-container">
            <label for="eq8000">8 kHz:</label>
            <input type="range" id="eq8000" min="-15" max="15" step="0.5" value="0">
            <span class="value-display" id="eq8000Value">0.0</span>
        </div>
        
        <h3>Presets</h3>
        <button id="presetFlat">Flat</button>
        <button id="presetRock">Rock</button>
        <button id="presetPop">Pop</button>
        <button id="presetJazz">Jazz</button>
        <button id="presetClassical">Classical</button>
        <button id="presetElectronic">Electronic</button>
    </div>
    
    <div id="status">Ready to initialize</div>
    
    <script type="module">
        import { createAudioProcessor } from './audio-processor-manager.js';
        
        let audioContext = null;
        let audioProcessor = null;
        let oscillator = null;
        let isPlaying = false;
        
        // DOM Elements
        const startButton = document.getElementById('startAudio');
        const stopButton = document.getElementById('stopAudio');
        const statusDiv = document.getElementById('status');
        
        // Update status display
        function updateStatus(message, isError = false) {
            statusDiv.textContent = message;
            statusDiv.className = isError ? 'status-error' : 'status-ok';
        }
        
        // Initialize audio
        async function initAudio() {
            try {
                updateStatus('Initializing audio...');
                
                // Create audio context
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
                
                // Create audio processor
                audioProcessor = await createAudioProcessor(audioContext, {
                    wasmPath: './audio_effects.wasm',
                    workletPath: './audio-worklet-processor.js'
                });
                
                // Create test oscillator
                oscillator = audioContext.createOscillator();
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
                
                // Connect audio graph: oscillator -> processor -> destination
                oscillator.connect(audioProcessor);
                audioProcessor.connect(audioContext.destination);
                
                updateStatus('Audio initialized successfully!');
                startButton.disabled = false;
                
                // Setup UI event listeners
                setupEventListeners();
                
            } catch (error) {
                console.error('Failed to initialize audio:', error);
                updateStatus('Failed to initialize audio: ' + error.message, true);
            }
        }
        
        // Start audio playback
        function startAudio() {
            if (!audioContext || !oscillator) return;
            
            if (audioContext.state === 'suspended') {
                audioContext.resume();
            }
            
            if (!isPlaying) {
                oscillator.start();
                isPlaying = true;
                startButton.disabled = true;
                stopButton.disabled = false;
                updateStatus('Audio playing...');
            }
        }
        
        // Stop audio playback
        function stopAudio() {
            if (isPlaying && oscillator) {
                oscillator.stop();
                isPlaying = false;
                startButton.disabled = false;
                stopButton.disabled = true;
                updateStatus('Audio stopped');
                
                // Create new oscillator for next playback
                oscillator = audioContext.createOscillator();
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
                oscillator.connect(audioProcessor);
            }
        }
        
        // Setup UI event listeners
        function setupEventListeners() {
            // Audio control buttons
            startButton.addEventListener('click', startAudio);
            stopButton.addEventListener('click', stopAudio);
            
            // Pitch shift
            const pitchShiftSlider = document.getElementById('pitchShift');
            const pitchShiftValue = document.getElementById('pitchShiftValue');
            pitchShiftSlider.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                pitchShiftValue.textContent = value.toFixed(2);
                if (audioProcessor) {
                    audioProcessor.setPitchShift(value);
                }
            });
            
            // Bass boost
            const bassBoostSlider = document.getElementById('bassBoost');
            const bassBoostValue = document.getElementById('bassBoostValue');
            bassBoostSlider.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                bassBoostValue.textContent = value.toFixed(1);
                if (audioProcessor) {
                    audioProcessor.setBassBoost(value);
                }
            });
            
            // Lo-Fi settings
            const loFiBitDepthSlider = document.getElementById('loFiBitDepth');
            const loFiBitDepthValue = document.getElementById('loFiBitDepthValue');
            loFiBitDepthSlider.addEventListener('input', (e) => {
                const value = parseInt(e.target.value);
                loFiBitDepthValue.textContent = value;
                if (audioProcessor) {
                    const downsampleValue = parseInt(document.getElementById('loFiDownsample').value);
                    audioProcessor.setLoFiSettings(value, downsampleValue);
                }
            });
            
            const loFiDownsampleSlider = document.getElementById('loFiDownsample');
            const loFiDownsampleValue = document.getElementById('loFiDownsampleValue');
            loFiDownsampleSlider.addEventListener('input', (e) => {
                const value = parseInt(e.target.value);
                loFiDownsampleValue.textContent = value;
                if (audioProcessor) {
                    const bitDepthValue = parseInt(document.getElementById('loFiBitDepth').value);
                    audioProcessor.setLoFiSettings(bitDepthValue, value);
                }
            });
            
            // EQ bands
            const eqBands = [100, 250, 500, 1000, 2000, 4000, 8000];
            eqBands.forEach(freq => {
                const slider = document.getElementById(`eq${freq}`);
                const valueDisplay = document.getElementById(`eq${freq}Value`);
                slider.addEventListener('input', (e) => {
                    const value = parseFloat(e.target.value);
                    valueDisplay.textContent = value.toFixed(1);
                    if (audioProcessor) {
                        audioProcessor.setEqBand(freq, value);
                    }
                });
            });
            
            // Presets
            document.getElementById('presetFlat').addEventListener('click', () => {
                if (audioProcessor) audioProcessor.setEqPreset('flat');
                updateEqSliders({ 100: 0, 250: 0, 500: 0, 1000: 0, 2000: 0, 4000: 0, 8000: 0 });
            });
            
            document.getElementById('presetRock').addEventListener('click', () => {
                if (audioProcessor) audioProcessor.setEqPreset('rock');
                updateEqSliders({ 100: 4, 250: 2, 500: -1, 1000: -2, 2000: 1, 4000: 3, 8000: 5 });
            });
            
            document.getElementById('presetPop').addEventListener('click', () => {
                if (audioProcessor) audioProcessor.setEqPreset('pop');
                updateEqSliders({ 100: 2, 250: 3, 500: 1, 1000: 0, 2000: 2, 4000: 3, 8000: 3 });
            });
            
            document.getElementById('presetJazz').addEventListener('click', () => {
                if (audioProcessor) audioProcessor.setEqPreset('jazz');
                updateEqSliders({ 100: 3, 250: 1, 500: 0, 1000: 1, 2000: 2, 4000: 1, 8000: 2 });
            });
            
            document.getElementById('presetClassical').addEventListener('click', () => {
                if (audioProcessor) audioProcessor.setEqPreset('classical');
                updateEqSliders({ 100: 2, 250: 0, 500: 0, 1000: 0, 2000: 1, 4000: 2, 8000: 3 });
            });
            
            document.getElementById('presetElectronic').addEventListener('click', () => {
                if (audioProcessor) audioProcessor.setEqPreset('electronic');
                updateEqSliders({ 100: 5, 250: 2, 500: -1, 1000: 0, 2000: 2, 4000: 4, 8000: 6 });
            });
        }
        
        // Update EQ slider values
        function updateEqSliders(values) {
            Object.entries(values).forEach(([freq, gain]) => {
                const slider = document.getElementById(`eq${freq}`);
                const valueDisplay = document.getElementById(`eq${freq}Value`);
                if (slider) slider.value = gain;
                if (valueDisplay) valueDisplay.textContent = gain.toFixed(1);
            });
        }
        
        // Initialize on page load
        window.addEventListener('load', initAudio);
    </script>
</body>
</html>
EOF
    
    success "Demo HTML file created"
}

# Основная функция сборки
main() {
    log "Starting WASM Audio Effects build process..."
    
    # Проверяем зависимости
    check_dependencies
    
    # Очистка
    if [[ "$1" == "--clean" ]]; then
        clean
    fi
    
    # Настройка директорий
    setup_directories
    
    # Сборка WASM
    build_wasm
    
    # Копирование JS файлов
    copy_js_files
    
    # Минификация (если запрошена)
    if [[ "$1" == "--minify" ]]; then
        minify_js
    fi
    
    # Проверка размера WASM
    check_wasm_size
    
    # Создание демо (если запрошено)
    if [[ "$1" == "--demo" ]]; then
        create_demo
    fi
    
    success "Build process completed successfully!"
    log "Output files are in the 'dist' directory"
}

# Запуск основной функции с аргументами командной строки
main "$@"