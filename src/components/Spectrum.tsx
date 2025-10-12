import React, { useEffect, useRef } from 'react';
import styles from './Spectrum.module.css';

interface SpectrumProps {
  analyser: AnalyserNode | null;
  isVisible: boolean;
}

const Spectrum: React.FC<SpectrumProps> = ({ analyser, isVisible }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!analyser || !isVisible) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Configure analyser
    analyser.fftSize = 2048;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const draw = () => {
      if (!isVisible) return;

      animationRef.current = requestAnimationFrame(draw);

      analyser.getByteFrequencyData(dataArray);

      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;

      ctx.clearRect(0, 0, width, height);

      // Draw frequency spectrum
      const barWidth = width / bufferLength * 2.5;
      let barHeight;
      let x = 0;

      ctx.fillStyle = 'rgba(156, 39, 176, 0.8)'; // Purple theme

      for (let i = 0; i < bufferLength; i++) {
        barHeight = ((dataArray[i] || 0) / 255) * height;

        // Create gradient effect
        const gradient = ctx.createLinearGradient(0, height - barHeight, 0, height);
        gradient.addColorStop(0, 'rgba(156, 39, 176, 0.8)');
        gradient.addColorStop(1, 'rgba(156, 39, 176, 0.2)');
        ctx.fillStyle = gradient;

        ctx.fillRect(x, height - barHeight, barWidth, barHeight);

        x += barWidth + 1;
      }
    };

    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [analyser, isVisible]);

  if (!isVisible) return null;

  return (
    <div className={styles.spectrumContainer}>
      <canvas
        ref={canvasRef}
        className={styles.spectrumCanvas}
        width={400}
        height={200}
      />
    </div>
  );
};

export default Spectrum;
