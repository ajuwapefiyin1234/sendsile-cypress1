import { AnimatePresence, motion } from 'framer-motion';
import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

const pageTransition = {
  hidden: { opacity: 0, y: 50, filter: 'blur(5px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    y: 50,
    filter: 'blur(5px)',
    transition: { duration: 0.3, ease: 'easeIn' },
  },
};

export const DashboardWidth = ({
  children,
  classname,
}: {
  children: ReactNode;
  classname?: string;
}) => {
  return (
    <section
      className={twMerge(
        'w-full lg:ml-[256px] lg:w-[calc(100vw-256px)] flex flex-col bg-[#FCFAF6] h-full min-h-screen',
        classname
      )}
    >
      <AnimatePresence>
        <motion.div initial="hidden" animate="visible" exit="exit" variants={pageTransition}>
          {children}
        </motion.div>
      </AnimatePresence>
    </section>
  );
};
