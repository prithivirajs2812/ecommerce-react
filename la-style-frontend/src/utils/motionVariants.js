// src/utils/motionVariants.js

// Wrap any grid/list container in <motion.div variants={gridContainer} initial="hidden" animate="show">
// and each child in <motion.div variants={gridItem}> — children stagger in automatically.
export const gridContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.04,
    },
  },
};

export const gridItem = {
  hidden: { opacity: 0, y: 16, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 300, damping: 24 },
  },
};

// For rows that can be removed (cart items, wishlist items) — pair with AnimatePresence.
export const listItem = {
  hidden: { opacity: 0, height: 0 },
  show: { opacity: 1, height: 'auto', transition: { duration: 0.25, ease: 'easeOut' } },
  exit: { opacity: 0, x: -24, transition: { duration: 0.2, ease: 'easeIn' } },
};

// Page-level fade/slide used by the route-change wrapper in App.jsx.
export const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15, ease: 'easeIn' } },
};