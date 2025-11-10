/**
 * Менеджер аудиопроцессора - управляет жизненным циклом AudioWorkletNode
 * и обеспечивает интерфейс для GUI приложения
 */

import { WasmLoader, WasmMemoryHelper } from './wasm-loader.js';

export class AudioProcessorManager {
  constructor() {
    this.audioContext = null;
    this.workletNode = null;
    this.wasmModule = null;
    this.isInitialized = false;
    this.messageHandlers = new Map();
    
    // Конфигурация по умолчанию
    this.config = {
      bufferSize: 128,
      wasmPath: './dist/audio_effects.wasm',
      workletPath: './dist/audio-worklet-processor.js'
    };
  }
  
  /**
   * Инициализация аудиопроцессора
   */
  async initialize(audioContext, options = {}) {
    try {
      this.audioContext = audioContext;
      this.config = { ...this.config, ...options };
      
      console.log('Initializing AudioProcessorManager...');
      
      // 1. Загружаем WASM модуль
      await this.loadWasmModule();
      
      // 2. Регистрируем AudioWorklet
      await this.registerAudioWorklet();
      
      // 3. Создаем AudioWorkletNode
      this.createWorkletNode();
      
      // 4. Настраиваем обработку сообщений
      this.setupMessageHandling();
      
      this.isInitialized = true;
      console.log('AudioProcessorManager initialized successfully');
      
      return this.workletNode;
      
    } catch (error) {
      console.error('Failed to initialize AudioProcessorManager:', error);
      throw error;
    }
  }
  
  async loadWasmModule() {
    console.log('Loading WASM module...');
    this.wasmModule = await WasmLoader.loadModule(this.config.wasmPath);
    console.log('WASM module loaded');
  }
  
  async registerAudioWorklet() {
    console.log('Registering AudioWorklet...');
    await this.audioContext.audioWorklet.addModule(this.config.workletPath);
    console.log('AudioWorklet registered');
  }
  
  createWorkletNode() {
    console.log('Creating AudioWorkletNode...');
    
    this.workletNode = new AudioWorkletNode(
      this.audioContext, 
      'audio-effects-processor',
      {
        numberOfInputs: 1,
        numberOfOutputs: 1,
        processorOptions: {
          wasmModule: this.wasmModule,
          sampleRate: this.audioContext.sampleRate,
          bufferSize: this.config.bufferSize
        }
      }
    );
    
    console.log('AudioWorkletNode created');
  }
  
  setupMessageHandling() {
    this.workletNode.port.onmessage = (event) => {
      const { type, ...data } = event.data;
      
      if (this.messageHandlers.has(type)) {
        this.messageHandlers.get(type)(data);
      } else {
        console.log('Received message from worklet:', event.data);
      }
    };
  }
  
  /**
   * Подключение к аудиографу
   */
  connect(destination) {
    if (!this.workletNode) {
      throw new Error('WorkletNode not initialized');
    }
    return this.workletNode.connect(destination);
  }
  
  disconnect() {
    if (this.workletNode) {
      this.workletNode.disconnect();
    }
  }
  
  /**
   * Управление эффектами
   */
  enableEffect(effectName, enabled = true) {
    this.sendMessage('enable_effect', {
      effect: effectName,
      enabled: enabled
    });
  }
  
  disableEffect(effectName) {
    this.enableEffect(effectName, false);
  }
  
  setEffectsChain(effectsConfig) {
    this.sendMessage('set_effects_chain', effectsConfig);
  }
  
  resetAllEffects() {
    this.sendMessage('reset_effects');
  }
  
  /**
   * Управление параметрами эффектов
   */
  setPitchShift(factor) {
    if (factor < 0.25 || factor > 4.0) {
      console.warn('Pitch shift factor should be between 0.25 and 4.0');
      factor = Math.max(0.25, Math.min(4.0, factor));
    }
    
    const param = this.workletNode.parameters.get('pitchShift');
    if (param) {
      param.setValueAtTime(factor, this.audioContext.currentTime);
    }
  }
  
  setBassBoost(boostDb) {
    if (boostDb < -20 || boostDb > 20) {
      console.warn('Bass boost should be between -20 and 20 dB');
      boostDb = Math.max(-20, Math.min(20, boostDb));
    }
    
    const param = this.workletNode.parameters.get('bassBoost');
    if (param) {
      param.setValueAtTime(boostDb, this.audioContext.currentTime);
    }
  }
  
  setLoFiSettings(bitDepth, downsampleFactor) {
    if (bitDepth < 4 || bitDepth > 16) {
      console.warn('Bit depth should be between 4 and 16');
      bitDepth = Math.max(4, Math.min(16, bitDepth));
    }
    
    if (downsampleFactor < 1 || downsampleFactor > 8) {
      console.warn('Downsample factor should be between 1 and 8');
      downsampleFactor = Math.max(1, Math.min(8, downsampleFactor));
    }
    
    const bitDepthParam = this.workletNode.parameters.get('loFiBitDepth');
    const downsampleParam = this.workletNode.parameters.get('loFiDownsample');
    
    if (bitDepthParam) {
      bitDepthParam.setValueAtTime(bitDepth, this.audioContext.currentTime);
    }
    
    if (downsampleParam) {
      downsampleParam.setValueAtTime(downsampleFactor, this.audioContext.currentTime);
    }
  }
  
  setEqBand(frequency, gainDb) {
    const freqMap = {
      100: 'eq_100hz',
      250: 'eq_250hz', 
      500: 'eq_500hz',
      1000: 'eq_1khz',
      2000: 'eq_2khz',
      4000: 'eq_4khz',
      8000: 'eq_8khz'
    };
    
    const paramName = freqMap[frequency];
    if (!paramName) {
      console.warn('Invalid EQ frequency. Supported: 100, 250, 500, 1000, 2000, 4000, 8000 Hz');
      return;
    }
    
    if (gainDb < -15 || gainDb > 15) {
      console.warn('EQ gain should be between -15 and 15 dB');
      gainDb = Math.max(-15, Math.min(15, gainDb));
    }
    
    const param = this.workletNode.parameters.get(paramName);
    if (param) {
      param.setValueAtTime(gainDb, this.audioContext.currentTime);
    }
  }
  
  setEqPreset(preset) {
    const presets = {
      flat: { 100: 0, 250: 0, 500: 0, 1000: 0, 2000: 0, 4000: 0, 8000: 0 },
      rock: { 100: 4, 250: 2, 500: -1, 1000: -2, 2000: 1, 4000: 3, 8000: 5 },
      pop: { 100: 2, 250: 3, 500: 1, 1000: 0, 2000: 2, 4000: 3, 8000: 3 },
      jazz: { 100: 3, 250: 1, 500: 0, 1000: 1, 2000: 2, 4000: 1, 8000: 2 },
      classical: { 100: 2, 250: 0, 500: 0, 1000: 0, 2000: 1, 4000: 2, 8000: 3 },
      electronic: { 100: 5, 250: 2, 500: -1, 1000: 0, 2000: 2, 4000: 4, 8000: 6 }
    };
    
    const eqSettings = presets[preset];
    if (!eqSettings) {
      console.warn('Unknown EQ preset:', preset);
      return;
    }
    
    Object.entries(eqSettings).forEach(([freq, gain]) => {
      this.setEqBand(parseInt(freq), gain);
    });
  }
  
  /**
   * Анимация параметров
   */
  animateParameter(paramName, targetValue, duration = 1.0, curve = 'linear') {
    const param = this.workletNode.parameters.get(paramName);
    if (!param) {
      console.warn('Parameter not found:', paramName);
      return;
    }
    
    const currentTime = this.audioContext.currentTime;
    const endTime = currentTime + duration;
    
    switch (curve) {
      case 'exponential':
        param.exponentialRampToValueAtTime(targetValue, endTime);
        break;
      case 'linear':
      default:
        param.linearRampToValueAtTime(targetValue, endTime);
        break;
    }
  }
  
  /**
   * Получение текущих значений параметров
   */
  getParameterValue(paramName) {
    const param = this.workletNode.parameters.get(paramName);
    return param ? param.value : null;
  }
  
  getAllParameterValues() {
    const values = {};
    if (this.workletNode) {
      for (const [name, param] of this.workletNode.parameters.entries()) {
        values[name] = param.value;
      }
    }
    return values;
  }
  
  /**
   * Управление сообщениями
   */
  sendMessage(type, data = {}) {
    if (!this.workletNode) {
      console.warn('WorkletNode not available');
      return;
    }
    
    this.workletNode.port.postMessage({ type, ...data });
  }
  
  onMessage(type, handler) {
    this.messageHandlers.set(type, handler);
  }
  
  offMessage(type) {
    this.messageHandlers.delete(type);
  }
  
  /**
   * Диагностика и мониторинг
   */
  async getStatus() {
    return new Promise((resolve) => {
      this.onMessage('status_response', (data) => {
        this.offMessage('status_response');
        resolve(data);
      });
      
      this.sendMessage('get_status');
      
      // Timeout через 1 секунду
      setTimeout(() => {
        this.offMessage('status_response');
        resolve(null);
      }, 1000);
    });
  }
  
  /**
   * Очистка ресурсов
   */
  destroy() {
    if (this.workletNode) {
      this.workletNode.disconnect();
      this.workletNode = null;
    }
    
    this.messageHandlers.clear();
    this.audioContext = null;
    this.wasmModule = null;
    this.isInitialized = false;
    
    console.log('AudioProcessorManager destroyed');
  }
}

/**
 * Фабричная функция для создания менеджера
 */
export async function createAudioProcessor(audioContext, options = {}) {
  const manager = new AudioProcessorManager();
  await manager.initialize(audioContext, options);
  return manager;
}