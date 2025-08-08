/*
  Minimal granular pitch shifter AudioWorkletProcessor (WSOLA-inspired stub)
  - Parameter: semitones (-12..+12)
  - windowSize: seconds (0.06..0.24)
  - crossfade: 0..1
  NOTE: This is a starting point; further refinement (dynamic correlation match, adaptive window) will improve quality.
*/

class WsolaPitchShifterProcessor extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [
      { name: 'semitones', defaultValue: 0, minValue: -12, maxValue: 12, automationRate: 'k-rate' },
      { name: 'windowSize', defaultValue: 0.16, minValue: 0.06, maxValue: 0.24, automationRate: 'k-rate' },
      { name: 'crossfade', defaultValue: 0.5, minValue: 0.0, maxValue: 1.0, automationRate: 'k-rate' },
    ];
  }

  constructor() {
    super();
    this.sampleRate_ = sampleRate;
    this.bufferL = new Float32Array(this.sampleRate_ * 2);
    this.bufferR = new Float32Array(this.sampleRate_ * 2);
    this.writeIndex = 0;
    this.readPhase = 0;
    this.prevGrainStart = 0;
    this.window = null;
    this.windowSizeSamples = Math.floor(0.16 * this.sampleRate_);
    this.overlapSamples = Math.floor(this.windowSizeSamples * 0.5);
  }

  updateWindow(size) {
    const N = Math.max(32, Math.min(this.bufferL.length >> 1, size));
    if (this.window && this.window.length === N) return;
    this.windowSizeSamples = N;
    this.overlapSamples = Math.max(8, Math.floor(N * 0.5));
    this.window = new Float32Array(N);
    for (let n = 0; n < N; n++) {
      // Hann
      this.window[n] = 0.5 * (1 - Math.cos((2 * Math.PI * n) / (N - 1)));
    }
  }

  writeInputToRing(inputL, inputR) {
    const len = inputL.length;
    const size = this.bufferL.length;
    for (let i = 0; i < len; i++) {
      this.bufferL[this.writeIndex] = inputL[i];
      this.bufferR[this.writeIndex] = inputR ? inputR[i] : inputL[i];
      this.writeIndex = (this.writeIndex + 1) % size;
    }
  }

  readFromRing(idx) {
    const size = this.bufferL.length;
    const i0 = Math.floor(idx) % size;
    const frac = idx - Math.floor(idx);
    const i1 = (i0 + 1) % size;
    const l = this.bufferL[i0] * (1 - frac) + this.bufferL[i1] * frac;
    const r = this.bufferR[i0] * (1 - frac) + this.bufferR[i1] * frac;
    return [l, r];
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    const output = outputs[0];
    const inL = input[0] || new Float32Array(outputs[0][0].length);
    const inR = input[1] || null;
    const outL = output[0];
    const outR = output[1] || output[0];

    const semis = parameters.semitones.length ? parameters.semitones[0] : 0;
    const ratio = Math.pow(2, semis / 12);
    const wSizeSec = parameters.windowSize.length ? parameters.windowSize[0] : 0.16;
    const crossfade = parameters.crossfade.length ? parameters.crossfade[0] : 0.5;

    this.updateWindow(Math.floor(wSizeSec * this.sampleRate_));

    // Write input into ring buffer
    this.writeInputToRing(inL, inR);

    // Simple granular approach:
    // - Advance readPhase by ratio but keep output frame count constant
    // - Use two overlapping grains crossfaded to reduce discontinuity
    const N = outL.length;
    const grainSize = this.windowSizeSamples;
    const hop = Math.max(8, Math.floor((1 - crossfade) * grainSize));
    let phase = this.readPhase;

    for (let n = 0; n < N; n++) {
      const p0 = phase;
      const p1 = phase + grainSize * 0.5; // secondary grain offset

      const wIdx = n % grainSize;
      const w = this.window[wIdx];
      const w2 = this.window[(wIdx + (grainSize >> 1)) % grainSize];

      const [l0, r0] = this.readFromRing(p0);
      const [l1, r1] = this.readFromRing(p1);

      const l = l0 * w + l1 * w2;
      const r = r0 * w + r1 * w2;

      outL[n] = l;
      outR[n] = r;

      phase += ratio; // pitch change via resampling of read head

      // Periodically realign grain to keep output time consistent
      if ((n % hop) === 0) {
        // Keep phase within ring range
        const size = this.bufferL.length;
        if (phase >= size) phase -= size;
        if (phase < 0) phase += size;
      }
    }

    // Update read position such that average output equals input frames
    this.readPhase = (this.readPhase + N) % this.bufferL.length;

    return true;
  }
}

registerProcessor('wsola-pitch', WsolaPitchShifterProcessor);


