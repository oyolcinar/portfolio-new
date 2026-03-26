import { useRef, useState, useCallback, useEffect } from 'react';

interface DragState {
  x: number;
  y: number;
}

interface UseDraggableOptions {
  defaultPosition?: DragState;
  lockedPosition?: DragState | null;
  disabled?: boolean;
  /** When true, e.preventDefault() is NOT called on pointerdown so clicks still fire. */
  allowClicks?: boolean;
}

export function useDraggable(options: UseDraggableOptions = {}) {
  const {
    defaultPosition,
    lockedPosition,
    disabled = false,
    allowClicks = false,
  } = options;
  const [position, setPosition] = useState<DragState>(
    defaultPosition ?? { x: 0, y: 0 },
  );

  const dragging = useRef(false);
  const didDrag = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const startPos = useRef({ x: 0, y: 0 });
  const posRef = useRef(position);
  posRef.current = position;

  const DRAG_THRESHOLD = 4;

  const onDocPointerMove = useCallback((e: PointerEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - startPos.current.x;
    const dy = e.clientY - startPos.current.y;
    if (
      !didDrag.current &&
      Math.abs(dx) < DRAG_THRESHOLD &&
      Math.abs(dy) < DRAG_THRESHOLD
    ) {
      return; // haven't moved enough to be a drag yet
    }
    didDrag.current = true;
    setPosition({
      x: e.clientX - offset.current.x,
      y: e.clientY - offset.current.y,
    });
  }, []);

  const onDocPointerUp = useCallback(() => {
    dragging.current = false;
    didDrag.current = false;
    document.removeEventListener('pointermove', onDocPointerMove);
    document.removeEventListener('pointerup', onDocPointerUp);
  }, [onDocPointerMove]);

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (disabled) return;

      const target = e.target as HTMLElement;
      if (target.closest('[data-no-drag]')) return;
      const tag = target.tagName;
      if (['INPUT', 'TEXTAREA', 'BUTTON', 'SELECT'].includes(tag)) return;

      if (!allowClicks) {
        e.preventDefault();
      }

      dragging.current = true;
      didDrag.current = false;
      startPos.current = { x: e.clientX, y: e.clientY };
      offset.current = {
        x: e.clientX - posRef.current.x,
        y: e.clientY - posRef.current.y,
      };

      document.addEventListener('pointermove', onDocPointerMove);
      document.addEventListener('pointerup', onDocPointerUp);
    },
    [disabled, allowClicks, onDocPointerMove, onDocPointerUp],
  );

  useEffect(() => {
    return () => {
      document.removeEventListener('pointermove', onDocPointerMove);
      document.removeEventListener('pointerup', onDocPointerUp);
    };
  }, [onDocPointerMove, onDocPointerUp]);

  const displayPosition = lockedPosition ?? position;

  const containerStyle: React.CSSProperties = {
    transform: `translate(${displayPosition.x}px, ${displayPosition.y}px)`,
  };

  const handleProps = {
    onPointerDown,
    style: { touchAction: 'none' as const, cursor: 'default' as const },
  };

  return { containerStyle, handleProps, position, setPosition };
}
