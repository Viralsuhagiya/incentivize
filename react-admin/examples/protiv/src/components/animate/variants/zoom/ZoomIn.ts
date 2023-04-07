// ----------------------------------------------------------------------

import { NUMBER } from '../../../../utils/Constants/MagicNumber';

const DISTANCE = 720;
const IN = { scale: 1, opacity: 1 };
const OUT = { scale: 0, opacity: 0 };

const TRANSITION_ENTER = {
  duration: 0.64,
  ease: [NUMBER.ZERO_POINT_FOURTYTHREE, NUMBER.ZERO_POINT_THIRTEEN, NUMBER.ZERO_POINT_TWENTYTHREE, NUMBER.ZERO_POINT_NINETYSIX]
};

const TRANSITION_EXIT = {
  duration: 0.48,
  ease: [NUMBER.ZERO_POINT_FOURTYTHREE, NUMBER.ZERO_POINT_THIRTEEN, NUMBER.ZERO_POINT_TWENTYTHREE, NUMBER.ZERO_POINT_NINETYSIX]
};

export const varZoomIn = {
  initial: OUT,
  animate: { ...IN, transition: TRANSITION_ENTER },
  exit: { ...OUT, transition: TRANSITION_EXIT }
};

export const varZoomInUp = {
  initial: { ...OUT, translateY: DISTANCE },
  animate: { ...IN, translateY: 0, transition: TRANSITION_ENTER },
  exit: { ...OUT, translateY: DISTANCE, transition: TRANSITION_EXIT }
};

export const varZoomInDown = {
  initial: { ...OUT, translateY: -DISTANCE },
  animate: { ...IN, translateY: 0, transition: TRANSITION_ENTER },
  exit: { ...OUT, translateY: -DISTANCE, transition: TRANSITION_EXIT }
};

export const varZoomInLeft = {
  initial: { ...OUT, translateX: -DISTANCE },
  animate: { ...IN, translateX: 0, transition: TRANSITION_ENTER },
  exit: { ...OUT, translateX: -DISTANCE, transition: TRANSITION_EXIT }
};

export const varZoomInRight = {
  initial: { ...OUT, translateX: DISTANCE },
  animate: { ...IN, translateX: 0, transition: TRANSITION_ENTER },
  exit: { ...OUT, translateX: DISTANCE, transition: TRANSITION_EXIT }
};
