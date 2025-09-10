import { createContext } from "react";
import { Howl } from 'howler';

export type CommonSoundsContextType = {
  buttonPress: Howl;
  popup: Howl;
};


const popupSoundRef = new Howl({
  src: ['src/assets/audio/common/Popup_Open.mp3'],
  volume: 0.1,
});

const buttonPressSound = new Howl({
  src: ['src/assets/audio/common/Button_Press.mp3'],
  volume: 0.1,
});
export const COMMON_SOUNDS: CommonSoundsContextType = {
  buttonPress: buttonPressSound,
  popup: popupSoundRef,
};

export const CommonSoundsContext = createContext<CommonSoundsContextType>(COMMON_SOUNDS);