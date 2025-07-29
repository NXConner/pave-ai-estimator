import React, { useEffect, useCallback } from 'react';
import { toast } from 'sonner';

interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  action: () => void;
  description: string;
}

interface KeyboardShortcutsProps {
  shortcuts: KeyboardShortcut[];
  enabled?: boolean;
}

export const useKeyboardShortcuts = (shortcuts: KeyboardShortcut[], enabled = true) => {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    const matchingShortcut = shortcuts.find(shortcut => {
      return (
        shortcut.key.toLowerCase() === event.key.toLowerCase() &&
        !!shortcut.ctrlKey === event.ctrlKey &&
        !!shortcut.altKey === event.altKey &&
        !!shortcut.shiftKey === event.shiftKey
      );
    });

    if (matchingShortcut) {
      event.preventDefault();
      event.stopPropagation();
      matchingShortcut.action();
    }
  }, [shortcuts, enabled]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
};

export const KeyboardShortcutsProvider: React.FC<KeyboardShortcutsProps> = ({ 
  shortcuts, 
  enabled = true 
}) => {
  useKeyboardShortcuts(shortcuts, enabled);
  return null;
};

export const getShortcutDisplay = (shortcut: KeyboardShortcut): string => {
  const keys: string[] = [];
  
  if (shortcut.ctrlKey) keys.push('Ctrl');
  if (shortcut.altKey) keys.push('Alt');
  if (shortcut.shiftKey) keys.push('Shift');
  keys.push(shortcut.key.toUpperCase());
  
  return keys.join(' + ');
};

// Common shortcuts for the application
export const createPaveEstimatorShortcuts = (
  onExportPDF: () => void,
  onExportExcel: () => void,
  onClearMeasurements: () => void,
  onToggleDrawing: () => void,
  onZoomIn: () => void,
  onZoomOut: () => void,
  onResetView: () => void
): KeyboardShortcut[] => [
  {
    key: 'p',
    ctrlKey: true,
    action: () => {
      onExportPDF();
      toast.success('Exporting to PDF... (Ctrl+P)');
    },
    description: 'Export estimate to PDF'
  },
  {
    key: 'e',
    ctrlKey: true,
    action: () => {
      onExportExcel();
      toast.success('Exporting to Excel... (Ctrl+E)');
    },
    description: 'Export estimate to Excel'
  },
  {
    key: 'Delete',
    action: () => {
      onClearMeasurements();
      toast.success('All measurements cleared (Delete)');
    },
    description: 'Clear all measurements'
  },
  {
    key: 'd',
    ctrlKey: true,
    action: () => {
      onToggleDrawing();
      toast.info('Drawing mode toggled (Ctrl+D)');
    },
    description: 'Toggle drawing mode'
  },
  {
    key: '=',
    ctrlKey: true,
    action: () => {
      onZoomIn();
      toast.info('Zoomed in (Ctrl++)');
    },
    description: 'Zoom in on map'
  },
  {
    key: '-',
    ctrlKey: true,
    action: () => {
      onZoomOut();
      toast.info('Zoomed out (Ctrl+-)');
    },
    description: 'Zoom out on map'
  },
  {
    key: '0',
    ctrlKey: true,
    action: () => {
      onResetView();
      toast.info('Map view reset (Ctrl+0)');
    },
    description: 'Reset map view'
  },
  {
    key: '?',
    ctrlKey: true,
    action: () => {
      toast.info('Keyboard shortcuts available - check the help panel');
    },
    description: 'Show keyboard shortcuts help'
  }
];

export default KeyboardShortcutsProvider;