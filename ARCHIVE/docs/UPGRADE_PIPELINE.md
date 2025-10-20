## TuneTON MVP — Step-by-Step Upgrade Pipeline

This pipeline upgrades the current codebase to meet the `prompt` requirements. Each step lists scope, file touch‑points, acceptance criteria, and suggested commands. Follow sequentially; commit after each step.

### 0) Pre‑flight
- **Scope**: Ensure baseline dev environment runs.
- **Files**: `package.json`
- **Actions**:
  - Install deps and run the app.
  - Verify `public/audio/audio.mp3` loads in the player UI.
- **Commands**:
  - `npm i`
  - `npm run dev`
- **Accept**: App starts locally; can load the audio file without errors in console.

### 1) Solidify Audio Engine baseline
- **Scope**: Clean playback using Web Audio API, with an explicit node graph scaffold.
- **Files**: `src/core/audio/AudioEngine.ts`, `src/components/player/AudioPlayer.tsx`, `src/hooks/useAudioPlayer.ts`
- **Actions**:
  - Ensure graph: Source → Gain → (EffectBus placeholder) → MasterGain → Destination.
  - Implement play, pause, stop; expose master gain.
- **Accept**: Play/Pause/Stop work reliably; no audible clicks; master volume adjustable.

### 2) Effect bus scaffolding
- **Scope**: Prepare an insert chain for effects with bypass per effect.
- **Files**: `AudioEngine.ts`, types in `src/types/audio.ts`
- **Actions**:
  - Add an EffectBus node chain container with: tempo/pitch module, lo‑fi module, optional EQ module stubs.
  - Add per‑effect dry/wet and bypass flags (typed state + setters).
- **Accept**: Toggling bypass reroutes audio with no pops; dry/wet ranges 0…1.

### 3) Tempo (time‑stretch) + Pitch — architecture
- **Scope**: Choose implementation to decouple tempo from pitch.
- **Files**: `AudioEngine.ts`, new `src/core/audio/worklets/*`
- **Actions**:
  - Preferred: AudioWorklet‑based WSOLA/PSOLA or library wrapper.
  - MVP Path: integrate `soundtouchjs` (WSOLA) via Worklet bridge; or use `@audiant/pitch-shift` alternative if more stable in your environment.
  - Expose controls: `tempo` (0.5–1.5x) and `pitchSemitones` (−12…+12).
- **Commands** (pick one stack):
  - `npm i soundtouchjs`
  - If using Worklets: ensure `vite` worklet config (set `AudioWorklet` bundling if needed).
- **Accept**: Adjusting tempo does not change pitch; adjusting pitch does not change tempo; latency < 60 ms typical.

### 4) Lo‑fi (vinyl/cassette) module
- **Scope**: Add character effects with low CPU.
- **Files**: `AudioEngine.ts`, new `src/core/audio/lofi/*`, player UI
- **Actions**:
  - Nodes: gentle low‑pass (Biquad), optional high‑pass, noise bed (buffered white/pink with low level), crackle (impulse events), wow/flutter (LFO modulating playbackRate or all‑pass), optional bit‑crusher (Worklet downsample).
  - Controls: intensity (macro), tone (LPF cutoff), noise level, wow/flutter depth/rate, crackle amount.
- **Accept**: Audible lo‑fi coloration with adjustable intensity; bypass is transparent.

### 5) Optional: 7‑band EQ
- **Scope**: Simple graphic EQ with 7 peaking filters.
- **Files**: `AudioEngine.ts`, `AudioPlayer.tsx`
- **Actions**:
  - Frequencies: 60, 170, 310, 600, 1000, 3000, 6000 Hz (Q ≈ 1.0–1.4).
  - Gain range: −12…+12 dB per band; single dry/wet for the EQ block.
- **Accept**: Bands respond smoothly; unity when all gains at 0 dB.

### 6) Optional: Basic room reverb
- **Scope**: Small/medium presets via ConvolverNode.
- **Files**: `public/ir/*` (add IR wav files), `AudioEngine.ts`
- **Actions**:
  - Load IRs asynchronously; add pre‑delay Gain+Delay, reverb mix, and damping (post low‑pass).
- **Accept**: Presets switch smoothly; no blasts on load.

### 7) Optional: Low‑pass tone control
- **Scope**: Additional lo‑fi tone shaping.
- **Files**: `AudioEngine.ts`, `AudioPlayer.tsx`
- **Actions**:
  - Single Biquad low‑pass with resonance control; map a UI slider.
- **Accept**: Smooth cutoff sweep; no zipper noise.

### 8) Real‑time spectrum visualization
- **Scope**: Add `AnalyserNode` after the effect bus.
- **Files**: `AudioEngine.ts`, new `src/components/Spectrum.tsx`
- **Actions**:
  - FFT size 2048; draw time/frequency domain on `<canvas>`; pause rendering when not visible.
- **Accept**: Stable 60fps canvas on desktop; no impact on audio.

### 9) Backend (local) for tracks + playback counts
- **Scope**: Lightweight REST service with JSON persistence.
- **Files**: `server/index.ts`, `server/data/tracks.json`, `server/data/playbacks.json`, `package.json` scripts
- **Actions**:
  - Endpoints:
    - GET `/api/tracks` → [{ id, title, artist, duration, playCount }]
    - POST `/api/playbacks/:trackId` → increments total and returns updated counts
  - Persist to JSON; allow CORS locally.
- **Commands**:
  - `npm i express cors` (and `npm i -D ts-node nodemon` if TS server)
  - Add scripts: `dev:server`, `dev:full` (concurrently Vite + server)
- **Accept**: Hitting POST updates counts on disk; GET reflects updates.

### 10) Frontend integration: Search & Track Selection
- **Scope**: Pages and data wiring per prompt.
- **Files**: `src/App.tsx`, `src/main.tsx`, `src/index.css`, new `src/pages/Search.tsx`, `src/pages/Track.tsx`, `src/api/client.ts`
- **Actions**:
  - Search input (client‑side filter for MVP) or server query param.
  - List tracks with metadata and playCount; navigate to track detail.
- **Accept**: Search filters list; navigation updates URL; counts shown.

### 11) Playback tracking on start
- **Scope**: Increment per play start and update UI immediately.
- **Files**: `useAudioPlayer.ts`, `api/client.ts`, pages
- **Actions**:
  - On `play()` transition, call POST, optimistically update counts, reconcile on response.
- **Accept**: Counts increment at play; survive refresh.

### 12) Presets and share links (optional but encouraged)
- **Scope**: Encode current effect state into URL and localStorage.
- **Files**: `useAudioPlayer.ts`, routing layer
- **Actions**:
  - Serialize: tempo, pitch, lo‑fi params, EQ gains, reverb preset; restore on mount.
- **Accept**: Copy/paste URL reproduces the same sound.

### 13) UI/UX polish
- **Scope**: Clean, minimal controls and responsive layout.
- **Files**: `AudioPlayer.module.css`, components
- **Actions**:
  - Group controls by module; add tooltips; snap to sensible ranges; ensure keyboard accessibility.
- **Accept**: Smooth control; no layout shifts; mobile friendly.

### 14) Performance + Quality pass
- **Scope**: CPU, latency, and error handling.
- **Files**: engine + worklets
- **Actions**:
  - Suspend `AudioContext` when idle; throttle visualization; batch parameter updates; de‑click transitions.
  - Guard on decode failures; fallbacks for browsers lacking Worklet support.
- **Accept**: No audible artifacts while tweaking; CPU within budget on mid‑range devices.

### 15) Future integration hooks (TON + Telegram Mini App)
- **Scope**: Prepare architecture for blockchain and Mini App layers.
- **Files**: `src/core/*`, `src/api/*`, docs
- **Actions**:
  - Abstract playback tracking service behind interface to later swap to TON smart‑contract events.
  - Keep UI in Mini‑App safe area; avoid disallowed APIs; plan auth boundary for Telegram Login.
- **Accept**: Minimal refactor required when adding TON/TG.

---

## File Touch‑points by Module
- Audio Engine: `src/core/audio/AudioEngine.ts`, `src/core/audio/worklets/*`, `src/types/audio.ts`
- Player UI: `src/components/player/AudioPlayer.tsx`, `src/components/Spectrum.tsx`, `src/components/*`
- Hooks: `src/hooks/useAudioPlayer.ts`
- Styling: `src/components/player/AudioPlayer.module.css`, `src/index.css`
- Pages/Routing: `src/App.tsx`, `src/pages/Search.tsx`, `src/pages/Track.tsx`, `src/main.tsx`
- Backend (local): `server/index.ts`, `server/data/*.json`
- Public assets: `public/audio/*`, `public/ir/*`

## Milestone Checklist
- [ ] Step 0 Pre‑flight
- [ ] Step 1 Audio Engine baseline
- [ ] Step 2 Effect bus scaffolding
- [ ] Step 3 Tempo + Pitch separated
- [ ] Step 4 Lo‑fi module
- [ ] Step 5 7‑band EQ (optional)
- [ ] Step 6 Reverb (optional)
- [ ] Step 7 Low‑pass tone (optional)
- [ ] Step 8 Visualization
- [ ] Step 9 Backend REST
- [ ] Step 10 Search & Selection
- [ ] Step 11 Playback tracking
- [ ] Step 12 Presets & share links (optional)
- [ ] Step 13 UI/UX polish
- [ ] Step 14 Performance & quality
- [ ] Step 15 TON/TG integration hooks

## Notes
- Effects to INCLUDE per prompt: pitch‑shifting, time‑stretching, vinyl/cassette noise filter.
- Keep effect transitions smooth; avoid re‑creating nodes on each knob move—update params instead.
- Use early returns and guard clauses in engine code; keep types explicit per exported API.


