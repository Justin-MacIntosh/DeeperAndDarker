import { ReactNode } from 'react';

import { AnimatePresence, motion } from "motion/react";

const resourceContainerVariant = {
  initial: {
    opacity: 0,
    scale: 0,
    width: 0,
    height: 0
  },
  animate: {
    opacity: 1,
    scale: 1,
    width: "600px",
    height: "auto",
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
      duration: 0.8
    },
  },
  exit: {
    opacity: 0,
    scale: 0,
    width: 0,
    height: 0,
    margin: 0,
    transition: {
      when: "afterChildren",
      staggerChildren: 0.1,
      duration: 0.8
    },
  },
};

const ResourceContainer = (
  { children, show, keyPrefix }:
  { children: ReactNode, show: boolean, keyPrefix: string }
) => {
  return (
    <AnimatePresence mode="wait" initial={false}>
      {
      show &&
        <motion.div
          key={keyPrefix + "_resource_container"}
          variants={resourceContainerVariant}
          className='origin-top overflow-hidden text-nowrap mr-6 mt-6'
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <motion.div
            id={keyPrefix + "_container"}
            className="min-w-[600px] flex-1 flex flex-col rounded-xl gap-3 p-4 bg-secondary"
          >
            {children}
          </motion.div>
        </motion.div>
      }
    </AnimatePresence>
  );
};

export default ResourceContainer;
