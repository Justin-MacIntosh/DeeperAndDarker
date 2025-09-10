import React, { memo, ReactNode, useContext, useEffect, useState } from 'react';

import { motion } from "motion/react";
import { Howl } from 'howler';

import { CommonSoundsContext } from '../../audio/CommonSoundsContext';
import ScrambledText from '../shared/ScrambledText';

import { useBackgroundMusic, BackgroundMusicConfig } from '../../hooks/useBackgroundMusic';

import './corporate-style.css';

const CORP_BG_MUCIC_CONFIG: BackgroundMusicConfig = {
  sounds: [
    {
      soundPath: 'src/assets/audio/Corp_FluorescentNoise.m4a',
      loop: true,
      targetVolume: 0.4,
      fadeInDuration: 5000,
    },
    {
      soundPath: 'src/assets/audio/Corp_CaveSound.wav',
      loop: false,
      targetVolume: 0.2,
      fadeInDuration: 10000,

      // Repeat every 50 seconds
      interval: {
        intervalMilliseconds: 50000,
      }
    }
  ]
};

const CompanyMessage = ({ key, children }: { key: string, children: React.ReactNode }) => {
  return (
    <motion.div
      key={key}
      style={{ originX: 0, originY: 0 }}
      className='corporate-message self-start'
      initial={{ opacity: 1, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0 }}
    >
      {children}
    </motion.div>
  );
}

const UserMessage = ({ key, children }: { key: string, children: React.ReactNode }) => {
  return (
    <motion.div
      key={key}
      style={{ originX: "100%", originY: 0 }}
      className='corporate-message self-end'
      initial={{ opacity: 1, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0 }}
    >
      {children}
    </motion.div>
  );
}

const Fakeout = memo((
  { fakeoutElement, fakeoutMilliseconds, realElement }:
  { fakeoutElement: ReactNode, fakeoutMilliseconds: number, realElement: ReactNode}
) => {
  const [fakingOut, setFakingOut] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setFakingOut(false);
    }, fakeoutMilliseconds);

    return () => clearTimeout(timeoutId);
  }, []);

  if (fakingOut) {
    return fakeoutElement;
  }
  return realElement;
});

const messageArray = [
  <CompanyMessage key="message1">
    Greetings, <ScrambledText targetText="trusted partner" />!
  </CompanyMessage>,
  <CompanyMessage key="message2">
    How are things going with the <ScrambledText targetText="Braxios System" />?
  </CompanyMessage>,
  <UserMessage key="message3">Running into resistance.</UserMessage>,
  <CompanyMessage key="message4">
    Oh no! This must be amended immediately.
  </CompanyMessage>,
  <CompanyMessage key="message5">
    <ScrambledText targetText="Entrepreneur satisfaction" /> is a highly valued
    Key Performance Indicator.
  </CompanyMessage>,
  <CompanyMessage key="message6">What seems to be the issue?</CompanyMessage>,
  <UserMessage key="message7">Dangerous local wildlife.</UserMessage>,
  <CompanyMessage key="message8">
    Oh, so you're having trouble with{" "}
    <ScrambledText targetText="dangerous local wildlife" />!
  </CompanyMessage>,
  <CompanyMessage key="message9">We have a solution for that!</CompanyMessage>,
  <CompanyMessage key="message10">
    We are deploying <ScrambledText targetText="1 Aspector Missile Platform" />{" "}
    to the <ScrambledText targetText="Braxios System" /> now!
  </CompanyMessage>,
  <CompanyMessage key="message11">
    If this solves your problem, mentioning it in your quarterly satsifaction
    survey goes a long way!
  </CompanyMessage>,
  <UserMessage key="message12">No further assistance needed.</UserMessage>,
  <CompanyMessage key="message13">
    Of course <ScrambledText targetText="Entrepreneur-10397" />, your
    satifaction is our priority!
  </CompanyMessage>,
  <CompanyMessage key="message14">
    Good luck with {" "}
    <Fakeout
      fakeoutElement="%ENTREPRENEUR_REASON%"
      fakeoutMilliseconds={1750}
      realElement={
        <ScrambledText targetText={"colonization"} scrambleMilliseconds={75} />
      }
    />{" "}
    of <ScrambledText targetText="the Braxios System" />!
  </CompanyMessage>,
];

const CorporateLayout = () => {
  console.log("Rendering CorporateLayout");
  const [messageIndexes, setMessageIndexes] = useState<number[]>([]);

  const messagesEndRef: React.RefObject<null | HTMLDivElement> = React.createRef();

  // Set up background music using the custom hook
  useBackgroundMusic(CORP_BG_MUCIC_CONFIG);

  const commonSounds = useContext(CommonSoundsContext);

  useEffect(() => {
    if (messageIndexes.length >= messageArray.length) return;

    const interval = setInterval(() => {
      setMessageIndexes((prev) => [...prev, prev.length]);
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      commonSounds.popup.play();
    }, 4000);

    return () => clearInterval(interval);
  }, [messageIndexes]);

  return (
    <main
      id="corporate-main"
      data-theme="corporate"
      className="absolute top-0 w-full mouse-affected-bg min-h-screen min-w-[1100px]"
    >
      <div
        className="
          corporate-messaging-container
          absolute z-[2] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
           w-[900px] h-[800px] px-20 py-10 overflow-scroll no-scrollbar bg-gray-300"
      >
        { /* Reverse the messages to have the div's focus be pinned at the bottom */ }
        <div className="my-32 flex flex-col-reverse justify-end w-full">
          <div ref={messagesEndRef} /> {/* Dummy element at the bottom for scrolling */}
          {messageIndexes.map((index) => messageArray[index]).reverse()}
        </div>
      </div>
    </main>
  );
}

export default CorporateLayout;
