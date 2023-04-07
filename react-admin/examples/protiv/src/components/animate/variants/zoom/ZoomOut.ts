// ----------------------------------------------------------------------

import { NUMBER } from '../../../../utils/Constants/MagicNumber';

const DISTANCE = 720;
const IN = { scale: 1, opacity: 1 };
const OUT = { scale: 0, opacity: 0 };

const TRANSITION_ENTER = {
  duration: 0.64,
  ease: [NUMBER.ZERO_POINT_FOURTYTHREE, NUMBER.ZERO_POINT_THIRTEEN, NUMBER.ZERO_POINT_TWENTYTHREE, NUMBER.ZERO_POINT_NINETYSIX]
};

export const varZoomOut = {
  initial: { scale: 1 },
  animate: { scale: 0, transition: TRANSITION_ENTER }
};

export const varZoomOutUp = {
  initial: IN,
  animate: { ...OUT, translateY: -DISTANCE, transition: TRANSITION_ENTER }
};

export const varZoomOutDown = {
  initial: IN,
  animate: { ...OUT, translateY: DISTANCE, transition: TRANSITION_ENTER }
};

export const varZoomOutLeft = {
  initial: IN,
  animate: { ...OUT, translateX: -DISTANCE, transition: TRANSITION_ENTER }
};

export const varZoomOutRight = {
  initial: IN,
  animate: { ...OUT, translateX: DISTANCE, transition: TRANSITION_ENTER }
};
