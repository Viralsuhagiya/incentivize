// ----------------------------------------------------------------------

import { NUMBER } from '../../../../utils/Constants/MagicNumber';

const DISTANCE = 160;

const TRANSITION_ENTER = {
  duration: 0.64,
  ease: [NUMBER.ZERO_POINT_FOURTYTHREE, NUMBER.ZERO_POINT_THIRTEEN, NUMBER.ZERO_POINT_TWENTYTHREE, NUMBER.ZERO_POINT_NINETYSIX]
};
const TRANSITION_EXIT = {
  duration: 0.48,
  ease: [NUMBER.ZERO_POINT_FOURTYTHREE, NUMBER.ZERO_POINT_THIRTEEN, NUMBER.ZERO_POINT_TWENTYTHREE, NUMBER.ZERO_POINT_NINETYSIX]
};

export const varSlideInUp = {
  initial: { y: DISTANCE },
  animate: { y: 0, transition: TRANSITION_ENTER },
  exit: { y: DISTANCE, transition: TRANSITION_EXIT }
};

export const varSlideInDown = {
  initial: { y: -DISTANCE },
  animate: { y: 0, transition: TRANSITION_ENTER },
  exit: { y: -DISTANCE, transition: TRANSITION_EXIT }
};

export const varSlideInLeft = {
  initial: { x: -DISTANCE },
  animate: { x: 0, transition: TRANSITION_ENTER },
  exit: { x: -DISTANCE, transition: TRANSITION_EXIT }
};

export const varSlideInRight = {
  initial: { x: DISTANCE },
  animate: { x: 0, transition: TRANSITION_ENTER },
  exit: { x: DISTANCE, transition: TRANSITION_EXIT }
};
