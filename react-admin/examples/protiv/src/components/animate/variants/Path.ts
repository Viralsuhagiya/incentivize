// ----------------------------------------------------------------------

import { NUMBER } from '../../../utils/Constants/MagicNumber';

export const TRANSITION = {
  duration: 2,
  ease: [NUMBER.ZERO_POINT_FOURTYTHREE, NUMBER.ZERO_POINT_THIRTEEN, NUMBER.ZERO_POINT_TWENTYTHREE, NUMBER.ZERO_POINT_NINETYSIX]
};

export const varPath = {
  animate: {
    fillOpacity: [0, 0, 1],
    pathLength: [1, NUMBER.ZERO_POINT_FOUR, 0],
    transition: TRANSITION
  }
};
