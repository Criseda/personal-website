import { useContext } from 'react';
import { MusicGeneratorContext, MusicGeneratorContextType } from './MusicGeneratorContext';

export const useMusicGenerator = (): MusicGeneratorContextType => {
  const context = useContext(MusicGeneratorContext);
  if (context === undefined) {
    throw new Error('useMusicGenerator must be used within a MusicGeneratorProvider');
  }
  return context;
};
