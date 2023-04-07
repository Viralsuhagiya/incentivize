// ----------------------------------------------------------------------

import { NUMBER } from '../../../../utils/Constants/MagicNumber';

const TRANSITION_EXIT = {
  duration: 0.48,  
  ease: [NUMBER.ZERO_POINT_FOURTYTHREE, NUMBER.ZERO_POINT_THIRTEEN, NUMBER.ZERO_POINT_TWENTYTHREE, NUMBER.ZERO_POINT_NINETYSIX]
};

export const varFlipOutX = {
  initial: { rotateX: 0, opacity: 1 },
  animate: { rotateX: 70, opacity: 0, transition: TRANSITION_EXIT }
};

export const varFlipOutY = {
  initial: { rotateY: 0, opacity: 1 },
  animate: { rotateY: 70, opacity: 0, transition: TRANSITION_EXIT }
};
