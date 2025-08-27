import { useEffect } from 'react';

import { Howl } from 'howler';

export const useBackgroundMusic = (stageId: string) => {

  const buzzingSound = new Howl({
    src: ['src/assets/audio/Fluorescent_Noise.m4a'],
    volume: 0.0,
    loop: true,
  });

  useEffect(() => {
  }, [stageId]);
}