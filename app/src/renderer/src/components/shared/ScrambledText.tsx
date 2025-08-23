import { useEffect, useState, useRef } from 'react';

const scrambleString = (str: string, safeIndexes: number[]) => {
  const chars = '&#*+%?£@§$_=-/:;|<>.,()![]{}\\^';
  let scrambled = '';
  for (let charIdx = 0; charIdx < str.length; charIdx++) {
    if (str[charIdx] === ' ' || safeIndexes.includes(charIdx)) {
      scrambled += str[charIdx];
    } else {
      scrambled += chars.charAt(Math.floor(Math.random() * chars.length));
    }
  }
  return scrambled;
}

const ScrambledText = ({targetText}: {targetText: string}) => {
  let [displayedText, setDisplayedText] = useState(
    scrambleString(targetText, [])
  );
  let unsafeIndexes = useRef<number[]>(targetText.split('').map((_, idx) => idx));
  let safeIndexes = useRef<number[]>([]);

  const updateScrambleState = (unscrambleIntervalId: NodeJS.Timeout) => {
    const nextSafeIndex: number = unsafeIndexes.current[Math.floor(Math.random() * unsafeIndexes.current.length)];
    safeIndexes.current = [ ...safeIndexes.current, nextSafeIndex ];
    unsafeIndexes.current = unsafeIndexes.current.filter((idx) => idx !== nextSafeIndex);

    setDisplayedText(scrambleString(targetText, safeIndexes.current));

    if (safeIndexes.current.length >= targetText.length) {
      clearInterval(unscrambleIntervalId);
      return;
    }
  }

  useEffect(() => {
    const unscrambleIntervalId = setInterval(() => {
      updateScrambleState(unscrambleIntervalId);
    }, 80);
    return () => clearInterval(unscrambleIntervalId);
  }, []);

  return <>{displayedText}</>;
}

export default ScrambledText;