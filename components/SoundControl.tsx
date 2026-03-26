'use client';

import { useRef } from 'react';
import { useClickOutside } from '@/hooks/useClickOutside';

interface SoundControlProps {
  onClose: () => void;
}

export default function SoundControl({ onClose }: SoundControlProps) {
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, onClose);

  return (
    <div
      ref={ref}
      className="absolute w-[100px] h-[180px] bg-[#c0c0c0] z-[99] bottom-[38px] right-[80px] flex flex-col justify-center"
      style={{
        border: '2px solid #08080e',
        borderTopColor: 'white',
        borderLeftColor: 'white',
      }}
    >
      <div className="flex justify-center items-center text-[0.50rem]">
        Volume
      </div>
      <div className="mt-[10px] flex flex-row justify-start items-center">
        <div
          className="w-[25px] h-[100px] bg-[#d2d2d2]"
          style={{
            clipPath: 'polygon(30% 0%, 100% 0%, 100% 100%)',
            border: '1px solid #08080e',
            borderTopColor: 'white',
          }}
        />
        <input
          type="range"
          className="h-[100px] ml-5 w-[2px] outline-none"
          style={{
            WebkitAppearance: 'slider-vertical',
            writingMode: 'vertical-rl' as React.CSSProperties['writingMode'],
            background: '#08080e',
            border: '1px solid #08080e',
            borderRightColor: '#a0a0a0',
          }}
          min="0"
          max="100"
          defaultValue="50"
        />
      </div>
      <label className="relative pl-[31px] pb-[10px] text-[0.50rem]">
        <span className="underline">M</span>ute
        <input type="checkbox" className="appearance-none bg-white" />
        <span
          className="absolute bottom-[10px] left-[11px] w-[15px] h-[15px] bg-white"
          style={{
            border: '2px inset #08080e',
            borderBottomColor: 'white',
            borderRightColor: 'white',
          }}
        />
      </label>
    </div>
  );
}
