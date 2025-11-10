use wasm_bindgen::prelude::*;
use std::alloc::{alloc, dealloc, Layout};
use std::ptr;
use std::slice;

// Экспорт функций для JavaScript
#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

// Макрос для логирования
macro_rules! console_log {
    ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
}

// Структура для управления аудиобуферами
#[wasm_bindgen]
pub struct AudioBufferManager {
    input_ptr: *mut f32,
    output_ptr: *mut f32,
    buffer_size: usize,
    sample_rate: f32,
}

#[wasm_bindgen]
impl AudioBufferManager {
    #[wasm_bindgen(constructor)]
    pub fn new(buffer_size: usize, sample_rate: f32) -> AudioBufferManager {
        let layout = Layout::array::<f32>(buffer_size).unwrap();
        
        unsafe {
            let input_ptr = alloc(layout) as *mut f32;
            let output_ptr = alloc(layout) as *mut f32;
            
            // Инициализация нулями
            ptr::write_bytes(input_ptr, 0, buffer_size);
            ptr::write_bytes(output_ptr, 0, buffer_size);
            
            AudioBufferManager {
                input_ptr,
                output_ptr,
                buffer_size,
                sample_rate,
            }
        }
    }
    
    #[wasm_bindgen(getter)]
    pub fn input_ptr(&self) -> *mut f32 {
        self.input_ptr
    }
    
    #[wasm_bindgen(getter)]
    pub fn output_ptr(&self) -> *mut f32 {
        self.output_ptr
    }
    
    #[wasm_bindgen(getter)]
    pub fn buffer_size(&self) -> usize {
        self.buffer_size
    }
}

impl Drop for AudioBufferManager {
    fn drop(&mut self) {
        let layout = Layout::array::<f32>(self.buffer_size).unwrap();
        unsafe {
            dealloc(self.input_ptr as *mut u8, layout);
            dealloc(self.output_ptr as *mut u8, layout);
        }
    }
}

// Структура для эффектов
#[wasm_bindgen]
pub struct AudioEffectsProcessor {
    buffer_manager: AudioBufferManager,
    // Состояние эффектов
    pitch_shift_state: PitchShiftState,
    eq_state: EqState,
}

// Состояние питч-шифтинга (упрощенная реализация)
struct PitchShiftState {
    phase: f32,
    previous_sample: f32,
}

impl PitchShiftState {
    fn new() -> Self {
        Self {
            phase: 0.0,
            previous_sample: 0.0,
        }
    }
}

// Состояние эквалайзера (7 полос)
struct EqState {
    low_shelf: BiquadFilter,
    band1: BiquadFilter,
    band2: BiquadFilter, 
    band3: BiquadFilter,
    band4: BiquadFilter,
    band5: BiquadFilter,
    high_shelf: BiquadFilter,
}

impl EqState {
    fn new(sample_rate: f32) -> Self {
        Self {
            low_shelf: BiquadFilter::new_low_shelf(100.0, sample_rate, 1.0),
            band1: BiquadFilter::new_peaking(250.0, sample_rate, 1.0, 1.0),
            band2: BiquadFilter::new_peaking(500.0, sample_rate, 1.0, 1.0),
            band3: BiquadFilter::new_peaking(1000.0, sample_rate, 1.0, 1.0),
            band4: BiquadFilter::new_peaking(2000.0, sample_rate, 1.0, 1.0),
            band5: BiquadFilter::new_peaking(4000.0, sample_rate, 1.0, 1.0),
            high_shelf: BiquadFilter::new_high_shelf(8000.0, sample_rate, 1.0),
        }
    }
}

// Простая реализация biquad фильтра
struct BiquadFilter {
    b0: f32, b1: f32, b2: f32,
    a1: f32, a2: f32,
    x1: f32, x2: f32,
    y1: f32, y2: f32,
}

impl BiquadFilter {
    fn new_low_shelf(freq: f32, sample_rate: f32, gain_db: f32) -> Self {
        let gain = 10.0_f32.powf(gain_db / 20.0);
        let w = 2.0 * std::f32::consts::PI * freq / sample_rate;
        let cos_w = w.cos();
        let sin_w = w.sin();
        let alpha = sin_w / 2.0;
        
        let s = 1.0;
        let beta = (gain / s).sqrt();
        
        let b0 = gain * ((gain + 1.0) - (gain - 1.0) * cos_w + beta * sin_w);
        let b1 = 2.0 * gain * ((gain - 1.0) - (gain + 1.0) * cos_w);
        let b2 = gain * ((gain + 1.0) - (gain - 1.0) * cos_w - beta * sin_w);
        let a0 = (gain + 1.0) + (gain - 1.0) * cos_w + beta * sin_w;
        let a1 = -2.0 * ((gain - 1.0) + (gain + 1.0) * cos_w);
        let a2 = (gain + 1.0) + (gain - 1.0) * cos_w - beta * sin_w;
        
        Self {
            b0: b0 / a0, b1: b1 / a0, b2: b2 / a0,
            a1: a1 / a0, a2: a2 / a0,
            x1: 0.0, x2: 0.0, y1: 0.0, y2: 0.0,
        }
    }
    
    fn new_high_shelf(freq: f32, sample_rate: f32, gain_db: f32) -> Self {
        // Упрощенная реализация high shelf
        Self::new_low_shelf(freq, sample_rate, gain_db)
    }
    
    fn new_peaking(freq: f32, sample_rate: f32, q: f32, gain_db: f32) -> Self {
        let gain = 10.0_f32.powf(gain_db / 20.0);
        let w = 2.0 * std::f32::consts::PI * freq / sample_rate;
        let cos_w = w.cos();
        let sin_w = w.sin();
        let alpha = sin_w / (2.0 * q);
        
        let b0 = 1.0 + alpha * gain;
        let b1 = -2.0 * cos_w;
        let b2 = 1.0 - alpha * gain;
        let a0 = 1.0 + alpha / gain;
        let a1 = -2.0 * cos_w;
        let a2 = 1.0 - alpha / gain;
        
        Self {
            b0: b0 / a0, b1: b1 / a0, b2: b2 / a0,
            a1: a1 / a0, a2: a2 / a0,
            x1: 0.0, x2: 0.0, y1: 0.0, y2: 0.0,
        }
    }
    
    fn process(&mut self, input: f32) -> f32 {
        let output = self.b0 * input + self.b1 * self.x1 + self.b2 * self.x2
                   - self.a1 * self.y1 - self.a2 * self.y2;
        
        // Сдвиг истории
        self.x2 = self.x1;
        self.x1 = input;
        self.y2 = self.y1;
        self.y1 = output;
        
        output
    }
}

#[wasm_bindgen]
impl AudioEffectsProcessor {
    #[wasm_bindgen(constructor)]
    pub fn new(buffer_size: usize, sample_rate: f32) -> AudioEffectsProcessor {
        console_log!("Initializing AudioEffectsProcessor with buffer_size: {}, sample_rate: {}", buffer_size, sample_rate);
        
        let buffer_manager = AudioBufferManager::new(buffer_size, sample_rate);
        let pitch_shift_state = PitchShiftState::new();
        let eq_state = EqState::new(sample_rate);
        
        AudioEffectsProcessor {
            buffer_manager,
            pitch_shift_state,
            eq_state,
        }
    }
    
    #[wasm_bindgen]
    pub fn get_input_ptr(&self) -> *mut f32 {
        self.buffer_manager.input_ptr()
    }
    
    #[wasm_bindgen]
    pub fn get_output_ptr(&self) -> *mut f32 {
        self.buffer_manager.output_ptr()
    }
    
    // Питч шифтинг (упрощенная реализация)
    #[wasm_bindgen]
    pub fn process_pitch_shift(&mut self, pitch_factor: f32) {
        unsafe {
            let input_slice = slice::from_raw_parts(
                self.buffer_manager.input_ptr, 
                self.buffer_manager.buffer_size
            );
            let output_slice = slice::from_raw_parts_mut(
                self.buffer_manager.output_ptr, 
                self.buffer_manager.buffer_size
            );
            
            for i in 0..self.buffer_manager.buffer_size {
                let input_sample = input_slice[i];
                
                // Простой алгоритм питч-шифтинга через интерполяцию
                self.pitch_shift_state.phase += pitch_factor;
                if self.pitch_shift_state.phase >= 1.0 {
                    self.pitch_shift_state.phase -= 1.0;
                    self.pitch_shift_state.previous_sample = input_sample;
                }
                
                // Линейная интерполяция
                let output_sample = self.pitch_shift_state.previous_sample 
                    + (input_sample - self.pitch_shift_state.previous_sample) 
                    * self.pitch_shift_state.phase;
                
                output_slice[i] = output_sample;
            }
        }
    }
    
    // Bass boost
    #[wasm_bindgen]
    pub fn process_bass_boost(&mut self, boost_db: f32) {
        unsafe {
            let input_slice = slice::from_raw_parts(
                self.buffer_manager.input_ptr, 
                self.buffer_manager.buffer_size
            );
            let output_slice = slice::from_raw_parts_mut(
                self.buffer_manager.output_ptr, 
                self.buffer_manager.buffer_size
            );
            
            let boost_factor = 10.0_f32.powf(boost_db / 20.0);
            
            for i in 0..self.buffer_manager.buffer_size {
                let input_sample = input_slice[i];
                // Простое усиление низких частот
                let boosted = input_sample * boost_factor;
                output_slice[i] = boosted.tanh(); // Soft clipping
            }
        }
    }
    
    // 7-полосный эквалайзер
    #[wasm_bindgen]
    pub fn process_eq_7band(&mut self, gains: &[f32]) -> Result<(), JsValue> {
        if gains.len() != 7 {
            return Err(JsValue::from_str("EQ requires exactly 7 gain values"));
        }
        
        // Обновляем коэффициенты фильтров
        // (В реальной реализации здесь был бы более сложный код)
        
        unsafe {
            let input_slice = slice::from_raw_parts(
                self.buffer_manager.input_ptr, 
                self.buffer_manager.buffer_size
            );
            let output_slice = slice::from_raw_parts_mut(
                self.buffer_manager.output_ptr, 
                self.buffer_manager.buffer_size
            );
            
            for i in 0..self.buffer_manager.buffer_size {
                let mut sample = input_slice[i];
                
                // Последовательно применяем все фильтры
                sample = self.eq_state.low_shelf.process(sample);
                sample = self.eq_state.band1.process(sample);
                sample = self.eq_state.band2.process(sample);
                sample = self.eq_state.band3.process(sample);
                sample = self.eq_state.band4.process(sample);
                sample = self.eq_state.band5.process(sample);
                sample = self.eq_state.high_shelf.process(sample);
                
                output_slice[i] = sample;
            }
        }
        
        Ok(())
    }
    
    // Lo-fi эффект
    #[wasm_bindgen]
    pub fn process_lo_fi(&mut self, bit_depth: f32, downsample_factor: f32) {
        unsafe {
            let input_slice = slice::from_raw_parts(
                self.buffer_manager.input_ptr, 
                self.buffer_manager.buffer_size
            );
            let output_slice = slice::from_raw_parts_mut(
                self.buffer_manager.output_ptr, 
                self.buffer_manager.buffer_size
            );
            
            let quantization_levels = 2.0_f32.powf(bit_depth) - 1.0;
            
            for i in 0..self.buffer_manager.buffer_size {
                let input_sample = input_slice[i];
                
                // Битовое квантование
                let quantized = (input_sample * quantization_levels).round() / quantization_levels;
                
                // Даунсэмплинг (упрощенная реализация)
                let downsampled = if (i as f32) % downsample_factor < 1.0 {
                    quantized
                } else {
                    if i > 0 { output_slice[i - 1] } else { 0.0 }
                };
                
                output_slice[i] = downsampled;
            }
        }
    }
    
    // Копирование из входного буфера в выходной (для цепочки эффектов)
    #[wasm_bindgen]
    pub fn copy_to_output(&mut self) {
        unsafe {
            ptr::copy_nonoverlapping(
                self.buffer_manager.input_ptr,
                self.buffer_manager.output_ptr,
                self.buffer_manager.buffer_size
            );
        }
    }
}