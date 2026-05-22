/**
 * Глобальные SVG-фильтры: feTurbulence + feDisplacementMap — liquid / halftone waves.
 * Подключить один раз в корне приложения.
 */
export default function SvgDisplacementDefs() {
  return (
    <svg
      className="svg-displacement-defs"
      aria-hidden="true"
      focusable="false"
      width="0"
      height="0"
      style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
    >
      <defs>
        <filter
          id="ace-liquid-displace"
          x="-25%"
          y="-25%"
          width="150%"
          height="150%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.011 0.028"
            numOctaves="2"
            seed="4"
            result="ace-noise"
          >
            <animate
              attributeName="baseFrequency"
              dur="7s"
              values="0.009 0.022;0.014 0.034;0.009 0.022"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feDisplacementMap
            id="ace-liquid-displace-map"
            in="SourceGraphic"
            in2="ace-noise"
            scale="0"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>

        <filter
          id="ace-halftone-liquid"
          x="-30%"
          y="-30%"
          width="160%"
          height="160%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="turbulence"
            baseFrequency="0.018 0.045"
            numOctaves="3"
            seed="11"
            result="ace-halftone-noise"
          >
            <animate
              attributeName="seed"
              dur="5s"
              values="8;14;6;8"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feDisplacementMap
            id="ace-halftone-liquid-map"
            in="SourceGraphic"
            in2="ace-halftone-noise"
            scale="0"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>

        {/* Gooey metaball — rail compact / scroll-spy точки */}
        <filter
          id="ace-rail-metaball"
          x="-80%"
          y="-40%"
          width="260%"
          height="180%"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="ace-rail-blur" />
          <feColorMatrix
            in="ace-rail-blur"
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10"
            result="ace-rail-goo"
          />
          <feBlend in="ace-rail-goo" in2="SourceGraphic" mode="normal" />
        </filter>

        <filter id="ace-preview-liquid" x="-15%" y="-15%" width="130%" height="130%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.006 0.014"
            numOctaves="2"
            seed="2"
            result="ace-preview-noise"
          />
          <feDisplacementMap
            id="ace-preview-liquid-map"
            in="SourceGraphic"
            in2="ace-preview-noise"
            scale="0"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}
