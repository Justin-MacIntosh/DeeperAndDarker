import { createContext } from "react";
import { Howl } from 'howler';

export type CommonSoundsContextType = {
  buttonPress: Howl;
};

const popupSound = new Howl({
  src: ['src/assets/audio/Button_Press.mp3'],
  onend: () => {
    console.log('Sound finished playing!');
  },
  volume: 0.1,
});
export const COMMON_SOUNDS: CommonSoundsContextType = {
  buttonPress: popupSound,
};

export const CommonSoundsContext = createContext<CommonSoundsContextType>(COMMON_SOUNDS);