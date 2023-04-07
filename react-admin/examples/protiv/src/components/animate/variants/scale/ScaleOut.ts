// ----------------------------------------------------------------------

import { NUMBER } from '../../../../utils/Constants/MagicNumber';

const TRANSITION_ENTER = {
  duration: 0.64,
  ease: [NUMBER.ZERO_POINT_FOURTYTHREE, NUMBER.ZERO_POINT_THIRTEEN, NUMBER.ZERO_POINT_TWENTYTHREE, NUMBER.ZERO_POINT_NINETYSIX]
};

export const varScaleOutX = {
  initial: { scaleX: 1, opacity: 1 },
  animate: { scaleX: 0, opacity: 0, transition: TRANSITION_ENTER }
};

export const varScaleOutY = {
  initial: { scaleY: 1, opacity: 1 },
  animate: { scaleY: 0, opacity: 0, transition: TRANSITION_ENTER }
};
