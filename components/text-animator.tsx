'use client';

import React, { useEffect, useRef, useState } from 'react';
import opentype from 'opentype.js';

export type AnimationPreset = 'typewriter' | 'calligraphy' | 'flash' | 'ghost' | 'explosion' | 'fadeInUp' | 'sequentialWipe';
export type SvgEffect = 'none' | 'glow' | 'shadow' | 'liquid' | 'neon' | 'glitch' | 'emboss' | 'fire' | 'holographic' | 'extrude' | 'distort' | 'twist' | 'kaleidoscope';

interface TextAnimatorProps {
  text: string;
  fontUrl: string;
  fontSize?: number;
  strokeColor?: string;
  fillColor?: string;
  preset?: AnimationPreset;
  effect?: SvgEffect;
  strokeDuration?: number;
  fillDuration?: number;
  letterSpacing?: number;
  effectIntensity?: number;
}

const getPresetConfig = (
  preset: AnimationPreset, 
  index: number, 
  total: number, 
  customStroke?: number, 
  customFill?: number
) => {
  let baseStroke = 2.5;
  let baseFill = 1.5;
  let delay = 0;
  let fillOpacity = 1;
  let animationName = 'drawOutline';

  switch (preset) {
    case 'typewriter':
      baseStroke = 0.4; delay = index * 0.15; baseFill = 0.2;
      break;
    case 'calligraphy':
      baseStroke = 2.5; delay = index * 0.3; baseFill = 1.5;
      break;
    case 'flash':
      baseStroke = 0.8; delay = 0; baseFill = 0.5;
      break;
    case 'ghost':
      baseStroke = 4; delay = index * 0.4; baseFill = 3; fillOpacity = 0.2;
      break;
    case 'explosion':
      baseStroke = 0.6; delay = 0; baseFill = 0.4; animationName = 'drawExplosion';
      break;
    case 'fadeInUp':
      baseStroke = 1.2; delay = index * 0.15; baseFill = 0.8; animationName = 'drawFadeInUp';
      break;
    case 'sequentialWipe':
      baseStroke = 1.5; delay = index * 0.3; baseFill = 1.0; animationName = 'drawWipe';
      break;
  }

  const duration = customStroke !== undefined ? customStroke : baseStroke;
  const fillDuration = customFill !== undefined ? customFill : baseFill;

  // Scale delays based on custom durations to keep the staggered effect proportional
  const scale = duration / baseStroke;
  const adjustedDelay = delay * scale;
  const adjustedFillDelay = adjustedDelay + (duration * 0.8);

  return {
    duration,
    delay: adjustedDelay,
    fillDuration,
    fillDelay: adjustedFillDelay,
    fillOpacity,
    animationName
  };
};

export function TextAnimator({
  text,
  fontUrl,
  fontSize = 90,
  strokeColor = '#0f3460',
  fillColor = '#e94560',
  preset = 'calligraphy',
  effect = 'none',
  strokeDuration,
  fillDuration,
  letterSpacing = 0,
  effectIntensity = 50,
}: TextAnimatorProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [pathDataArray, setPathDataArray] = useState<string[]>([]);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [viewBox, setViewBox] = useState('0 0 800 200');
  const [lengths, setLengths] = useState<number[]>([]);

  useEffect(() => {
    let isMounted = true;

    const loadFontAndCreatePath = async () => {
      try {
        const font = await new Promise<opentype.Font>((resolve, reject) => {
          opentype.load(fontUrl, (err, font) => {
            if (err || !font) {
              reject(err);
            } else {
              resolve(font);
            }
          });
        });

        if (!isMounted) return;

        const actualLetterSpacing = letterSpacing * fontSize;

        // Calculate text width to center it or adjust viewBox
        const textWidth = font.getAdvanceWidth(text, fontSize, { letterSpacing: actualLetterSpacing });
        const x = (800 - textWidth) / 2; // Center horizontally in 800px width
        const y = 130; // Baseline

        const paths = font.getPaths(text, x > 0 ? x : 50, y, fontSize, { letterSpacing: actualLetterSpacing });
        const pathDArray = paths.map(p => p.toPathData(5));
        
        if (textWidth > 700) {
           setViewBox(`0 0 ${textWidth + 100} 200`);
        } else {
           setViewBox('0 0 800 200');
        }

        setPathDataArray(pathDArray);
        setIsAnimating(false); // Reset animation state
        setLengths([]);
      } catch (error) {
        console.error('Error loading font or creating path:', error);
      }
    };

    if (text && fontUrl) {
      loadFontAndCreatePath();
    }

    return () => {
      isMounted = false;
    };
  }, [text, fontUrl, fontSize, letterSpacing]);

  useEffect(() => {
    if (pathDataArray.length > 0) {
      const newLengths = pathRefs.current.map((path) => {
        if (!path) return 0;
        return path.getTotalLength();
      });
      
      setLengths(newLengths);

      requestAnimationFrame(() => {
        setIsAnimating(true);
      });
    }
  }, [pathDataArray]);

  return (
    <div className="w-full flex flex-col items-center justify-center p-4 md:p-8 bg-slate-900 rounded-xl shadow-2xl overflow-hidden border border-slate-800">
      <svg
        ref={svgRef}
        viewBox={viewBox}
        className="w-full max-w-4xl bg-slate-950 rounded-lg shadow-inner overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="grad-sunset" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ff7e5f" />
            <stop offset="100%" stopColor="#feb47b" />
          </linearGradient>
          <linearGradient id="grad-ocean" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2E3192" />
            <stop offset="100%" stopColor="#1BFFFF" />
          </linearGradient>
          <linearGradient id="grad-cyberpunk" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f80759" />
            <stop offset="100%" stopColor="#bc4e9c" />
          </linearGradient>
          <linearGradient id="grad-gold" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#BF953F" />
            <stop offset="50%" stopColor="#FCF6BA" />
            <stop offset="100%" stopColor="#B38728" />
          </linearGradient>
          <linearGradient id="grad-aurora" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00c6ff" />
            <stop offset="100%" stopColor="#0072ff" />
          </linearGradient>

          {/* Filters */}
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation={Math.max(1, effectIntensity / 10)} result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx={effectIntensity / 10} dy={effectIntensity / 10} stdDeviation={Math.max(0, effectIntensity / 15)} floodColor="#000" floodOpacity="0.7" />
          </filter>
          <filter id="liquid" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale={effectIntensity} xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <filter id="neon" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation={Math.max(0.1, effectIntensity / 25)} result="blur1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation={Math.max(1, effectIntensity / 8)} result="blur2" />
            <feGaussianBlur in="SourceGraphic" stdDeviation={Math.max(2, effectIntensity / 4)} result="blur3" />
            <feMerge>
              <feMergeNode in="blur3" />
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glitch" x="-20%" y="-20%" width="140%" height="140%">
            <feOffset dx={effectIntensity / 5} dy={-effectIntensity / 5} in="SourceGraphic" result="red-shift" />
            <feOffset dx={-effectIntensity / 5} dy={effectIntensity / 5} in="SourceGraphic" result="blue-shift" />
            <feMerge>
              <feMergeNode in="red-shift" />
              <feMergeNode in="blue-shift" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="emboss" x="-20%" y="-20%" width="140%" height="140%">
            <feConvolveMatrix order="3,3" kernelMatrix={`3 0 0 0 -1 0 0 0 -${Math.max(1, effectIntensity / 10)}`} preserveAlpha="true" />
          </filter>
          <filter id="fire" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.01 0.4" numOctaves="2" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale={effectIntensity * 1.5} xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <filter id="holographic" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency={Math.max(0.001, effectIntensity / 1000)} numOctaves="1" result="noise" />
            <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 3 -1" in="noise" result="coloredNoise" />
            <feComposite operator="in" in="coloredNoise" in2="SourceGraphic" result="holo" />
            <feBlend mode="screen" in="SourceGraphic" in2="holo" />
          </filter>
          <filter id="extrude" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx={effectIntensity / 20} dy={effectIntensity / 20} stdDeviation="0" floodColor="#000" floodOpacity="0.8" />
            <feDropShadow dx={effectIntensity / 10} dy={effectIntensity / 10} stdDeviation="0" floodColor="#000" floodOpacity="0.8" />
            <feDropShadow dx={effectIntensity / 6.6} dy={effectIntensity / 6.6} stdDeviation="0" floodColor="#000" floodOpacity="0.8" />
            <feDropShadow dx={effectIntensity / 5} dy={effectIntensity / 5} stdDeviation="0" floodColor="#000" floodOpacity="0.8" />
          </filter>
          <filter id="distort" x="-50%" y="-50%" width="200%" height="200%">
            <feTurbulence type="turbulence" baseFrequency={Math.max(0.001, effectIntensity / 500)} numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale={effectIntensity} xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <filter id="twist" x="-50%" y="-50%" width="200%" height="200%">
            <feTurbulence type="fractalNoise" baseFrequency={Math.max(0.001, 0.05 - (effectIntensity / 2000))} numOctaves="1" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale={effectIntensity * 2} xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <filter id="kaleidoscope" x="-50%" y="-50%" width="200%" height="200%">
            <feOffset dx={effectIntensity / 2} dy={effectIntensity / 2} in="SourceGraphic" result="o1" />
            <feColorMatrix type="hueRotate" values="90" in="o1" result="c1" />
            <feOffset dx={-effectIntensity / 2} dy={-effectIntensity / 2} in="SourceGraphic" result="o2" />
            <feColorMatrix type="hueRotate" values="180" in="o2" result="c2" />
            <feOffset dx={effectIntensity / 2} dy={-effectIntensity / 2} in="SourceGraphic" result="o3" />
            <feColorMatrix type="hueRotate" values="270" in="o3" result="c3" />
            <feMerge>
              <feMergeNode in="c1" />
              <feMergeNode in="c2" />
              <feMergeNode in="c3" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {pathDataArray.map((pathData, index) => {
          const length = lengths[index] || 0;
          const config = getPresetConfig(preset, index, pathDataArray.length, strokeDuration, fillDuration);
          
          // Use a simple pseudo-random hash based on index to keep it pure
          const pseudoRandom = (seed: number) => {
            const x = Math.sin(seed++) * 10000;
            return x - Math.floor(x);
          };
          const rx = (pseudoRandom(index + 1) - 0.5) * 2;
          const ry = (pseudoRandom(index + 100) - 0.5) * 2;
          
          return (
            <path
              key={index}
              ref={(el) => { pathRefs.current[index] = el; }}
              d={pathData}
              className="transition-all"
              style={{
                '--path-length': length,
                '--stroke-color': strokeColor,
                '--fill-color': fillColor,
                '--fill-opacity': config.fillOpacity,
                '--random-x': rx,
                '--random-y': ry,
                strokeDasharray: length,
                strokeDashoffset: length,
                fill: 'transparent',
                stroke: 'transparent',
                strokeWidth: 1.5,
                strokeLinejoin: 'round',
                strokeLinecap: 'round',
                opacity: lengths.length > 0 ? 1 : 0,
                transformBox: 'fill-box',
                transformOrigin: 'center',
                animation: isAnimating 
                  ? `${config.animationName} ${config.duration}s ease-in-out ${config.delay}s both, fillColor ${config.fillDuration}s ease-in-out ${config.fillDelay}s both`
                  : 'none',
                filter: effect !== 'none' ? `url(#${effect})` : 'none',
              } as React.CSSProperties}
            />
          );
        })}
      </svg>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes drawOutline {
          0% { stroke-dashoffset: var(--path-length); stroke: transparent; }
          1% { stroke-dashoffset: var(--path-length); stroke: var(--stroke-color); }
          100% { stroke-dashoffset: 0; stroke: var(--stroke-color); }
        }
        @keyframes drawExplosion {
          0% { stroke-dashoffset: var(--path-length); stroke: transparent; transform: scale(2) translate(calc(var(--random-x) * 50px), calc(var(--random-y) * 50px)); opacity: 0; }
          1% { stroke-dashoffset: var(--path-length); stroke: var(--stroke-color); opacity: 1; }
          100% { stroke-dashoffset: 0; stroke: var(--stroke-color); transform: scale(1) translate(0, 0); opacity: 1; }
        }
        @keyframes drawFadeInUp {
          0% { stroke-dashoffset: var(--path-length); stroke: transparent; transform: translateY(40px); opacity: 0; }
          1% { stroke-dashoffset: var(--path-length); stroke: var(--stroke-color); opacity: 1; }
          100% { stroke-dashoffset: 0; stroke: var(--stroke-color); transform: translateY(0); opacity: 1; }
        }
        @keyframes drawWipe {
          0% { stroke-dashoffset: var(--path-length); stroke: transparent; clip-path: inset(0 100% 0 0); }
          1% { stroke-dashoffset: var(--path-length); stroke: var(--stroke-color); clip-path: inset(0 100% 0 0); }
          100% { stroke-dashoffset: 0; stroke: var(--stroke-color); clip-path: inset(0 0 0 0); }
        }
        @keyframes fillColor {
          0% { fill: transparent; }
          100% { fill: var(--fill-color); fill-opacity: var(--fill-opacity); }
        }
      `}} />
    </div>
  );
}
