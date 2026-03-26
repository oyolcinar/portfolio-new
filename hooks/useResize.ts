import { useCallback, useRef } from 'react';
import type { Size } from '@/types';

const MIN_SIZE = 300;

export function useResize(
  size: Size,
  onResize: (size: Size) => void
) {
  const dragRef = useRef({ active: false, x: 0, y: 0 });

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dragRef.current = { active: true, x: e.clientX, y: e.clientY };
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    []
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      const drag = dragRef.current;
      if (!drag.active) return;

      const dx = e.clientX - drag.x;
      const dy = e.clientY - drag.y;
      dragRef.current = { ...drag, x: e.clientX, y: e.clientY };

      const newW = Math.max(MIN_SIZE, size.w + dx);
      const newH = Math.max(MIN_SIZE, size.h + dy);
      onResize({ w: newW, h: newH });
    },
    [size, onResize]
  );

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      dragRef.current.active = false;
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    },
    []
  );

  return { onPointerDown, onPointerMove, onPointerUp };
}
