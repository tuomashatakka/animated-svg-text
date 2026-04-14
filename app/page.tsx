'use client';

import { useState } from 'react';
import { TextAnimator, AnimationPreset, SvgEffect } from '@/components/text-animator';

const FONTS = [
  { name: 'Pacifico', url: 'https://raw.githubusercontent.com/google/fonts/main/ofl/pacifico/Pacifico-Regular.ttf' },
  { name: 'Roboto Black', url: 'https://raw.githubusercontent.com/googlefonts/roboto/main/src/hinted/Roboto-Black.ttf' },
  { name: 'Dancing Script', url: 'https://raw.githubusercontent.com/google/fonts/main/ofl/dancingscript/DancingScript%5Bwght%5D.ttf' },
  { name: 'Lobster', url: 'https://raw.githubusercontent.com/google/fonts/main/ofl/lobster/Lobster-Regular.ttf' },
  { name: 'Monoton', url: 'https://raw.githubusercontent.com/google/fonts/main/ofl/monoton/Monoton-Regular.ttf' },
  { name: 'Creepster', url: 'https://raw.githubusercontent.com/google/fonts/main/ofl/creepster/Creepster-Regular.ttf' },
  { name: 'Righteous', url: 'https://raw.githubusercontent.com/google/fonts/main/ofl/righteous/Righteous-Regular.ttf' },
  { name: 'Bangers', url: 'https://raw.githubusercontent.com/google/fonts/main/ofl/bangers/Bangers-Regular.ttf' },
  { name: 'Press Start 2P', url: 'https://raw.githubusercontent.com/google/fonts/main/ofl/pressstart2p/PressStart2P-Regular.ttf' },
  { name: 'Cinzel', url: 'https://raw.githubusercontent.com/google/fonts/main/ofl/cinzel/Cinzel%5Bwght%5D.ttf' },
  { name: 'Fredoka', url: 'https://raw.githubusercontent.com/google/fonts/main/ofl/fredoka/Fredoka%5Bwdth,wght%5D.ttf' },
  { name: 'Permanent Marker', url: 'https://raw.githubusercontent.com/google/fonts/main/apache/permanentmarker/PermanentMarker-Regular.ttf' },
  { name: 'Amatic SC', url: 'https://raw.githubusercontent.com/google/fonts/main/ofl/amaticsc/AmaticSC-Regular.ttf' },
  { name: 'Bebas Neue', url: 'https://raw.githubusercontent.com/google/fonts/main/ofl/bebasneue/BebasNeue-Regular.ttf' },
  { name: 'Playfair Display', url: 'https://raw.githubusercontent.com/google/fonts/main/ofl/playfairdisplay/PlayfairDisplay%5Bwght%5D.ttf' },
  { name: 'Orbitron', url: 'https://raw.githubusercontent.com/google/fonts/main/ofl/orbitron/Orbitron%5Bwght%5D.ttf' },
  { name: 'Caveat', url: 'https://raw.githubusercontent.com/google/fonts/main/ofl/caveat/Caveat%5Bwght%5D.ttf' },
];

const PRESETS: { label: string; value: AnimationPreset }[] = [
  { label: 'Calligraphy', value: 'calligraphy' },
  { label: 'Typewriter', value: 'typewriter' },
  { label: 'Flash', value: 'flash' },
  { label: 'Ghost', value: 'ghost' },
  { label: 'Explosion', value: 'explosion' },
  { label: 'Fade In Up', value: 'fadeInUp' },
  { label: 'Sequential Wipe', value: 'sequentialWipe' },
];

const EFFECTS: { label: string; value: SvgEffect }[] = [
  { label: 'None', value: 'none' },
  { label: 'Glow', value: 'glow' },
  { label: 'Shadow', value: 'shadow' },
  { label: 'Liquid', value: 'liquid' },
  { label: 'Neon', value: 'neon' },
  { label: 'Glitch', value: 'glitch' },
  { label: 'Emboss', value: 'emboss' },
  { label: 'Fire', value: 'fire' },
  { label: 'Hologram', value: 'holographic' },
  { label: '3D Extrude', value: 'extrude' },
  { label: 'Distort', value: 'distort' },
  { label: 'Twist', value: 'twist' },
  { label: 'Kaleidoscope', value: 'kaleidoscope' },
  { label: 'Outline', value: 'outline' },
  { label: 'Erosion', value: 'erosion' },
  { label: 'X-Ray', value: 'xray' },
  { label: 'Water', value: 'water' },
  { label: 'Fractal', value: 'fractal' },
  { label: 'Smear', value: 'smear' },
];

const COLORS = [
  { label: 'White', value: '#ffffff' },
  { label: 'Indigo', value: '#818cf8' },
  { label: 'Purple', value: '#c084fc' },
  { label: 'Pink', value: '#f472b6' },
  { label: 'Rose', value: '#fb7185' },
  { label: 'Orange', value: '#fb923c' },
  { label: 'Yellow', value: '#facc15' },
  { label: 'Green', value: '#4ade80' },
  { label: 'Cyan', value: '#22d3ee' },
];

const GRADIENTS = [
  { label: 'Sunset', value: 'url(#grad-sunset)', bg: 'linear-gradient(to right, #ff7e5f, #feb47b)' },
  { label: 'Ocean', value: 'url(#grad-ocean)', bg: 'linear-gradient(to right, #2E3192, #1BFFFF)' },
  { label: 'Cyberpunk', value: 'url(#grad-cyberpunk)', bg: 'linear-gradient(to right, #f80759, #bc4e9c)' },
  { label: 'Gold', value: 'url(#grad-gold)', bg: 'linear-gradient(to right, #BF953F, #FCF6BA, #B38728)' },
  { label: 'Aurora', value: 'url(#grad-aurora)', bg: 'linear-gradient(to right, #00c6ff, #0072ff)' },
];

const PRESET_DEFAULTS: Record<AnimationPreset, { stroke: number, fill: number }> = {
  calligraphy: { stroke: 2.5, fill: 1.5 },
  typewriter: { stroke: 0.4, fill: 0.2 },
  flash: { stroke: 0.8, fill: 0.5 },
  ghost: { stroke: 4.0, fill: 3.0 },
  explosion: { stroke: 0.6, fill: 0.4 },
  fadeInUp: { stroke: 1.2, fill: 0.8 },
  sequentialWipe: { stroke: 1.5, fill: 1.0 },
};

export default function Home() {
  const [text, setText] = useState('Hello, Animation!');
  const [fontUrl, setFontUrl] = useState(FONTS[0].url);
  const [preset, setPreset] = useState<AnimationPreset>('calligraphy');
  const [effect, setEffect] = useState<SvgEffect>('none');
  const [strokeDuration, setStrokeDuration] = useState(PRESET_DEFAULTS['calligraphy'].stroke);
  const [fillDuration, setFillDuration] = useState(PRESET_DEFAULTS['calligraphy'].fill);
  const [strokeColor, setStrokeColor] = useState(COLORS[1].value);
  const [fillColor, setFillColor] = useState(COLORS[2].value);
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [effectIntensity, setEffectIntensity] = useState(50);
  const [trigger, setTrigger] = useState(0);

  const handlePresetChange = (newPreset: AnimationPreset) => {
    setPreset(newPreset);
    setStrokeDuration(PRESET_DEFAULTS[newPreset].stroke);
    setFillDuration(PRESET_DEFAULTS[newPreset].fill);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-200 flex flex-col items-center py-16 px-4 font-sans">
      <div className="max-w-5xl w-full space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
            SVG Text Animator
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Convert any text into an SVG path and animate it using opentype.js and CSS keyframes.
          </p>
        </div>

        <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 backdrop-blur-sm flex flex-col gap-6">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full space-y-2">
              <label htmlFor="text-input" className="block text-sm font-medium text-slate-400">
                Text to Animate
              </label>
              <input
                id="text-input"
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                placeholder="Enter text..."
              />
            </div>
            
            <button
              onClick={() => setTrigger(t => t + 1)}
              className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-8 py-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              Replay
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-4 col-span-1 md:col-span-2 lg:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="block text-sm font-medium text-slate-400">Stroke Draw Duration</label>
                  <span className="text-sm text-slate-300 font-mono">{strokeDuration.toFixed(1)}s</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="10"
                  step="0.1"
                  value={strokeDuration}
                  onChange={(e) => setStrokeDuration(parseFloat(e.target.value))}
                  className="w-full accent-indigo-500"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="block text-sm font-medium text-slate-400">Fill Fade Duration</label>
                  <span className="text-sm text-slate-300 font-mono">{fillDuration.toFixed(1)}s</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="10"
                  step="0.1"
                  value={fillDuration}
                  onChange={(e) => setFillDuration(parseFloat(e.target.value))}
                  className="w-full accent-indigo-500"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="block text-sm font-medium text-slate-400">Kerning (Letter Spacing)</label>
                  <span className="text-sm text-slate-300 font-mono">{letterSpacing.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="-0.1"
                  max="1.0"
                  step="0.05"
                  value={letterSpacing}
                  onChange={(e) => setLetterSpacing(parseFloat(e.target.value))}
                  className="w-full accent-indigo-500"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="block text-sm font-medium text-slate-400">Effect Intensity</label>
                  <span className="text-sm text-slate-300 font-mono">{effectIntensity}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={effectIntensity}
                  onChange={(e) => setEffectIntensity(parseInt(e.target.value))}
                  className="w-full accent-indigo-500"
                />
              </div>
            </div>

            <div className="space-y-4 col-span-1 md:col-span-2 lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-400">Stroke Color</label>
                <div className="flex flex-wrap gap-2">
                  {COLORS.map((c) => (
                    <button
                      key={c.label}
                      onClick={() => setStrokeColor(c.value)}
                      title={c.label}
                      className={`w-8 h-8 rounded-full border-2 transition-transform ${strokeColor === c.value ? 'scale-110 border-white' : 'border-transparent hover:scale-105'}`}
                      style={{ backgroundColor: c.value }}
                    />
                  ))}
                  <div className="w-px h-8 bg-slate-700 mx-1" />
                  {GRADIENTS.map((g) => (
                    <button
                      key={g.label}
                      onClick={() => setStrokeColor(g.value)}
                      title={g.label}
                      className={`w-8 h-8 rounded-full border-2 transition-transform ${strokeColor === g.value ? 'scale-110 border-white' : 'border-transparent hover:scale-105'}`}
                      style={{ background: g.bg }}
                    />
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-400">Fill Color</label>
                <div className="flex flex-wrap gap-2">
                  {COLORS.map((c) => (
                    <button
                      key={c.label}
                      onClick={() => setFillColor(c.value)}
                      title={c.label}
                      className={`w-8 h-8 rounded-full border-2 transition-transform ${fillColor === c.value ? 'scale-110 border-white' : 'border-transparent hover:scale-105'}`}
                      style={{ backgroundColor: c.value }}
                    />
                  ))}
                  <div className="w-px h-8 bg-slate-700 mx-1" />
                  {GRADIENTS.map((g) => (
                    <button
                      key={g.label}
                      onClick={() => setFillColor(g.value)}
                      title={g.label}
                      className={`w-8 h-8 rounded-full border-2 transition-transform ${fillColor === g.value ? 'scale-110 border-white' : 'border-transparent hover:scale-105'}`}
                      style={{ background: g.bg }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-400">Font Style</label>
              <div className="flex flex-wrap gap-2">
                {FONTS.map((font) => (
                  <button
                    key={font.name}
                    onClick={() => setFontUrl(font.url)}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      fontUrl === font.url
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {font.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-400">Animation Preset</label>
              <div className="flex flex-wrap gap-2">
                {PRESETS.map((p) => (
                  <button
                    key={p.value}
                    onClick={() => handlePresetChange(p.value)}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      preset === p.value
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-400">SVG Effect</label>
              <div className="flex flex-wrap gap-2">
                {EFFECTS.map((e) => (
                  <button
                    key={e.value}
                    onClick={() => setEffect(e.value)}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      effect === e.value
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {e.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* We use the key prop to force a complete re-mount of the component when trigger changes, ensuring the animation restarts perfectly */}
        <TextAnimator 
          key={`${text}-${fontUrl}-${preset}-${effect}-${trigger}-${strokeDuration}-${fillDuration}-${strokeColor}-${fillColor}-${letterSpacing}-${effectIntensity}`}
          text={text || ' '} 
          fontUrl={fontUrl} 
          strokeColor={strokeColor}
          fillColor={fillColor}
          preset={preset}
          effect={effect}
          strokeDuration={strokeDuration}
          fillDuration={fillDuration}
          letterSpacing={letterSpacing}
          effectIntensity={effectIntensity}
        />
      </div>
    </main>
  );
}
