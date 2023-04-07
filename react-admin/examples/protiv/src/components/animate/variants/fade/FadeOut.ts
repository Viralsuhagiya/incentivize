// ----------------------------------------------------------------------

import { NUMBER } from '../../../../utils/Constants/MagicNumber';

const DISTANCE = 120;

const TRANSITION_ENTER = {
  duration: 0.64,
  ease: [NUMBER.ZERO_POINT_FOURTYTHREE, NUMBER.ZERO_POINT_THIRTEEN, NUMBER.ZERO_POINT_TWENTYTHREE, NUMBER.ZERO_POINT_NINETYSIX]
};
const TRANSITION_EXIT = {
  duration: 0.48,
  ease: [NUMBER.ZERO_POINT_FOURTYTHREE, NUMBER.ZERO_POINT_THIRTEEN, NUMBER.ZERO_POINT_TWENTYTHREE, NUMBER.ZERO_POINT_NINETYSIX]
};

export const varFadeOut = {
  initial: { opacity: 1 },
  animate: { opacity: 0, transition: TRANSITION_ENTER },
  exit: { opacity: 1, transition: TRANSITION_EXIT }
};

export const varFadeOutUp = {
  initial: { y: 0, opacity: 1 },
  animate: { y: -DISTANCE, opacity: 0, transition: TRANSITION_ENTER },
  exit: { y: 0, opacity: 1, transition: TRANSITION_EXIT }
};

export const varFadeOutDown = {
  initial: { y: 0, opacity: 1 },
  animate: { y: DISTANCE, opacity: 0, transition: TRANSITION_ENTER },
  exit: { y: 0, opacity: 1, transition: TRANSITION_EXIT }
};

export const varFadeOutLeft = {
  initial: { x: 0, opacity: 1 },
  animate: { x: -DISTANCE, opacity: 0, transition: TRANSITION_ENTER },
  exit: { x: 0, opacity: 1, transition: TRANSITION_EXIT }
};

export const varFadeOutRight = {
  initial: { x: 0, opacity: 1 },
  animate: { x: DISTANCE, opacity: 0, transition: TRANSITION_ENTER },
  exit: { x: 0, opacity: 1, transition: TRANSITION_EXIT }
};
