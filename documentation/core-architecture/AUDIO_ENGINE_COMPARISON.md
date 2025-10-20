# Audio Engine Implementation Comparison

## Overview

This document compares the different audio engine implementations across various versions of TuneTON to identify the best approaches for migration and future development.

## Version Comparison

### Current Version (src/core/audio/AudioEngine.ts)

**Key Features:**

1. Advanced effect bus architecture with dry/wet mixing
2. Support for HTMLMediaElement (better for streaming)
3. Comprehensive 7-band EQ implementation
4. Reverb system with convolution and presets
5. Lo-fi effects (tone, noise, wow/flutter)
6. Pitch shifting with Tone.js and experimental AudioWorklet support
7. Tempo/pitch decoupling
8. Low-pass tone control
9. Effect bypass/mix controls

**Architecture:**

- Modular effect chain: Source → TempoPitch → LoFi → EQ → Reverb → LowPass → Analyser → Master
- Each module has dry/wet mixing capabilities
- Supports both AudioBuffer and HTMLMediaElement sources
- Advanced pitch shifting with Tone.js fallback

### Other Version 2 (other version/2/src/core/audio/AudioEngine.ts)

**Key Features:**

1. Simple 3-band EQ implementation
2. Basic pitch/playback rate controls
3. AudioBuffer-only source support
4. Simple effect chain: Source → EQ → Analyser → Gain → Destination

**Architecture:**

- Linear effect chain without modular mixing
- No advanced effects (reverb, lo-fi, etc.)
- Simpler but less flexible implementation

### WASM Implementation (src/wasm/src/js/audio-worklet-processor.js)

**Key Features:**

1. WASM-based audio processing for performance
2. 7-band EQ with precise control
3. Bass boost effect
4. Lo-Fi effects (bit depth reduction, downsampling)
5. Pitch shifting
6. AudioWorklet-based processing

**Architecture:**

- Processes audio in AudioWorklet context
- Uses WASM for computationally intensive operations
- Message-based control system
- Effect chain with enable/disable controls

## Key Differences and Migration Opportunities

### 1. Effect Architecture

**Current Version:** Advanced modular architecture with dry/wet mixing for each effect
**Other Version 2:** Simple linear chain without mixing capabilities
**Migration Opportunity:** The current version's architecture is superior and should be maintained.

### 2. Source Support

**Current Version:** Supports both AudioBuffer and HTMLMediaElement
**Other Version 2:** AudioBuffer only
**Migration Opportunity:** Maintain HTMLMediaElement support for better streaming capabilities.

### 3. EQ Implementation

**Current Version:** 7-band EQ with comprehensive controls
**Other Version 2:** 3-band EQ with basic controls
**Migration Opportunity:** The 7-band EQ is significantly better and should be preserved.

### 4. Advanced Effects

**Current Version:** Reverb, lo-fi, low-pass, tempo/pitch decoupling
**Other Version 2:** No advanced effects
**Migration Opportunity:** All advanced effects should be maintained.

### 5. Pitch Shifting

**Current Version:** Multiple approaches (Tone.js, AudioWorklet, direct playbackRate)
**Other Version 2:** Basic playbackRate manipulation
**Migration Opportunity:** The multi-approach system is better and should be preserved.

### 6. WASM Integration

**Current Version:** Experimental AudioWorklet support
**Other Version 2:** No WASM support
**Migration Opportunity:** The WASM implementation provides performance benefits and should be integrated.

## Recommendations for Migration

### 1. Maintain Current Architecture

The current version's modular effect bus architecture is the most sophisticated and should be preserved.

### 2. Integrate WASM Performance Benefits

The WASM implementation provides significant performance improvements for computationally intensive operations:

- Use WASM for EQ processing
- Use WASM for pitch shifting when available
- Use WASM for lo-fi effects

### 3. Preserve HTMLMediaElement Support

The current version's support for HTMLMediaElement is important for streaming scenarios and should be maintained.

### 4. Enhance Effect Controls

The WASM implementation's message-based control system could be integrated to provide better runtime control of effects.

### 5. Optimize Pitch Shifting

Combine the current version's multi-approach system with the WASM implementation's performance:

- Use WASM for high-quality pitch shifting when available
- Fall back to Tone.js for compatibility
- Use direct playbackRate for simple cases

## Implementation Plan

### Phase 1: WASM Integration

1. Integrate WASM-based EQ processing into current AudioEngine
2. Add WASM-based pitch shifting as an option
3. Implement WASM-based lo-fi effects

### Phase 2: Control System Enhancement

1. Implement message-based control system from WASM version
2. Add runtime enable/disable for effects
3. Improve parameter automation

### Phase 3: Performance Optimization

1. Profile current implementation to identify bottlenecks
2. Replace bottleneck operations with WASM equivalents
3. Optimize memory usage and buffer management

## Conclusion

The current version has the most sophisticated audio engine implementation, but the WASM version provides important performance benefits. The migration should focus on integrating the performance benefits of the WASM implementation into the architectural framework of the current version.
