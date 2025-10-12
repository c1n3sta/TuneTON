/**
 * WASM Module Loader
 * Загружает и инициализирует WASM модуль в основном потоке
 */

let wasmModule = null;
let wasmInitialized = false;

export class WasmLoader {
  static async loadModule(wasmPath) {
    if (wasmInitialized && wasmModule) {
      return wasmModule;
    }

    try {
      console.log('Loading WASM module from:', wasmPath);
      
      // Загрузка WASM файла
      const response = await fetch(wasmPath);
      if (!response.ok) {
        throw new Error(`Failed to fetch WASM: ${response.status} ${response.statusText}`);
      }
      
      const wasmBytes = await response.arrayBuffer();
      console.log('WASM bytes loaded:', wasmBytes.byteLength);
      
      // Компиляция и инстанцирование WASM модуля
      const wasmResult = await WebAssembly.instantiate(wasmBytes, {
        env: {
          // Здесь можно добавить импорты для WASM, если нужны
        }
      });
      
      wasmModule = {
        instance: wasmResult.instance,
        module: wasmResult.module,
        exports: wasmResult.instance.exports
      };
      
      wasmInitialized = true;
      console.log('WASM module loaded successfully');
      console.log('Available exports:', Object.keys(wasmModule.exports));
      
      return wasmModule;
      
    } catch (error) {
      console.error('Failed to load WASM module:', error);
      throw error;
    }
  }
  
  static getModule() {
    if (!wasmInitialized || !wasmModule) {
      throw new Error('WASM module not loaded. Call loadModule() first.');
    }
    return wasmModule;
  }
  
  static isLoaded() {
    return wasmInitialized && wasmModule !== null;
  }
  
  static getMemoryBuffer() {
    if (!wasmModule) {
      throw new Error('WASM module not loaded');
    }
    return wasmModule.exports.memory.buffer;
  }
}

/**
 * Вспомогательные функции для работы с WASM памятью
 */
export class WasmMemoryHelper {
  static createFloat32View(pointer, length) {
    const buffer = WasmLoader.getMemoryBuffer();
    return new Float32Array(buffer, pointer, length);
  }
  
  static createUint8View(pointer, length) {
    const buffer = WasmLoader.getMemoryBuffer();
    return new Uint8Array(buffer, pointer, length);
  }
  
  static copyToWasm(wasmView, jsArray) {
    if (wasmView.length !== jsArray.length) {
      throw new Error(`Array length mismatch: WASM(${wasmView.length}) vs JS(${jsArray.length})`);
    }
    wasmView.set(jsArray);
  }
  
  static copyFromWasm(wasmView, jsArray) {
    if (wasmView.length !== jsArray.length) {
      throw new Error(`Array length mismatch: WASM(${wasmView.length}) vs JS(${jsArray.length})`);
    }
    jsArray.set(wasmView);
  }
}