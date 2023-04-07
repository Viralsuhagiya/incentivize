// ----------------------------------------------------------------------

import { NUMBER } from '../../../../utils/Constants/MagicNumber';

const DISTANCE = 120;

const TRANSITION_ENTER = {
  duration: 0.40,
  ease: [NUMBER.ZERO_POINT_FOURTYTHREE, NUMBER.ZERO_POINT_THIRTEEN, NUMBER.ZERO_POINT_TWENTYTHREE, NUMBER.ZERO_POINT_NINETYSIX]
};
const TRANSITION_EXIT = {
  duration: 0.40,
  ease: [NUMBER.ZERO_POINT_FOURTYTHREE, NUMBER.ZERO_POINT_THIRTEEN, NUMBER.ZERO_POINT_TWENTYTHREE, NUMBER.ZERO_POINT_NINETYSIX]
};

export const varFadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: TRANSITION_ENTER },
  exit: { opacity: 0, transition: TRANSITION_EXIT }
};

export const varFadeInUp = {
  initial: { y: DISTANCE, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: TRANSITION_ENTER },
  exit: { y: DISTANCE, opacity: 0, transition: TRANSITION_EXIT }
};

export const varFadeInLeft = {
  initial: { x: -DISTANCE, opacity: 0 },
  animate: { x: 0, opacity: 1, transition: TRANSITION_ENTER },
  exit: { x: -DISTANCE, opacity: 0, transition: TRANSITION_EXIT }
};

export const varFadeInDown = {
  initial: { y: -DISTANCE, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: TRANSITION_ENTER },
  exit: { y: -DISTANCE, opacity: 0, transition: TRANSITION_EXIT }
};

export const varFadeInRight = {
  initial: { x: DISTANCE, opacity: 0 },
  animate: { x: 0, opacity: 1, transition: TRANSITION_ENTER },
  exit: { x: DISTANCE, opacity: 0, transition: TRANSITION_EXIT }
};
