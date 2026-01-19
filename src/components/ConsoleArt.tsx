import { useEffect } from 'react';
import { initConsoleArt } from '../lib/console-art';

export default function ConsoleArt() {
  useEffect(() => {
    initConsoleArt();
  }, []);

  // This component renders nothing - it just initializes the console art
  return null;
}
