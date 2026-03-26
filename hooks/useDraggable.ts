import { useRef, useState, useCallback, useEffect } from 'react';

interface DragState {
  x: number;
  y: number;
}

interface UseDraggableOptions {
  /** Initial position offset */
  defaultPosition?: DragState;
  /** Lock position (e.g. when fullscreen) */
  lockedPosition?: DragState | null;
  /** Disable dragging */
  disabled?: boolean;
}

export function useDraggable(options: UseDraggableOptions = {}) {
  const { defaultPosition, lockedPosition, disabled = false } = options;
  const nodeRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<DragState>(
    defaultPosition ?? { x: 0, y: 0 },
  );
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (disabled) return;
      // Only drag from the element itself or its title bar, not from inputs/buttons
      const tag = (e.target as HTMLElement).tagName;
      if (['INPUT', 'TEXTAREA', 'BUTTON', 'SELECT', 'IMG'].includes(tag))
        return;

      dragging.current = true;
      offset.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      };
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    },
    [disabled, position],
  );

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    const newX = e.clientX - offset.current.x;
    const newY = e.clientY - offset.current.y;
    setPosition({ x: newX, y: newY });
  }, []);

  const onPointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    dragging.current = false;
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
  }, []);

  const displayPosition = lockedPosition ?? position;

  const dragProps = {
    ref: nodeRef,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    style: {
      transform: `translate(${displayPosition.x}px, ${displayPosition.y}px)`,
      touchAction: 'none' as const,
    },
  };

  return { dragProps, position, setPosition, nodeRef };
}
