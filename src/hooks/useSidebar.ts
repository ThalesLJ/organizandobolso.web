import { useState, useCallback } from 'react';

export function useSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  return {
    isOpen,
    toggle,
    close,
    open
  };
}
