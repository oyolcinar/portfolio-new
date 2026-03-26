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
    <div ref={ref} className='sound-control-container'>
      <div className='sound-control-header'>Volume</div>
      <div className='sound-control-body'>
        <div className='sound-control-triangle' />
        <div className='sound-control-slider-wrap'>
          <input
            type='range'
            className='sound-control-slider'
            min='0'
            max='100'
            defaultValue='50'
          />
        </div>
      </div>
      <label className='sound-control-mute-label'>
        <span style={{ textDecoration: 'underline' }}>M</span>ute
        <input type='checkbox' className='sound-control-mute-input' />
        <span className='sound-control-checkmark' />
      </label>
    </div>
  );
}
