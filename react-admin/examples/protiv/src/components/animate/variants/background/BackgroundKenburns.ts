// ----------------------------------------------------------------------

import { NUMBER } from '../../../../utils/Constants/MagicNumber';

const TRANSITION = {
  duration: 5,
  ease: 'easeOut'
};

export const varKenburnsTop = {
  animate: {
    scale: [1, NUMBER.ONE_POINT_TWENTYFIVE],
    y: [0, NUMBER.NEGATIVE_FIFTEEN],
    transformOrigin: ['50% 16%', 'top'],
    transition: TRANSITION
  }
};

export const varKenburnsBottom = {
  animate: {
    scale: [1, NUMBER.ONE_POINT_TWENTYFIVE],
    y: [0, NUMBER.FIFTEEN],
    transformOrigin: ['50% 84%', 'bottom'],
    transition: TRANSITION
  }
};

export const varKenburnsLeft = {
  animate: {
    scale: [1, NUMBER.ONE_POINT_TWENTYFIVE],
    x: [0, NUMBER.NEGATIVE_TWENTY],
    y: [0, NUMBER.FIFTEEN],
    transformOrigin: ['16% 50%', 'left'],
    transition: TRANSITION
  }
};

export const varKenburnsRight = {
  animate: {
    scale: [1, NUMBER.ONE_POINT_TWENTYFIVE],
    x: [0, NUMBER.TWENTY],
    y: [0, NUMBER.NEGATIVE_FIFTEEN],
    transformOrigin: ['84% 50%', 'right'],
    transition: TRANSITION
  }
};
