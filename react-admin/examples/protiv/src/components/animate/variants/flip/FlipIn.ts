// ----------------------------------------------------------------------

import { NUMBER } from '../../../../utils/Constants/MagicNumber';

const TRANSITION_ENTER = {
  duration: 0.64,
  ease: [NUMBER.ZERO_POINT_FOURTYTHREE, NUMBER.ZERO_POINT_THIRTEEN, NUMBER.ZERO_POINT_TWENTYTHREE, NUMBER.ZERO_POINT_NINETYSIX]
};
const TRANSITION_EXIT = {
  duration: 0.48,
  ease: [NUMBER.ZERO_POINT_FOURTYTHREE, NUMBER.ZERO_POINT_THIRTEEN, NUMBER.ZERO_POINT_TWENTYTHREE, NUMBER.ZERO_POINT_NINETYSIX]
};

export const varFlipInX = {
  initial: { rotateX: -180, opacity: 0 },
  animate: { rotateX: 0, opacity: 1, transition: TRANSITION_ENTER },
  exit: { rotateX: -180, opacity: 0, transition: TRANSITION_EXIT }
};

export const varFlipInY = {
  initial: { rotateY: -180, opacity: 0 },
  animate: { rotateY: 0, opacity: 1, transition: TRANSITION_ENTER },
  exit: { rotateY: -180, opacity: 0, transition: TRANSITION_EXIT }
};
