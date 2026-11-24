'use client';

import React from 'react';
import { LogoShape, LogoMode, CrestIcon } from '@/types';

interface BrandLogoRendererProps {
  shape?: LogoShape;
  mode?: LogoMode;
  crestIcon?: CrestIcon;
  monogram?: string;
  imageSrc?: string;
  imageFit?: 'cover' | 'contain';
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  showSteam?: boolean;
}

export function BrandLogoRenderer({
  shape = 'squircle',
  mode = 'crest',
  crestIcon = 'kulhad',
  monogram = 'SJ',
  imageSrc = '',
  imageFit = 'cover',
  size = 'md',
  className = '',
  showSteam = true,
}: BrandLogoRendererProps) {
  const sizeMap = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-11 h-11 text-sm',
    lg: 'w-16 h-16 text-lg',
    xl: 'w-24 h-24 text-2xl',
    '2xl': 'w-32 h-32 text-4xl',
  };

  const getShapeStyle = () => {
    switch (shape) {
      case 'circle':
        return { borderRadius: '9999px' };
      case 'shield':
        return { clipPath: 'polygon(0% 0%, 100% 0%, 100% 75%, 50% 100%, 0% 75%)' };
      case 'hexagon':
        return { clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' };
      case 'diamond':
        return { clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' };
      case 'squircle':
      default:
        return { borderRadius: size === 'sm' ? '0.5rem' : size === 'md' ? '0.85rem' : '1.25rem' };
    }
  };

  const renderCrestGlyph = () => {
    switch (crestIcon) {
      case 'kettle':
        return <i className="fa-solid fa-mug-hot drop-shadow-md"></i>;
      case 'flame':
        return <i className="fa-solid fa-fire-flame-curved drop-shadow-md text-amber-200"></i>;
      case 'royal':
        return <i className="fa-solid fa-crown drop-shadow-md text-amber-300"></i>;
      case 'kulhad':
      default:
        return <i className="fa-solid fa-mug-saucer drop-shadow-md"></i>;
    }
  };

  return (
    <div className={`relative inline-flex items-center justify-center select-none ${className}`}>
      {showSteam && (
        <span
          className="absolute -top-2 left-1/2 -translate-x-1/2 text-orange-200 opacity-80 pointer-events-none animate-pulse text-[10px]"
          aria-hidden="true"
        >
          ♨️
        </span>
      )}

      <div
        style={getShapeStyle()}
        className={`${sizeMap[size]} flex items-center justify-center font-black shadow-md border border-white/60 text-white overflow-hidden transition-all duration-300 ${
          mode === 'image' && imageSrc
            ? 'bg-stone-900'
            : 'bg-gradient-to-br from-[#C2410C] via-[#EA580C] to-[#78350F]'
        }`}
      >
        {mode === 'image' && imageSrc ? (
          <img
            src={imageSrc}
            alt="Sharma Ji Ki Tapri Logo"
            className={`w-full h-full ${imageFit === 'contain' ? 'object-contain p-1' : 'object-cover'}`}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center leading-none text-center">
            <span className="leading-none">{renderCrestGlyph()}</span>
            {monogram && size !== 'sm' && (
              <span className="text-[9px] font-mono font-extrabold tracking-wider uppercase mt-0.5 text-amber-200">
                {monogram}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
