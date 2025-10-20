import { FileText, Heart, Share, ThumbsDown } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useAudioPlayer } from '../../hooks/useAudioPlayer';
import type { AudioTrack } from '../../types/audio';
import styles from './EnhancedAudioPlayer.module.css';
import { EQ_BAND_CONFIG, EQ_PRESETS } from './eqPresets';
import { BACKGROUND_NOISE_OPTIONS, MIX_EFFECT_PRESETS } from './mixConstants';
import PlayerControls from './PlayerControls';

interface EnhancedAudioPlayerProps {
  track: AudioTrack;
  onTrackEnd?: () => void;
}

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const EnhancedAudioPlayer: React.FC<EnhancedAudioPlayerProps> = ({ track, onTrackEnd }) => {
  const {
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    playbackRate,
    tempo,
    pitchSemitones,
    eqBands,
    eqMix,
    eqBypass,
    reverbMix,
    reverbPreDelay,
    reverbDamping,
    reverbPreset,
    reverbBypass,
    lowPassTone,
    lowPassResonance,
    lofiTone,
    lofiNoise,
    lofiWow,
    loadTrack,
    togglePlayPause,
    seek,
    setVolume,
    toggleMute,
    setPlaybackRate,
    setTempo,
    setPitchSemitones,
    setEffectBypass,
    setEffectMix,
    handleLofiToneChange,
    handleLofiNoiseChange,
    handleLofiWowChange,
    handleEQBandChange,
    handleEQMixChange,
    handleEQBypassChange,
    handleReverbMixChange,
    handleReverbPreDelayChange,
    handleReverbDampingChange,
    handleReverbPresetChange,
    handleReverbBypassChange,
    handleLowPassToneChange,
    handleLowPassResonanceChange,
    getAnalyser
  } = useAudioPlayer();
  
  const [showEQ, setShowEQ] = useState(false);
  const [showPitch, setShowPitch] = useState(false);
  const [showLofi, setShowLofi] = useState(false);
  const [showReverb, setShowReverb] = useState(false);
  const [showLowPass, setShowLowPass] = useState(false);
  const [showSpectrum, setShowSpectrum] = useState(true);
  const [showMixMode, setShowMixMode] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [spectrumData, setSpectrumData] = useState<Uint8Array | null>(null);
  const [mixModeActive, setMixModeActive] = useState(false);
  const [backgroundNoise, setBackgroundNoise] = useState('none');
  const [noiseVolume, setNoiseVolume] = useState(30);
  const [vinylCrackle, setVinylCrackle] = useState(0);
  const [tapeWow, setTapeWow] = useState(0);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>(0);

  // Load the track when it changes
  useEffect(() => {
    loadTrack(track);
  }, [track, loadTrack]);

  // Handle track end
  useEffect(() => {
    if (currentTime >= duration && duration > 0 && isPlaying) {
      onTrackEnd?.();
    }
  }, [currentTime, duration, isPlaying, onTrackEnd]);

  // Check if mix mode is active
  useEffect(() => {
    const isActive = lofiNoise > 0 || backgroundNoise !== 'none' || vinylCrackle > 0 || tapeWow > 0 || tempo !== 1.0 || pitchSemitones !== 0;
    setMixModeActive(isActive);
  }, [lofiNoise, backgroundNoise, vinylCrackle, tapeWow, tempo, pitchSemitones]);

  // Spectrum visualization
  useEffect(() => {
    if (!showSpectrum || !isPlaying) return undefined;

    const analyser = getAnalyser();
    if (!analyser) return undefined;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const updateSpectrum = () => {
      analyser.getByteFrequencyData(dataArray);
      setSpectrumData(dataArray);
      animationFrameRef.current = requestAnimationFrame(updateSpectrum);
    };

    animationFrameRef.current = requestAnimationFrame(updateSpectrum);

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [showSpectrum, isPlaying, getAnalyser]);

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current) return;
    
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    const newTime = Math.max(0, Math.min(duration, duration * clickPosition));
    seek(newTime);
  };

  const handleVolumeChange = (value: number) => {
    setVolume(value);
  };

  const handlePlaybackRateChange = (rate: number) => {
    setPlaybackRate(rate);
  };

  const handleTempoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) setTempo(value);
  };

  const handlePitchSemitonesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) setPitchSemitones(value);
  };

  const handleLofiIntensityChange = (value: number) => {
    // Convert percentage to actual lofi noise value (0-0.2)
    const noiseValue = (value / 100) * 0.2;
    handleLofiNoiseChange(noiseValue);
  };

  const handleBackgroundNoiseChange = (noiseType: string) => {
    setBackgroundNoise(noiseType);
    // In a real implementation, you would apply the background noise effect here
  };

  const handleNoiseVolumeChange = (value: number) => {
    setNoiseVolume(value);
    // In a real implementation, you would adjust the noise volume here
  };

  const handleVinylCrackleChange = (value: number) => {
    setVinylCrackle(value);
    // In a real implementation, you would apply the vinyl crackle effect here
  };

  const handleTapeWowChange = (value: number) => {
    setTapeWow(value);
    // In a real implementation, you would apply the tape wow effect here
  };

  const handleMixPreset = (preset: any) => {
    if (preset.lofiIntensity !== undefined) {
      handleLofiIntensityChange(preset.lofiIntensity);
    }
    if (preset.backgroundNoise) {
      handleBackgroundNoiseChange(preset.backgroundNoise);
    }
    if (preset.noiseVolume !== undefined) {
      handleNoiseVolumeChange(preset.noiseVolume);
    }
    if (preset.vinylCrackle !== undefined) {
      handleVinylCrackleChange(preset.vinylCrackle);
    }
    if (preset.tapeWow !== undefined) {
      handleTapeWowChange(preset.tapeWow);
    }
    if (preset.tempo !== undefined) {
      setTempo(preset.tempo);
    }
    if (preset.pitch !== undefined) {
      setPitchSemitones(preset.pitch);
    }
  };

  const resetMixMode = () => {
    handleLofiIntensityChange(0);
    handleBackgroundNoiseChange('none');
    handleNoiseVolumeChange(30);
    handleVinylCrackleChange(0);
    handleTapeWowChange(0);
    setTempo(1.0);
    setPitchSemitones(0);
  };

  // EQ Preset handlers
  const applyEQPreset = (presetValues: number[]) => {
    presetValues.forEach((value, index) => {
      handleEQBandChange(index, value);
    });
  };

  const resetEQ = () => {
    const flatPreset = EQ_PRESETS[0];
    if (flatPreset && flatPreset.values) {
      flatPreset.values.forEach((value, index) => {
        handleEQBandChange(index, value);
      });
    }
  };

  // Check if effects are active
  const isEQActive = !eqBypass && eqBands.some(band => band !== 0);
  const isReverbActive = !reverbBypass && reverbMix > 0;
  const isLowPassActive = lowPassTone < 20000;
  const isLofiActive = lofiNoise > 0 || lofiTone < 20000 || lofiWow > 0;
  const isPitchActive = tempo !== 1.0 || pitchSemitones !== 0;

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className={styles.enhancedAudioPlayer}>
      <div className={styles.trackInfo}>
        <h3 className={styles.trackTitle}>{track.title}</h3>
        <p className={styles.artistName}>{track.artist}</p>
      </div>

      {/* Visual indicators for active effects */}
      <div className={styles.activeEffects}>
        {isEQActive && <span className={styles.activeEffectBadge}>EQ</span>}
        {isReverbActive && <span className={styles.activeEffectBadge}>Reverb</span>}
        {isLowPassActive && <span className={styles.activeEffectBadge}>Low-Pass</span>}
        {isLofiActive && <span className={styles.activeEffectBadge}>Lo-fi</span>}
        {isPitchActive && <span className={styles.activeEffectBadge}>Pitch</span>}
        {mixModeActive && <span className={styles.activeEffectBadge}>MIX</span>}
      </div>

      <div className={styles.progressContainer} onClick={handleProgressBarClick} ref={progressBarRef}>
        <div 
          className={styles.progressBar} 
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      <div className={styles.timeDisplay}>
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      <PlayerControls
        isPlaying={isPlaying}
        isMuted={isMuted}
        volume={volume}
        playbackRate={playbackRate}
        onTogglePlay={togglePlayPause}
        onToggleMute={toggleMute}
        onVolumeChange={handleVolumeChange}
        onPlaybackRateChange={handlePlaybackRateChange}
      />

      {/* Like/Dislike & Secondary Controls */}
      <div className={styles.secondaryControls}>
        <button
          onClick={() => setIsLiked(!isLiked)}
          className={`${styles.controlButton} ${isLiked ? styles.active : ''}`}
          aria-label={isLiked ? 'Unlike' : 'Like'}
        >
          <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
        </button>

        <button
          onClick={() => setIsDisliked(!isDisliked)}
          className={`${styles.controlButton} ${isDisliked ? styles.active : ''}`}
          aria-label={isDisliked ? 'Remove dislike' : 'Dislike'}
        >
          <ThumbsDown size={20} fill={isDisliked ? 'currentColor' : 'none'} />
        </button>

        <button
          onClick={() => setShowLyrics(!showLyrics)}
          className={`${styles.controlButton} ${showLyrics ? styles.active : ''}`}
          aria-label={showLyrics ? 'Hide lyrics' : 'Show lyrics'}
        >
          <FileText size={20} />
        </button>

        <button className={styles.controlButton} aria-label="Share">
          <Share size={20} />
        </button>
      </div>

      <div className={styles.effectsControls}>
        <button 
          className={`${styles.effectButton} ${showPitch ? styles.active : ''} ${isPitchActive && !showPitch ? styles.hasEffect : ''}`}
          onClick={() => setShowPitch(!showPitch)}
        >
          Pitch/Tempo
        </button>
        
        <button 
          className={`${styles.effectButton} ${showEQ ? styles.active : ''} ${isEQActive && !showEQ ? styles.hasEffect : ''}`}
          onClick={() => setShowEQ(!showEQ)}
        >
          EQ
        </button>

        <button 
          className={`${styles.effectButton} ${showLofi ? styles.active : ''} ${isLofiActive && !showLofi ? styles.hasEffect : ''}`}
          onClick={() => setShowLofi(!showLofi)}
        >
          Lo-fi
        </button>

        <button 
          className={`${styles.effectButton} ${showReverb ? styles.active : ''} ${isReverbActive && !showReverb ? styles.hasEffect : ''}`}
          onClick={() => setShowReverb(!showReverb)}
        >
          Reverb
        </button>

        <button 
          className={`${styles.effectButton} ${showLowPass ? styles.active : ''} ${isLowPassActive && !showLowPass ? styles.hasEffect : ''}`}
          onClick={() => setShowLowPass(!showLowPass)}
        >
          Low-Pass
        </button>

        <button 
          className={`${styles.effectButton} ${showMixMode || mixModeActive ? styles.active : ''}`}
          onClick={() => setShowMixMode(!showMixMode)}
        >
          MIX Studio
        </button>

        <button 
          className={`${styles.effectButton} ${showSpectrum ? styles.active : ''}`}
          onClick={() => setShowSpectrum(!showSpectrum)}
        >
          Spectrum
        </button>
      </div>

      {showPitch && (
        <div className={styles.pitchControl}>
          <div>
            <label>Tempo: {tempo.toFixed(2)}x</label>
            <input
              type="range"
              min="0.5"
              max="1.5"
              step="0.01"
              value={tempo}
              onChange={handleTempoChange}
              className={styles.pitchSlider}
            />
          </div>
          <div>
            <label>Pitch: {pitchSemitones} st</label>
            <input
              type="range"
              min="-12"
              max="12"
              step="1"
              value={pitchSemitones}
              onChange={handlePitchSemitonesChange}
              className={styles.pitchSlider}
            />
          </div>
          <div className={styles.inlineControls}>
            <label>Tempo/Pitch Mix</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              defaultValue={1}
              onChange={(e) => setEffectMix('tempoPitch', parseFloat(e.target.value))}
            />
            <button className={styles.effectButton} onClick={() => setEffectBypass('tempoPitch', true)}>Bypass</button>
            <button className={styles.effectButton} onClick={() => setEffectBypass('tempoPitch', false)}>Enable</button>
          </div>
        </div>
      )}

      {showEQ && (
        <div className={styles.eqControls}>
          {EQ_BAND_CONFIG.map((band, index) => (
            <div key={band.key} className={styles.eqBand}>
              <label style={{ color: band.color }}>{band.label}</label>
              <div className={styles.frequencyLabel}>{band.frequency}</div>
              <input
                type="range"
                min="-12"
                max="12"
                step="0.5"
                value={eqBands[index] ?? 0}
                onChange={(e) => handleEQBandChange(index, parseFloat(e.target.value))}
                className={styles.eqSlider}
                style={{
                  background: `linear-gradient(to top, ${band.color} 0%, ${band.color} ${((eqBands[index] ?? 0) + 12) / 24 * 100}%, #444 ${((eqBands[index] ?? 0) + 12) / 24 * 100}%, #444 100%)`
                }}
              />
              <span>{(eqBands[index] ?? 0) > 0 ? `+${eqBands[index] ?? 0}` : eqBands[index] ?? 0}dB</span>
            </div>
          ))}
          <div className={styles.inlineControls}>
            <label>EQ Mix</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={eqMix}
              onChange={(e) => handleEQMixChange(parseFloat(e.target.value))}
            />
            <button 
              className={`${styles.effectButton} ${eqBypass ? styles.active : ''}`} 
              onClick={() => handleEQBypassChange(!eqBypass)}
            >
              {eqBypass ? 'Enable' : 'Bypass'}
            </button>
          </div>
          {/* EQ Presets */}
          <div className={styles.inlineControls}>
            <label>Presets:</label>
            <div className={styles.presetButtons}>
              {EQ_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => applyEQPreset(preset.values)}
                  className={styles.effectButton}
                >
                  {preset.name}
                </button>
              ))}
              <button
                onClick={resetEQ}
                className={styles.effectButton}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {showLofi && (
        <div className={styles.lofiControls}>
          <div className={styles.lofiBand}>
            <label>Tone: {lofiTone.toFixed(0)}Hz</label>
            <input
              type="range"
              min="200"
              max="20000"
              step="100"
              value={lofiTone}
              onChange={(e) => handleLofiToneChange(Number(e.target.value))}
              className={styles.lofiSlider}
            />
          </div>
          
          <div className={styles.lofiBand}>
            <label>Noise: {(lofiNoise * 100).toFixed(0)}%</label>
            <input
              type="range"
              min="0"
              max="0.2"
              step="0.01"
              value={lofiNoise}
              onChange={(e) => handleLofiNoiseChange(Number(e.target.value))}
              className={styles.lofiSlider}
            />
          </div>
          
          <div className={styles.lofiBand}>
            <label>Wow: {lofiWow.toFixed(1)}Hz</label>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={lofiWow}
              onChange={(e) => handleLofiWowChange(Number(e.target.value))}
              className={styles.lofiSlider}
            />
          </div>
        </div>
      )}

      {showReverb && (
        <div className={styles.reverbControls}>
          <div className={styles.reverbBand}>
            <label>Mix: {(reverbMix * 100).toFixed(0)}%</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={reverbMix}
              onChange={(e) => handleReverbMixChange(parseFloat(e.target.value))}
              className={styles.reverbSlider}
            />
          </div>
          
          <div className={styles.reverbBand}>
            <label>Pre-delay: {reverbPreDelay}ms</label>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={reverbPreDelay}
              onChange={(e) => handleReverbPreDelayChange(parseFloat(e.target.value))}
              className={styles.reverbSlider}
            />
          </div>
          
          <div className={styles.reverbBand}>
            <label>Damping: {reverbDamping.toFixed(0)}Hz</label>
            <input
              type="range"
              min="100"
              max="20000"
              step="100"
              value={reverbDamping}
              onChange={(e) => handleReverbDampingChange(parseFloat(e.target.value))}
              className={styles.reverbSlider}
            />
          </div>

          <div className={styles.reverbPreset}>
            <label>Preset:</label>
            <select 
              value={reverbPreset}
              onChange={(e) => handleReverbPresetChange(e.target.value as 'small' | 'medium' | 'large')}
              className={styles.reverbSelect}
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>

          <div className={styles.inlineControls}>
            <button 
              className={`${styles.effectButton} ${reverbBypass ? styles.active : ''}`} 
              onClick={() => handleReverbBypassChange(!reverbBypass)}
            >
              {reverbBypass ? 'Enable' : 'Bypass'}
            </button>
          </div>
        </div>
      )}

      {showLowPass && (
        <div className={styles.lowPassControls}>
          <div className={styles.lowPassBand}>
            <label>Cutoff: {lowPassTone.toFixed(0)}Hz</label>
            <input
              type="range"
              min="20"
              max="20000"
              step="10"
              value={lowPassTone}
              onChange={(e) => handleLowPassToneChange(parseFloat(e.target.value))}
              className={styles.lowPassSlider}
            />
          </div>
          
          <div className={styles.lowPassBand}>
            <label>Resonance: {lowPassResonance.toFixed(2)}</label>
            <input
              type="range"
              min="0.1"
              max="10"
              step="0.1"
              value={lowPassResonance}
              onChange={(e) => handleLowPassResonanceChange(parseFloat(e.target.value))}
              className={styles.lowPassSlider}
            />
          </div>
        </div>
      )}

      {showMixMode && (
        <div className={styles.lofiControls}>
          <h3 className={styles.sectionTitle}>MIX Mode Studio</h3>
          
          {/* Tempo & Pitch Controls */}
          <div className={styles.inlineControls}>
            <label>Tempo: {(tempo * 100).toFixed(0)}%</label>
            <input
              type="range"
              min="50"
              max="200"
              value={tempo * 100}
              onChange={(e) => setTempo(parseInt(e.target.value) / 100)}
              className={styles.lofiSlider}
            />
          </div>
          
          <div className={styles.inlineControls}>
            <label>Pitch: {pitchSemitones > 0 ? '+' : ''}{pitchSemitones}</label>
            <input
              type="range"
              min="-12"
              max="12"
              value={pitchSemitones}
              onChange={(e) => setPitchSemitones(parseInt(e.target.value))}
              className={styles.lofiSlider}
            />
          </div>

          {/* Lo-Fi Effects */}
          <div className={styles.inlineControls}>
            <label>Lo-Fi Intensity: {(lofiNoise * 500).toFixed(0)}%</label>
            <input
              type="range"
              min="0"
              max="100"
              value={lofiNoise * 500}
              onChange={(e) => handleLofiIntensityChange(parseInt(e.target.value))}
              className={styles.lofiSlider}
            />
          </div>

          <div className={styles.inlineControls}>
            <label>Background Noise</label>
            <select
              value={backgroundNoise}
              onChange={(e) => handleBackgroundNoiseChange(e.target.value)}
              className={styles.reverbSelect}
            >
              {BACKGROUND_NOISE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {backgroundNoise !== 'none' && (
            <div className={styles.inlineControls}>
              <label>Noise Volume: {noiseVolume}%</label>
              <input
                type="range"
                min="0"
                max="100"
                value={noiseVolume}
                onChange={(e) => handleNoiseVolumeChange(parseInt(e.target.value))}
                className={styles.lofiSlider}
              />
            </div>
          )}

          <div className={styles.inlineControls}>
            <label>Vinyl Crackle: {vinylCrackle}%</label>
            <input
              type="range"
              min="0"
              max="100"
              value={vinylCrackle}
              onChange={(e) => handleVinylCrackleChange(parseInt(e.target.value))}
              className={styles.lofiSlider}
            />
          </div>

          <div className={styles.inlineControls}>
            <label>Tape Wow: {tapeWow}%</label>
            <input
              type="range"
              min="0"
              max="100"
              value={tapeWow}
              onChange={(e) => handleTapeWowChange(parseInt(e.target.value))}
              className={styles.lofiSlider}
            />
          </div>

          {/* Preset Effects */}
          <div className={styles.inlineControls}>
            <label>Effect Presets:</label>
            <div className={styles.presetButtons}>
              {MIX_EFFECT_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => handleMixPreset(preset.effects)}
                  className={styles.effectButton}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.inlineControls}>
            <button 
              className={styles.effectButton}
              onClick={resetMixMode}
            >
              Reset All
            </button>
          </div>
        </div>
      )}

      {showLyrics && (
        <div className={styles.lyricsContainer}>
          <h3 className={styles.sectionTitle}>Lyrics</h3>
          <div className={styles.lyricsContent}>
            <p>Lyrics would be displayed here...</p>
          </div>
        </div>
      )}

      {showSpectrum && (
        <div className={styles.spectrumContainer}>
          {spectrumData ? (
            Array.from(spectrumData).slice(0, 64).map((value, index) => (
              <div
                key={index}
                className={styles.spectrumBar}
                style={{
                  height: `${(value / 255) * 100}%`
                }}
              />
            ))
          ) : (
            <div className={styles.spectrumPlaceholder}>
              {isPlaying ? 'Analyzing audio...' : 'Play audio to see spectrum'}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EnhancedAudioPlayer;