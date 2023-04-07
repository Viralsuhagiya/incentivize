// ----------------------------------------------------------------------

import { NUMBER } from '../../../../utils/Constants/MagicNumber';

export const varBounceOut = {
  animate: {
    scale: [NUMBER.ZERO_POINT_NINE, NUMBER.ONE_POINT_ONE, NUMBER.ZERO_POINT_THREE],
    opacity: [1, 1, 0]
  }
};

export const varBounceOutUp = {
  animate: {
    y: [NUMBER.NEGATIVE_TWELVE, NUMBER.TWENTY_FOUR, NUMBER.NEGATIVE_SEVEN_HUNDRED_TWENTY],
    scaleY: [NUMBER.ZERO_POINT_NINEHUNDREDEIGHTYFIVE, NUMBER.ZERO_POINT_NINE, NUMBER.THREE],
    opacity: [1, 1, 0]
  }
};

export const varBounceOutDown = {
  animate: {
    y: [NUMBER.TWELVE, NUMBER.NEGATIVE_TWENTY_FOUR, NUMBER.SEVEN_HUNDRED_TWENTY],
    scaleY: [NUMBER.ZERO_POINT_NINEHUNDREDEIGHTYFIVE, NUMBER.ZERO_POINT_NINE, NUMBER.THREE],
    opacity: [1, 1, 0]
  }
};

export const varBounceOutLeft = {
  animate: {
    x: [0, NUMBER.TWENTY_FOUR, NUMBER.NEGATIVE_SEVEN_HUNDRED_TWENTY],
    scaleX: [1, NUMBER.ZERO_POINT_NINE, NUMBER.TWO],
    opacity: [1, 1, 0]
  }
};

export const varBounceOutRight = {
  animate: {
    x: [0, NUMBER.NEGATIVE_TWENTY_FOUR, NUMBER.SEVEN_HUNDRED_TWENTY],
    scaleX: [1, NUMBER.ZERO_POINT_NINE, NUMBER.TWO],
    opacity: [1, 1, 0]
  }
};
