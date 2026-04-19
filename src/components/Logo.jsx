import React from 'react';

const Logo = ({ width = 240, height = 75, style }) => (
  <svg width={width} height={height} viewBox="0 0 320 100" xmlns="http://www.w3.org/2000/svg" style={style}>
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00f5d4"/>
        <stop offset="100%" stopColor="#3a86ff"/>
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>

    {/* Brain / Network Icon */}
    <g transform="translate(20,20)" filter="url(#glow)">
      <circle cx="20" cy="20" r="6" fill="url(#grad)"/>
      <circle cx="50" cy="10" r="5" fill="url(#grad)"/>
      <circle cx="60" cy="35" r="6" fill="url(#grad)"/>
      <circle cx="35" cy="50" r="5" fill="url(#grad)"/>
      <circle cx="10" cy="40" r="5" fill="url(#grad)"/>

      <line x1="20" y1="20" x2="50" y2="10" stroke="url(#grad)" strokeWidth="2"/>
      <line x1="50" y1="10" x2="60" y2="35" stroke="url(#grad)" strokeWidth="2"/>
      <line x1="60" y1="35" x2="35" y2="50" stroke="url(#grad)" strokeWidth="2"/>
      <line x1="35" y1="50" x2="10" y2="40" stroke="url(#grad)" strokeWidth="2"/>
      <line x1="10" y1="40" x2="20" y2="20" stroke="url(#grad)" strokeWidth="2"/>
    </g>

    {/* Text */}
    <text x="100" y="50" fontFamily="Segoe UI, Arial, sans-serif" fontSize="26" fill="white" fontWeight="600">
      CrowdBrain
    </text>

    <text x="100" y="75" fontFamily="Segoe UI, Arial, sans-serif" fontSize="14" fill="#00f5d4">
      AI • Crowd Intelligence
    </text>
  </svg>
);

export default Logo;
