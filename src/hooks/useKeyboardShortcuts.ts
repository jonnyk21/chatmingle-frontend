
import { useEffect } from 'react';

interface KeyboardShortcutsOptions {
  onThemeToggle?: () => void;
  onFocusInput?: () => void;
  onScrollToBottom?: () => void;
  onSearchFocus?: () => void;
  onCommandMenuOpen?: () => void;
}

export const useKeyboardShortcuts = ({
  onThemeToggle,
  onFocusInput,
  onScrollToBottom,
  onSearchFocus,
  onCommandMenuOpen,
}: KeyboardShortcutsOptions = {}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt+N to focus input
      if (e.altKey && e.key === 'n') {
        e.preventDefault();
        onFocusInput?.();
      }

      // Alt+S to scroll to bottom
      if (e.altKey && e.key === 's') {
        e.preventDefault();
        onScrollToBottom?.();
      }

      // Alt+T to toggle theme
      if (e.altKey && e.key === 't') {
        e.preventDefault();
        onThemeToggle?.();
      }

      // / to focus search
      if (e.key === '/' && !isInputElement(document.activeElement)) {
        e.preventDefault();
        onSearchFocus?.();
      }

      // Ctrl+K to open command menu
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        onCommandMenuOpen?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onThemeToggle, onFocusInput, onScrollToBottom, onSearchFocus, onCommandMenuOpen]);
};

// Helper function to check if the active element is an input/textarea/editable element
const isInputElement = (element: Element | null): boolean => {
  if (!element) return false;
  
  const tag = element.tagName.toLowerCase();
  if (tag === 'input' || tag === 'textarea' || tag === 'select') return true;

  const contentEditable = element.getAttribute('contenteditable');
  if (contentEditable === 'true' || contentEditable === '') return true;

  return false;
};

export default useKeyboardShortcuts;
