/**
 * Демонстрация использования аудио-процессора с WASM эффектами
 */

import { createAudioProcessor } from './audio-processor-manager.js';

class AudioEffectsDemo {
  constructor() {
    this.audioContext = null;
    this.processor = null;
    this.mediaSource = null;
    this.isPlaying = false;
  }

  async initialize() {
    try {
      // Создаем AudioContext
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      console.log('AudioContext created, sample rate:', this.audioContext.sampleRate);
      
      // Инициализируем аудиопроцессор
      this.processor = await createAudioProcessor(this.audioContext, {
        wasmPath: './dist/audio_effects.wasm',
        workletPath: './dist/audio-worklet-processor.js'
      });
      
      // Подключаем к выходу
      this.processor.connect(this.audioContext.destination);
      
      // Настраиваем обработку сообщений
      this.processor.onMessage('effect_status', (data) => {
        console.log(`Effect ${data.effect} is now ${data.enabled ? 'ON' : 'OFF'}`);
        this.updateUI(data.effect, data.enabled);
      });
      
      console.log('Audio processor initialized successfully');
      
      // Получаем статус
      const status = await this.processor.getStatus();
      console.log('Processor status:', status);
      
    } catch (error) {
      console.error('Failed to initialize audio processor:', error);
      throw error;
    }
  }
  
  /**
   * Загружает и воспроизводит аудиофайл
   */
  async loadAudioFile(file) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      
      // Создаем источник
      this.mediaSource = this.audioContext.createBufferSource();
      this.mediaSource.buffer = audioBuffer;
      this.mediaSource.loop = true;
      
      // Подключаем: источник -> процессор -> выход
      this.mediaSource.connect(this.processor.workletNode);
      
      console.log('Audio file loaded:', file.name);
      console.log('Duration:', audioBuffer.duration, 'seconds');
      
    } catch (error) {
      console.error('Failed to load audio file:', error);
      throw error;
    }
  }
  
  /**
   * Создает источник с микрофона
   */
  async createMicrophoneInput() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: { 
          echoCancellation: false,
          autoGainControl: false,
          noiseSuppression: false,
          sampleRate: this.audioContext.sampleRate
        }
      });
      
      this.mediaSource = this.audioContext.createMediaStreamSource(stream);
      this.mediaSource.connect(this.processor.workletNode);
      
      console.log('Microphone input created');
      
    } catch (error) {
      console.error('Failed to create microphone input:', error);
      throw error;
    }
  }
  
  /**
   * Создает генератор тестового сигнала
   */
  createTestTone(frequency = 440) {
    this.mediaSource = this.audioContext.createOscillator();
    this.mediaSource.frequency.value = frequency;
    this.mediaSource.type = 'sine';
    
    // Добавляем gain для контроля громкости
    const gainNode = this.audioContext.createGain();
    gainNode.gain.value = 0.3; // 30% громкости
    
    this.mediaSource.connect(gainNode);
    gainNode.connect(this.processor.workletNode);
    
    console.log(`Test tone created: ${frequency} Hz`);
  }
  
  /**
   * Управление воспроизведением
   */
  play() {
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
    
    if (this.mediaSource && !this.isPlaying) {
      this.mediaSource.start();
      this.isPlaying = true;
      console.log('Playback started');
    }
  }
  
  stop() {
    if (this.mediaSource && this.isPlaying) {
      this.mediaSource.stop();
      this.isPlaying = false;
      console.log('Playback stopped');
    }
  }
  
  /**
   * Демонстрация эффектов
   */
  
  // Питч-шифтинг
  demoOctaveUp() {
    this.processor.enableEffect('pitchShift', true);
    this.processor.setPitchShift(2.0); // октава вверх
    console.log('Pitch shift: +1 octave');
  }
  
  demoOctaveDown() {
    this.processor.enableEffect('pitchShift', true);
    this.processor.setPitchShift(0.5); // октава вниз
    console.log('Pitch shift: -1 octave');
  }
  
  // Bass boost
  demoBassBoost() {
    this.processor.enableEffect('bassBoost', true);
    this.processor.setBassBoost(10); // +10 dB
    console.log('Bass boost: +10 dB');
  }
  
  // Lo-Fi эффект
  demoLoFi() {
    this.processor.enableEffect('loFi', true);
    this.processor.setLoFiSettings(8, 4); // 8-bit, 4x downsample
    console.log('Lo-fi: 8-bit, 4x downsample');
  }
  
  // EQ пресеты
  demoRockEq() {
    this.processor.enableEffect('eq', true);
    this.processor.setEqPreset('rock');
    console.log('EQ: Rock preset applied');
  }
  
  demoPopEq() {
    this.processor.enableEffect('eq', true);
    this.processor.setEqPreset('pop');
    console.log('EQ: Pop preset applied');
  }
  
  // Анимированные эффекты
  demoSweepPitch() {
    this.processor.enableEffect('pitchShift', true);
    
    // Анимация от 0.5x до 2.0x за 4 секунды
    this.processor.animateParameter('pitchShift', 0.5, 0.1);
    
    setTimeout(() => {
      this.processor.animateParameter('pitchShift', 2.0, 4.0, 'exponential');
    }, 100);
    
    setTimeout(() => {
      this.processor.animateParameter('pitchShift', 1.0, 2.0, 'linear');
    }, 4200);
    
    console.log('Pitch sweep animation started');
  }
  
  // Сброс всех эффектов
  resetEffects() {
    this.processor.resetAllEffects();
    this.processor.setPitchShift(1.0);
    this.processor.setBassBoost(0.0);
    this.processor.setLoFiSettings(16, 1);
    this.processor.setEqPreset('flat');
    console.log('All effects reset');
  }
  
  /**
   * Мониторинг в реальном времени
   */
  startParameterMonitoring() {
    setInterval(() => {
      const values = this.processor.getAllParameterValues();
      this.updateParameterDisplay(values);
    }, 100);
  }
  
  updateParameterDisplay(values) {
    // Обновляем UI с текущими значениями параметров
    const display = document.getElementById('parameter-display');
    if (display) {
      display.innerHTML = `
        <div>Pitch: ${values.pitchShift?.toFixed(2) || 'N/A'}</div>
        <div>Bass: ${values.bassBoost?.toFixed(1) || 'N/A'} dB</div>
        <div>Lo-fi Bits: ${values.loFiBitDepth?.toFixed(0) || 'N/A'}</div>
        <div>EQ 1kHz: ${values.eq_1khz?.toFixed(1) || 'N/A'} dB</div>
      `;
    }
  }
  
  updateUI(effect, enabled) {
    // Обновляем состояние UI элементов
    const checkbox = document.getElementById(`${effect}-checkbox`);
    if (checkbox) {
      checkbox.checked = enabled;
    }
  }
  
  /**
   * Обработка ошибок и диагностика
   */
  async runDiagnostics() {
    console.log('Running diagnostics...');
    
    try {
      // Проверяем статус процессора
      const status = await this.processor.getStatus();
      console.log('Processor status:', status);
      
      // Проверяем значения параметров
      const params = this.processor.getAllParameterValues();
      console.log('Current parameters:', params);
      
      // Проверяем AudioContext
      console.log('AudioContext state:', this.audioContext.state);
      console.log('Sample rate:', this.audioContext.sampleRate);
      
    } catch (error) {
      console.error('Diagnostics failed:', error);
    }
  }
  
  /**
   * Очистка ресурсов
   */
  destroy() {
    this.stop();
    
    if (this.processor) {
      this.processor.destroy();
    }
    
    if (this.audioContext) {
      this.audioContext.close();
    }
    
    console.log('Demo destroyed');
  }
}

// Экспорт для использования в HTML
window.AudioEffectsDemo = AudioEffectsDemo;

// Пример инициализации
export async function initDemo() {
  const demo = new AudioEffectsDemo();
  
  try {
    await demo.initialize();
    
    // Создаем тестовый тон
    demo.createTestTone(440);
    
    // Запускаем мониторинг
    demo.startParameterMonitoring();
    
    return demo;
    
  } catch (error) {
    console.error('Failed to initialize demo:', error);
    throw error;
  }
}