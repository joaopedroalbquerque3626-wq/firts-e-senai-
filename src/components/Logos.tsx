import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'color' | 'light' | 'white' | 'dark';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

/**
 * Official FIRST® Primary Logo vector representation
 * Matching the exact geometric emblem:
 * - Red Triangle (#ED1C24) with bevel
 * - Gray Interlocking Circle (#A7A9AC)
 * - Blue Tilted Square/Diamond (#0066B2) with bevel
 * - Bold Italic logotype "FIRST." + registered trademark ®
 */
export const FirstLogo: React.FC<LogoProps> = ({
  className = 'h-10 w-auto',
  variant = 'color',
  showText = true
}) => {
  const isLight = variant === 'light' || variant === 'white';
  const textColor = isLight ? '#FFFFFF' : '#1A1A1A';

  if (!showText) {
    // Only the iconic geometric symbol emblem
    return (
      <svg
        viewBox="0 0 110 90"
        className={className}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="FIRST® Emblem"
      >
        <g id="first-geometric-emblem">
          {/* Shadow/Bevel for Red Triangle */}
          <polygon
            points="14,14 4,82 52,82"
            fill="#8B1015"
            opacity="0.3"
          />
          {/* Red Triangle Outer */}
          <polygon
            points="12,12 2,78 48,78"
            fill="#B2B4B8"
          />
          <polygon
            points="12,16 6,75 44,75"
            fill="#ED1C24"
          />
          {/* Inner cutout of triangle */}
          <polygon
            points="14,30 11,67 36,67"
            fill={isLight ? '#002B49' : '#FFFFFF'}
          />

          {/* Gray Loop / Interlocking Circle */}
          <circle
            cx="44"
            cy="46"
            r="26"
            stroke="#9FA1A4"
            strokeWidth="7"
            fill="none"
          />
          <circle
            cx="44"
            cy="46"
            r="26"
            stroke="#C4C6C8"
            strokeWidth="3.5"
            fill="none"
          />

          {/* Blue Tilted Square / Diamond Outer */}
          <polygon
            points="70,12 102,44 70,76 38,44"
            fill="#B2B4B8"
          />
          {/* Blue Tilted Square Inner */}
          <polygon
            points="70,16 98,44 70,72 42,44"
            fill="#0066B2"
          />
          {/* Inner cutout of square */}
          <polygon
            points="70,28 86,44 70,60 54,44"
            fill={isLight ? '#002B49' : '#FFFFFF'}
          />
        </g>
      </svg>
    );
  }

  // Full FIRST® Primary Logo with iconic emblem and logotype
  return (
    <svg
      viewBox="0 0 320 85"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="FIRST® Official Logo"
    >
      <defs>
        <filter id="first-shadow" x="-5%" y="-5%" width="115%" height="115%">
          <feDropShadow dx="1" dy="1.5" stdDeviation="0.8" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* EMBLEM GROUP */}
      <g id="first-symbols" transform="translate(4, 2)" filter="url(#first-shadow)">
        {/* Red Triangle */}
        <g id="triangle-group">
          {/* Outer Bevel Frame */}
          <path
            d="M 17 6 L 2 74 L 56 74 Z"
            fill="#9FA1A4"
          />
          {/* Main Red Triangle */}
          <path
            d="M 17 11 L 6 70 L 51 70 Z"
            fill="#ED1C24"
          />
          {/* Triangle Core Opening */}
          <path
            d="M 18 27 L 13 60 L 41 60 Z"
            fill={isLight ? '#001A2E' : '#FFFFFF'}
          />
        </g>

        {/* Silver Circle Loop */}
        <g id="circle-loop">
          <path
            d="M 46 41 C 46 27.5 57 16.5 70.5 16.5 C 84 16.5 95 27.5 95 41 C 95 54.5 84 65.5 70.5 65.5 C 57 65.5 46 54.5 46 41 Z"
            stroke="#9FA1A4"
            strokeWidth="7"
            fill="none"
          />
          <path
            d="M 48 41 C 48 28.5 58 18.5 70.5 18.5 C 83 18.5 93 28.5 93 41 C 93 53.5 83 63.5 70.5 63.5 C 58 63.5 48 53.5 48 41 Z"
            stroke="#D1D3D4"
            strokeWidth="3"
            fill="none"
          />
        </g>

        {/* Blue Diamond / Tilted Square */}
        <g id="diamond-group">
          {/* Outer Bevel Frame */}
          <path
            d="M 94 8 L 124 38 L 94 68 L 64 38 Z"
            fill="#9FA1A4"
          />
          {/* Main Blue Diamond */}
          <path
            d="M 94 13 L 119 38 L 94 63 L 69 38 Z"
            fill="#0066B2"
          />
          {/* Diamond Core Opening */}
          <path
            d="M 94 25 L 107 38 L 94 51 L 81 38 Z"
            fill={isLight ? '#001A2E' : '#FFFFFF'}
          />
        </g>
      </g>

      {/* LOGOTYPE: "FIRST." */}
      <g id="first-typography" transform="translate(138, 10)">
        <text
          x="0"
          y="56"
          fill={textColor}
          fontFamily="'Arial Black', 'Impact', 'Montserrat', sans-serif"
          fontWeight="900"
          fontStyle="italic"
          fontSize="54"
          letterSpacing="-1.5"
        >
          FIRST
        </text>
        {/* Dot after FIRST */}
        <text
          x="162"
          y="56"
          fill={textColor}
          fontFamily="'Arial Black', 'Impact', sans-serif"
          fontWeight="900"
          fontStyle="italic"
          fontSize="54"
        >
          .
        </text>
        {/* Registered Trademark ® */}
        <text
          x="174"
          y="26"
          fill={textColor}
          fontFamily="'Arial', sans-serif"
          fontWeight="bold"
          fontSize="14"
        >
          ®
        </text>
      </g>
    </svg>
  );
};

interface SenaiLogoProps {
  className?: string;
  variant?: 'green' | 'white' | 'dark' | 'badge';
  withSubtitle?: boolean;
}

/**
 * Official SENAI (Serviço Nacional de Aprendizagem Industrial) Logo in Green
 * Uses official Brazilian SENAI Green: #00884A / #009639
 */
export const SenaiLogo: React.FC<SenaiLogoProps> = ({
  className = 'h-9 w-auto',
  variant = 'green',
  withSubtitle = false
}) => {
  const isWhite = variant === 'white';
  const fillColor = isWhite ? '#FFFFFF' : '#00884A'; // SENAI Official Green
  const subtextColor = isWhite ? '#E2E8F0' : '#006C35';

  return (
    <svg
      viewBox={withSubtitle ? "0 0 240 68" : "0 0 195 48"}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="SENAI Logo Verde"
    >
      <g id="senai-logotype">
        {/* Letter 'S' */}
        <path
          d="M 28 8.5 C 24 8.5 20.5 9.8 17.8 12.2 C 15.2 14.6 13.8 17.8 13.8 21.6 C 13.8 25.2 15 28.2 17.5 30.5 C 20 32.8 23.5 34.6 28 35.8 C 31.8 36.8 34.5 37.8 36 39 C 37.5 40.2 38.3 41.8 38.3 43.8 C 38.3 45.8 37.4 47.4 35.5 48.7 C 33.6 50 30.8 50.6 27 50.6 C 22.8 50.6 19.4 49.6 16.5 47.6 C 13.6 45.6 12 42.6 11.5 38.6 L 1 38.6 C 1.6 45.2 4.4 50.4 9.5 54.2 C 14.6 58 20.6 59.9 27.5 59.9 C 34.6 59.9 40.3 58.1 44.6 54.5 C 48.9 50.9 51 46.1 51 40.1 C 51 34.8 49.3 30.7 46 27.8 C 42.7 24.9 38 22.9 32 21.6 C 28.8 20.9 26.5 20.1 25.1 19.1 C 23.7 18.1 23 16.8 23 15.2 C 23 13.8 23.7 12.7 25.1 11.8 C 26.5 10.9 28.5 10.5 31.1 10.5 C 34.8 10.5 37.6 11.4 39.7 13.2 C 41.8 15 42.9 17.4 43.1 20.5 L 53 20.5 C 52.6 15.2 50.2 10.8 45.8 7.3 C 41.4 3.8 35.5 2 28 2 Z"
          fill={fillColor}
          transform="scale(0.8) translate(0, -2)"
        />

        {/* Letter 'E' */}
        <path
          d="M 58 2.5 H 93 V 11.5 H 68.5 V 23.5 H 89 V 32.5 H 68.5 V 45.5 H 93.5 V 54.5 H 58 Z"
          fill={fillColor}
          transform="scale(0.8) translate(-6, 2)"
        />

        {/* Letter 'N' */}
        <path
          d="M 97 2.5 H 107.5 L 126 34 V 2.5 H 136.5 V 54.5 H 126 L 107.5 23 V 54.5 H 97 Z"
          fill={fillColor}
          transform="scale(0.8) translate(-10, 2)"
        />

        {/* Letter 'A' */}
        <path
          d="M 152 2.5 H 163 L 180.5 54.5 H 169.5 L 165.5 42.5 H 149.5 L 145.5 54.5 H 134.5 Z M 157.5 17 L 152.2 34 H 162.8 Z"
          fill={fillColor}
          transform="scale(0.8) translate(-14, 2)"
        />

        {/* Letter 'I' */}
        <path
          d="M 183 2.5 H 194 V 54.5 H 183 Z"
          fill={fillColor}
          transform="scale(0.8) translate(-16, 2)"
        />
      </g>

      {/* Optional Subtitle / Descriptor */}
      {withSubtitle && (
        <g id="senai-descriptor" transform="translate(0, 52)">
          <text
            x="2"
            y="11"
            fill={subtextColor}
            fontFamily="'Montserrat', 'Arial', sans-serif"
            fontWeight="700"
            fontSize="8.5"
            letterSpacing="0.4"
          >
            SERVIÇO NACIONAL DE APRENDIZAGEM INDUSTRIAL
          </text>
        </g>
      )}
    </svg>
  );
};

/**
 * Co-Branded Lockup: FIRST® + SENAI Verde
 * Used in headers, heroes, sponsor showcases, and footers.
 */
export const FirstSenaiCoBrand: React.FC<{
  variant?: 'light' | 'dark' | 'compact';
  className?: string;
}> = ({ variant = 'light', className = '' }) => {
  const isDark = variant === 'dark';

  if (variant === 'compact') {
    return (
      <div className={`inline-flex items-center gap-3 ${className}`}>
        <FirstLogo className="h-8 w-auto" variant={isDark ? 'light' : 'color'} />
        <span className={`h-6 w-px ${isDark ? 'bg-slate-700' : 'bg-slate-300'}`} />
        <div className="flex flex-col">
          <SenaiLogo className="h-5 w-auto" variant={isDark ? 'white' : 'green'} />
          <span className="text-[9px] font-bold uppercase tracking-wider text-[#00884A]">
            Operador Oficial Brasil
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-3 sm:gap-4 p-2 sm:p-2.5 rounded-2xl border transition-all ${
        isDark
          ? 'bg-slate-900/80 border-slate-800 text-white'
          : 'bg-white border-slate-200 text-[#002B49] shadow-xs'
      } ${className}`}
    >
      <FirstLogo className="h-9 sm:h-10 w-auto" variant={isDark ? 'light' : 'color'} />
      <span className={`h-8 w-px ${isDark ? 'bg-slate-700' : 'bg-slate-300'}`} />
      <div className="flex flex-col">
        <SenaiLogo className="h-6 sm:h-7 w-auto" variant={isDark ? 'white' : 'green'} withSubtitle={false} />
        <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#00884A] mt-0.5">
          Parceiro Operacional Nacional
        </span>
      </div>
    </div>
  );
};
