import { useEffect, useRef } from 'react';
import { Howl } from 'howler';

export interface BackgroundMusicConfig {
  sounds: SoundConfig[];
}
interface SoundConfig {
  soundPath: string;
  targetVolume: number;
  loop: boolean;
  fadeInDuration: number;
  startPosition?: number; // in seconds
  interval?: {
    intervalMilliseconds: number;
  };
}

export const useBackgroundMusic = (backgroundMusicConfig: BackgroundMusicConfig) => {
  console.log('useBackgroundMusic Hook:', backgroundMusicConfig.sounds[0]?.soundPath);
  const soundsRef = useRef<Howl[]>([]);
  const intervalsRef = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    console.log('useBackgroundMusic -> useEffect Body:', backgroundMusicConfig.sounds[0]?.soundPath);
    
    const newHowls = backgroundMusicConfig.sounds.map((config) => {
      const howl = new Howl({
        src: [config.soundPath],
        volume: 0.0,
        loop: config.loop,
      });

      // Play + fade in
      howl.seek(config.startPosition || 0);
      howl.play();
      howl.fade(0, config.targetVolume, config.fadeInDuration);

      // Handle interval restarts
      if (config.interval) {
        const intervalId = setInterval(() => {
          if (!howl.playing()) {
            howl.seek(config.startPosition || 0);
            howl.play();
            howl.fade(0.01, config.targetVolume, config.fadeInDuration);
          }
        }, config.interval.intervalMilliseconds);
        intervalsRef.current.push(intervalId);
      }

      return howl;
    });

    soundsRef.current = newHowls;

    return () => {
      console.log('useBackgroundMusic clean up:', backgroundMusicConfig.sounds[0]?.soundPath);

      // Cleanup intervals
      intervalsRef.current.forEach(clearInterval);
      intervalsRef.current = [];

      // Fade out then unload
      newHowls.forEach((howl) => {
        if (howl.playing()) {
          howl.fade(howl.volume(), 0, 3000);
          setTimeout(() => howl.unload(), 3100); // ensure resources are freed
        } else {
          howl.unload();
        }
      });
    };
  }, [backgroundMusicConfig]);
};
