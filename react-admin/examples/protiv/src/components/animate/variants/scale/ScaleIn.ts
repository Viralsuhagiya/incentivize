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

export const varScaleInX = {
  initial: { scaleX: 0, opacity: 0 },
  animate: { scaleX: 1, opacity: 1, transition: TRANSITION_ENTER },
  exit: { scaleX: 0, opacity: 0, transition: TRANSITION_EXIT }
};

export const varScaleInY = {
  initial: { scaleY: 0, opacity: 0 },
  animate: { scaleY: 1, opacity: 1, transition: TRANSITION_ENTER },
  exit: { scaleY: 0, opacity: 0, transition: TRANSITION_EXIT }
};
