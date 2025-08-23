import './corporate-style.css';

import ScrambledText from '../shared/ScrambledText';
import { motion } from "motion/react";


const CorporateLayout = () => {
  return (
    <main
      id="corporate-main"
      data-theme="corporate"
      className="absolute top-0 w-full mouse-affected-bg bg-gray-200 min-h-screen min-w-[1100px]"
    >
      <div className="absolute z-[2] top-1/2 left-1/2 justify-items-center transform -translate-x-1/2 -translate-y-1/2 flex flex-col w-5/12">
       <motion.div
          className='corporate-container mb-6 self-start'
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0 }}
        >
          Greetings, <ScrambledText targetText='trusted partner'/>!
        </motion.div>
        <motion.div
          className='corporate-container self-start'
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0 }}
        >
          How are things going with the <ScrambledText targetText='Braxios System'/>?
        </motion.div>
      </div>
    </main>
  );
}

export default CorporateLayout;
