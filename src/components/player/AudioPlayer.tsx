import React, { useEffect, useRef, useState } from 'react';
import { useAudioPlayer } from '../../hooks/useAudioPlayer';
import type { AudioTrack } from '../../types/audio';
import Spectrum from '../Spectrum';
import styles from './AudioPlayer.module.css';

interface AudioPlayerProps {
  track: AudioTrack;
  onTrackEnd?: () => void;
}

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const AudioPlayer: React.FC<AudioPlayerProps> = ({ track, onTrackEnd }) => {
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
    /*setEQ,*/
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
  const progressBarRef = useRef<HTMLDivElement>(null);

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

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current) return;
    
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    const newTime = Math.max(0, Math.min(duration, duration * clickPosition));
    seek(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };

  const handlePlaybackRateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPlaybackRate(parseFloat(e.target.value));
  };

  const handleTempoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) setTempo(value);
  };

  const handlePitchSemitonesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) setPitchSemitones(value);
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className={styles.audioPlayer}>
      <div className={styles.trackInfo}>
        <h3 className={styles.trackTitle}>{track.title}</h3>
        <p className={styles.artistName}>{track.artist}</p>
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

      <div className={styles.controls}>
        <button 
          className={`${styles.controlButton} ${isMuted ? styles.active : ''}`}
          onClick={toggleMute}
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? '🔇' : volume > 0.5 ? '🔊' : '🔉'}
        </button>
        
        <div className={styles.volumeControl}>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className={styles.volumeSlider}
          />
        </div>

        <button 
          className={styles.playButton}
          onClick={togglePlayPause}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? '⏸️' : '▶️'}
        </button>


        <div className={styles.playbackRate}>
          <select 
            value={playbackRate.toFixed(1)} 
            onChange={handlePlaybackRateChange}
            className={styles.rateSelect}
          >
            {[0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0].map(rate => (
              <option key={rate} value={rate}>
                {rate}x
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.effectsControls}>
        <button 
          className={`${styles.effectButton} ${showPitch ? styles.active : ''}`}
          onClick={() => setShowPitch(!showPitch)}
        >
          Pitch/Tempo
        </button>
        
        <button 
          className={`${styles.effectButton} ${showEQ ? styles.active : ''}`}
          onClick={() => setShowEQ(!showEQ)}
        >
          EQ
        </button>

        <button 
          className={`${styles.effectButton} ${showLofi ? styles.active : ''}`}
          onClick={() => setShowLofi(!showLofi)}
        >
          Lo-fi
        </button>

        <button 
          className={`${styles.effectButton} ${showReverb ? styles.active : ''}`}
          onClick={() => setShowReverb(!showReverb)}
        >
          Reverb
        </button>

        <button 
          className={`${styles.effectButton} ${showLowPass ? styles.active : ''}`}
          onClick={() => setShowLowPass(!showLowPass)}
        >
          Low-Pass
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
          {[60, 170, 310, 600, 1000, 3000, 6000].map((freq, index) => (
            <div key={index} className={styles.eqBand}>
              <label>{freq}Hz</label>
              <input
                type="range"
                min="-12"
                max="12"
                step="0.5"
                value={eqBands[index] ?? 0}
                onChange={(e) => handleEQBandChange(index, parseFloat(e.target.value))}
                className={styles.eqSlider}
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

      {showSpectrum && (
        <Spectrum 
          analyser={getAnalyser() || null}
          isVisible={showSpectrum && isPlaying}
        />
      )}
    </div>
  );
};

export default AudioPlayer;