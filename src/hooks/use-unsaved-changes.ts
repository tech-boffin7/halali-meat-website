'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Hook to warn users about unsaved changes before leaving the page
 * @param hasUnsavedChanges - Boolean indicating if there are unsaved changes
 * @param message - Optional custom warning message
 */
export function useUnsavedChanges(
  hasUnsavedChanges: boolean,
  message = 'You have unsaved changes. Are you sure you want to leave?'
) {
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    // Browser beforeunload event
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = message; // Standard way to trigger browser dialog
        return message;
      }
    };

    // Add event listener
    if (hasUnsavedChanges) {
      window.addEventListener('beforeunload', handleBeforeUnload);
      setShowWarning(true);
    } else {
      setShowWarning(false);
    }

    // Cleanup
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges, message]);

  return { showWarning };
}

/**
 * Hook to track if form values have changed from initial state
 * @param initialValues - Initial form values
 * @param currentValues - Current form values
 * @returns Boolean indicating if values have changed
 */
export function useFormChanges<T extends Record<string, any>>(
  initialValues: T,
  currentValues: T
): boolean {
  const initialRef = useRef(initialValues);

  // Deep comparison of objects
  const hasChanges = JSON.stringify(initialRef.current) !== JSON.stringify(currentValues);

  return hasChanges;
}
