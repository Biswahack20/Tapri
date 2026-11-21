'use client';

import React from 'react';
import { useTapri } from '@/context/TapriContext';
import { LogoConfig } from '@/data/mockData';
import Image from 'next/image';

interface LogoRendererProps {
  config?: LogoConfig;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showText?: boolean;
}

export const LogoRenderer: React.FC<LogoRendererProps> = ({
  config: propConfig,
  size = 'md',
  className = '',
  showText = false,
}) => {
  const { shopProfile } = useTapri();
  const config = propConfig || shopProfile.logoConfig;

  // Size dimensions map
  const sizeMap = {
    xs: { width: 36, height: 36, text: 'text-[9px]', iconSize: 18, border: 'border-[1.5px]' },
    sm: { width: 48, height: 48, text: 'text-[11px]', iconSize: 24, border: 'border-2' },
    md: { width: 72, height: 72, text: 'text-sm', iconSize: 36, border: 'border-2' },
    lg: { width: 110, height: 110, text: 'text-lg', iconSize: 52, border: 'border-3' },
    xl: { width: 150, height: 150, text: 'text-2xl', iconSize: 72, border: 'border-4' },
  };

  const currentSize = sizeMap[size];

  // Clip paths / shape border radii
  const getShapeStyle = () => {
    switch (config.badgeShape) {
      case 'circle':
        return 'rounded-full';
      case 'stamp':
        // Vintage stamp serrated look with subtle scalloped border
        return 'rounded-2xl shadow-inner';
      case 'shield':
        return 'rounded-t-2xl rounded-b-3xl';
      case 'hex':
        return 'rounded-xl';
      case 'retro':
        return 'rounded-3xl';
      default:
        return 'rounded-full';
    }
  };

  // Icon path helper
  const getIconSrc = () => {
    switch (config.iconType) {
      case 'kulhad':
        return '/icons/kulhad.svg';
      case 'bun':
        return '/icons/bun-maska.svg';
      case 'samosa':
        return '/icons/samosa.svg';
      case 'chai':
      default:
        return '/icons/chai-glass.svg';
    }
  };

  return (
    <div className={`relative inline-flex flex-col items-center justify-center select-none ${className}`}>
      {/* Outer badge wrapper */}
      <div
        className={`relative flex items-center justify-center overflow-hidden transition-all duration-300 ${getShapeStyle()}`}
        style={{
          width: currentSize.width,
          height: currentSize.height,
          backgroundColor: config.primaryColor,
          borderColor: config.borderColor || '#7C2D12',
          borderWidth: size === 'xs' ? '2px' : '3px',
          borderStyle: config.badgeShape === 'stamp' ? 'dashed' : 'solid',
          boxShadow: '0 4px 14px rgba(0,0,0,0.18)',
        }}
      >
        {/* Inner concentric ring */}
        <div
          className={`absolute inset-1 flex items-center justify-center transition-all ${getShapeStyle()}`}
          style={{
            backgroundColor: config.secondaryColor,
            border: `1.5px ${config.badgeShape === 'stamp' ? 'dotted' : 'solid'} ${config.accentColor}`,
          }}
        >
          {/* Steam wisps when enabled */}
          {config.showSteam && (
            <div className="absolute -top-1 pointer-events-none flex items-center justify-center gap-1 z-10 opacity-75">
              <span className="w-1 h-2.5 bg-amber-100 rounded-full animate-steam" style={{ animationDelay: '0s' }} />
              <span className="w-1 h-3.5 bg-orange-100 rounded-full animate-steam" style={{ animationDelay: '0.6s' }} />
              <span className="w-1 h-2 bg-amber-100 rounded-full animate-steam" style={{ animationDelay: '1.2s' }} />
            </div>
          )}

          {/* Core content: Monogram or Icon */}
          {config.useMonogram ? (
            <div
              className={`font-black tracking-wider uppercase font-sans drop-shadow-md ${currentSize.text}`}
              style={{ color: config.accentColor }}
            >
              {config.monogramText || 'CT'}
            </div>
          ) : (
            <div className="relative flex items-center justify-center p-1">
              <Image
                src={getIconSrc()}
                alt={config.iconType}
                width={currentSize.iconSize}
                height={currentSize.iconSize}
                className="object-contain drop-shadow"
                priority
              />
            </div>
          )}
        </div>
      </div>

      {/* Optional Brand Text underneath */}
      {showText && (
        <div className="mt-1.5 text-center">
          <p className="font-bold text-slate-900 tracking-tight text-xs uppercase">
            {shopProfile.name}
          </p>
          <p className="text-[10px] text-amber-800 font-medium">
            {shopProfile.hindiTagline || 'असली कड़क स्वाद'}
          </p>
        </div>
      )}
    </div>
  );
};
