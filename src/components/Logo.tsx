import React from 'react';

export default function Logo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      {/* Background Shape - A slightly rounded square for a modern, architectural feel */}
      <rect x="10" y="10" width="80" height="80" rx="20" fill="currentColor" />
      
      {/* The "D" - Stylized and geometric */}
      <path 
        d="M35 30V70H50C61.0457 70 70 61.0457 70 50C70 38.9543 61.0457 30 50 30H35ZM45 40H50C55.5228 40 60 44.4772 60 50C60 55.5228 55.5228 60 50 60H45V40Z" 
        fill="white" 
      />
      
      {/* Accent Dot - Represents "dept." or precision */}
      <circle cx="75" cy="75" r="8" fill="#FF4E00" />
    </svg>
  );
}
