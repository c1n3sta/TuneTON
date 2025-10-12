/**
 * AudioWorkletProcessor для обработки аудио с WASM эффектами
 * Этот файл выполняется в AudioWorkletGlobalScope
 */

class AudioEffectsProcessor extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [
      {
        name: 'pitchShift',
        defaultValue: 1.0,
        minValue: 0.25,
        maxValue: 4.0,
        automationRate: 'a-rate'
      },
      {
        name: 'bassBoost',
        defaultValue: 0.0,
        minValue: -20.0,
        maxValue: 20.0,
        automationRate: 'a-rate'
      },
      {
        name: 'loFiBitDepth',
        defaultValue: 16.0,
        minValue: 4.0,
        maxValue: 16.0,
        automationRate: 'k-rate'
      },
      {
        name: 'loFiDownsample',
        defaultValue: 1.0,
        minValue: 1.0,
        maxValue: 8.0,
        automationRate: 'k-rate'
      },
      // EQ параметры (7 полос)
      {
        name: 'eq_100hz',
        defaultValue: 0.0,
        minValue: -15.0,
        maxValue: 15.0,
        automationRate: 'k-rate'
      },
      {
        name: 'eq_250hz',
        defaultValue: 0.0,
        minValue: -15.0,
        maxValue: 15.0,
        automationRate: 'k-rate'
      },
      {
        name: 'eq_500hz',
        defaultValue: 0.0,
        minValue: -15.0,
        maxValue: 15.0,
        automationRate: 'k-rate'
      },
      {
        name: 'eq_1khz',
        defaultValue: 0.0,
        minValue: -15.0,
        maxValue: 15.0,
        automationRate: 'k-rate'
      },
      {
        name: 'eq_2khz',
        defaultValue: 0.0,
        minValue: -15.0,
        maxValue: 15.0,
        automationRate: 'k-rate'
      },
      {
        name: 'eq_4khz',
        defaultValue: 0.0,
        minValue: -15.0,
        maxValue: 15.0,
        automationRate: 'k-rate'
      },
      {
        name: 'eq_8khz',
        defaultValue: 0.0,
        minValue: -15.0,
        maxValue: 15.0,
        automationRate: 'k-rate'
      }
    ];
  }

  constructor(options) {
    super();
    
    // Получаем WASM модуль из processorOptions
    if (!options.processorOptions || !options.processorOptions.wasmModule) {
      throw new Error('WASM module not provided in processorOptions');
    }
    
    this.wasm = options.processorOptions.wasmModule;
    this.sampleRate = options.processorOptions.sampleRate || sampleRate;
    this.bufferSize = 128; // Стандартный размер буфера для AudioWorklet
    
    console.log('AudioWorkletProcessor initialized with sample rate:', this.sampleRate);
    
    // Инициализация WASM процессора эффектов
    this.initializeWasmProcessor();
    
    // Настройка обработки сообщений
    this.port.onmessage = this.handleMessage.bind(this);
    
    // Состояние эффектов
    this.effectsChain = {
      pitchShift: false,
      bassBoost: false,
      loFi: false,
      eq: false
    };
    
    console.log('AudioWorkletProcessor ready');
  }
  
  initializeWasmProcessor() {
    try {
      // Создаем экземпляр WASM процессора эффектов
      const wasmConstructor = this.wasm.exports.AudioEffectsProcessor;
      if (!wasmConstructor) {
        throw new Error('AudioEffectsProcessor constructor not found in WASM exports');
      }
      
      this.wasmProcessor = new wasmConstructor(this.bufferSize, this.sampleRate);
      
      // Получаем указатели на буферы
      this.inputPtr = this.wasmProcessor.get_input_ptr();
      this.outputPtr = this.wasmProcessor.get_output_ptr();
      
      // Создаем типизированные массивы для работы с WASM памятью
      this.wasmInputBuffer = new Float32Array(
        this.wasm.exports.memory.buffer,
        this.inputPtr,
        this.bufferSize
      );
      
      this.wasmOutputBuffer = new Float32Array(
        this.wasm.exports.memory.buffer,
        this.outputPtr,
        this.bufferSize
      );
      
      console.log('WASM processor initialized successfully');
      console.log('Input buffer pointer:', this.inputPtr);
      console.log('Output buffer pointer:', this.outputPtr);
      
    } catch (error) {
      console.error('Failed to initialize WASM processor:', error);
      throw error;
    }
  }
  
  process(inputs, outputs, parameters) {
    const input = inputs[0];
    const output = outputs[0];
    
    // Проверяем наличие входного и выходного каналов
    if (!input || !input[0] || !output || !output[0]) {
      return true;
    }
    
    const inputChannel = input[0];
    const outputChannel = output[0];
    const bufferLength = inputChannel.length;
    
    try {
      // Проверяем, что WASM память еще валидна
      if (this.wasm.exports.memory.buffer !== this.wasmInputBuffer.buffer) {
        // Память была перераспределена, обновляем представления
        this.updateMemoryViews();
      }
      
      // Копируем входные данные в WASM буфер
      if (bufferLength <= this.bufferSize) {
        this.wasmInputBuffer.set(inputChannel.subarray(0, bufferLength));
        
        // Заполняем оставшуюся часть буфера нулями, если нужно
        if (bufferLength < this.bufferSize) {
          this.wasmInputBuffer.fill(0, bufferLength);
        }
      }
      
      // Применяем цепочку эффектов
      this.applyEffectsChain(parameters);
      
      // Копируем результат обратно в JavaScript
      outputChannel.set(this.wasmOutputBuffer.subarray(0, bufferLength));
      
    } catch (error) {
      console.error('Error in audio processing:', error);
      // В случае ошибки просто копируем вход в выход
      outputChannel.set(inputChannel);
    }
    
    return true;
  }
  
  updateMemoryViews() {
    this.wasmInputBuffer = new Float32Array(
      this.wasm.exports.memory.buffer,
      this.inputPtr,
      this.bufferSize
    );
    
    this.wasmOutputBuffer = new Float32Array(
      this.wasm.exports.memory.buffer,
      this.outputPtr,
      this.bufferSize
    );
  }
  
  applyEffectsChain(parameters) {
    // Начинаем с копирования входа в выход
    this.wasmProcessor.copy_to_output();
    
    // Применяем эффекты в определенном порядке
    
    // 1. EQ (применяется первым для формирования спектра)
    if (this.effectsChain.eq) {
      const eqGains = [
        parameters.eq_100hz[0],
        parameters.eq_250hz[0],
        parameters.eq_500hz[0],
        parameters.eq_1khz[0],
        parameters.eq_2khz[0],
        parameters.eq_4khz[0],
        parameters.eq_8khz[0]
      ];
      
      try {
        this.wasmProcessor.process_eq_7band(new Float32Array(eqGains));
        // Копируем результат EQ обратно во вход для следующего эффекта
        this.copyOutputToInput();
      } catch (error) {
        console.error('EQ processing error:', error);
      }
    }
    
    // 2. Bass Boost
    if (this.effectsChain.bassBoost) {
      const boostValue = parameters.bassBoost[0];
      if (Math.abs(boostValue) > 0.1) { // Применяем только если значение значимое
        this.wasmProcessor.process_bass_boost(boostValue);
        this.copyOutputToInput();
      }
    }
    
    // 3. Pitch Shift
    if (this.effectsChain.pitchShift) {
      const pitchFactor = parameters.pitchShift[0];
      if (Math.abs(pitchFactor - 1.0) > 0.01) { // Применяем только если отличается от 1.0
        this.wasmProcessor.process_pitch_shift(pitchFactor);
        this.copyOutputToInput();
      }
    }
    
    // 4. Lo-Fi (применяется последним для деградации сигнала)
    if (this.effectsChain.loFi) {
      const bitDepth = parameters.loFiBitDepth[0];
      const downsample = parameters.loFiDownsample[0];
      
      if (bitDepth < 16 || downsample > 1) {
        this.wasmProcessor.process_lo_fi(bitDepth, downsample);
        this.copyOutputToInput();
      }
    }
  }
  
  copyOutputToInput() {
    // Вспомогательный метод для цепочки эффектов
    // Копирует выходной буфер во входной для следующего эффекта
    const tempBuffer = new Float32Array(this.wasmOutputBuffer);
    this.wasmInputBuffer.set(tempBuffer);
  }
  
  handleMessage(event) {
    const { type, data } = event.data;
    
    switch (type) {
      case 'enable_effect':
        this.effectsChain[data.effect] = data.enabled;
        console.log(`Effect ${data.effect} ${data.enabled ? 'enabled' : 'disabled'}`);
        this.port.postMessage({
          type: 'effect_status',
          effect: data.effect,
          enabled: data.enabled
        });
        break;
        
      case 'set_effects_chain':
        this.effectsChain = { ...this.effectsChain, ...data };
        console.log('Effects chain updated:', this.effectsChain);
        break;
        
      case 'get_status':
        this.port.postMessage({
          type: 'status_response',
          effectsChain: this.effectsChain,
          sampleRate: this.sampleRate,
          bufferSize: this.bufferSize,
          wasmReady: !!this.wasmProcessor
        });
        break;
        
      case 'reset_effects':
        this.effectsChain = {
          pitchShift: false,
          bassBoost: false,
          loFi: false,
          eq: false
        };
        console.log('All effects reset');
        break;
        
      default:
        console.warn('Unknown message type:', type);
    }
  }
}

// Регистрируем процессор в AudioWorkletGlobalScope
registerProcessor('audio-effects-processor', AudioEffectsProcessor);