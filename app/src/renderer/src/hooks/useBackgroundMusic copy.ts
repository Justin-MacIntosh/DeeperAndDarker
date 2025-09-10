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
  howlInstance?: Howl; // Optional property to hold the Howl instance

  // Optional interval properties
  interval?: {
    intervalMilliseconds: number;
    intervalId?: NodeJS.Timeout; // Optional property to hold the interval ID
  }
}
const createSoundsFromConfig = (soundConfigs: SoundConfig[]) => {
  return soundConfigs.map(
    config => {
      const howl =  new Howl({
        src: [config.soundPath],
        volume: 0.0,
        loop: config.loop,
      });
      howl.on('fade', () => {
        console.log(`Fade event for sound: ${config.soundPath}, current volume: ${howl.volume()}`);
        if (howl.volume() === 0.0) {
          // Unload the sound after a fade out to free up resources
          howl.unload();
          console.log(`Unloaded sound: ${config.soundPath}`);
        }
      });
      return { ...config, howlInstance: howl };
    }
  );
}

export const useBackgroundMusic = (backgroundMusicConfig: BackgroundMusicConfig) => {
  const sounds = useRef<SoundConfig[]>(createSoundsFromConfig(backgroundMusicConfig.sounds));

  const playSound = (sound: SoundConfig) => {
    console.log(`Attempting to play sound: ${sound.soundPath}`);
    console.log(`Howl instance exists: ${!!sound.howlInstance}`);
    console.log(`Is sound already playing: ${sound.howlInstance?.playing()}`);
    if (!sound.howlInstance || sound.howlInstance.playing()) return;
    sound.howlInstance.volume(0.0);
    if (sound.startPosition) {
      sound.howlInstance.seek(sound.startPosition);
    }
    sound.howlInstance.play();
    sound.howlInstance.fade(0.01, sound.targetVolume, sound.fadeInDuration);
  }

  useEffect(() => {
    for (const sound of sounds.current) {
      console.log(`Starting background sound: ${sound.soundPath}`);
      playSound(sound);
      if (sound.interval) {
        // Store the interval ID in the sound config for potential cleanup later
        sound.interval.intervalId = setInterval(
          () => playSound(sound),
          sound.interval.intervalMilliseconds
        );
      }
    }

    return () => {
      console.log('Cleaning up background music sounds');
      for (const sound of sounds.current) {
        if (sound.interval && sound.interval.intervalId) {
          clearInterval(sound.interval.intervalId);
        }
        if (sound.howlInstance && sound.howlInstance.playing()) {
          console.log(`Fading out and stopping sound: ${sound.soundPath}`);
          sound.howlInstance.fade(sound.howlInstance.volume(), 0.0, 3000);
        }
      }
    };
  }, []);
}
