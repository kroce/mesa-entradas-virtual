import { useEffect } from 'react';
import type { Dispatch, SetStateAction } from 'react';

export function useAutoClearMessage(
  message: string | null,
  setMessage: Dispatch<SetStateAction<string | null>>,
  delayInMs = 4000,
) {
  useEffect(() => {
    if (!message) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setMessage(null);
    }, delayInMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [message, setMessage, delayInMs]);
}
