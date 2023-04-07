import { NUMBER } from '../../../../utils/Constants/MagicNumber';
import {
  varBounceOut,
  varBounceOutUp,
  varBounceOutDown,
  varBounceOutLeft,
  varBounceOutRight
} from './BounceOut';

// ----------------------------------------------------------------------

const TRANSITION_ENTER = {
  duration: 0.72,
  ease: [NUMBER.ZERO_POINT_FOURTYTHREE, NUMBER.ZERO_POINT_THIRTEEN, NUMBER.ZERO_POINT_TWENTYTHREE, NUMBER.ZERO_POINT_NINETYSIX]
};

const TRANSITION_EXIT = {
  duration: 0.48,
  ease: [NUMBER.ZERO_POINT_FOURTYTHREE, NUMBER.ZERO_POINT_THIRTEEN, NUMBER.ZERO_POINT_TWENTYTHREE, NUMBER.ZERO_POINT_NINETYSIX]
};

export const varBounceIn = {
  animate: {
    scale: [NUMBER.ZERO_POINT_THREE, NUMBER.ONE_POINT_ONE, NUMBER.ZERO_POINT_NINE, NUMBER.ONE_POINT_ZERO_THREE, NUMBER.ZERO_POINT_NINETYSEVEN, 1],
    opacity: [0, 1, 1, 1, 1, 1],
    transition: TRANSITION_ENTER
  },
  exit: varBounceOut.animate
};

export const varBounceInUp = {
  animate: {
    y: [NUMBER.SEVEN_HUNDRED_TWENTY, NUMBER.NEGATIVE_TWENTY_FOUR, NUMBER.TWELVE, NUMBER.NEGATIVE_FOUR, 0],
    scaleY: [NUMBER.FOUR, NUMBER.ZERO_POINT_NINE, NUMBER.ZERO_POINT_NINTEYFIVE, NUMBER.ZERO_POINT_NINEHUNDREDEIGHTYFIVE, 1],
    opacity: [0, 1, 1, 1, 1],
    transition: { ...TRANSITION_ENTER }
  },
  exit: { ...varBounceOutDown.animate, transition: TRANSITION_EXIT }
};

export const varBounceInDown = {
  animate: {
    y: [NUMBER.NEGATIVE_SEVEN_HUNDRED_TWENTY, NUMBER.TWENTY_FOUR, NUMBER.NEGATIVE_TWELVE, NUMBER.FOUR, 0],
    scaleY: [NUMBER.FOUR, NUMBER.ZERO_POINT_NINE, NUMBER.ZERO_POINT_NINTEYFIVE, NUMBER.ZERO_POINT_NINEHUNDREDEIGHTYFIVE, 1],
    opacity: [0, 1, 1, 1, 1],
    transition: TRANSITION_ENTER
  },
  exit: { ...varBounceOutUp.animate, transition: TRANSITION_EXIT }
};

export const varBounceInLeft = {
  animate: {
    x: [NUMBER.NEGATIVE_SEVEN_HUNDRED_TWENTY, NUMBER.TWENTY_FOUR, NUMBER.NEGATIVE_TWELVE, NUMBER.FOUR, 0],
    scaleX: [NUMBER.THREE, 1, NUMBER.ZERO_POINT_NINTEYEIGHT, NUMBER.ZERO_POINT_NINEHUNDREDNINTEYFIVE, 1],
    opacity: [0, 1, 1, 1, 1],
    transition: TRANSITION_ENTER
  },
  exit: { ...varBounceOutLeft.animate, transition: TRANSITION_EXIT }
};

export const varBounceInRight = {
  animate: {
    x: [NUMBER.SEVEN_HUNDRED_TWENTY, NUMBER.NEGATIVE_TWENTY_FOUR, NUMBER.TWELVE, NUMBER.NEGATIVE_FOUR, 0],
    scaleX: [NUMBER.THREE, 1, NUMBER.ZERO_POINT_NINTEYEIGHT, NUMBER.ZERO_POINT_NINEHUNDREDNINTEYFIVE, 1],
    opacity: [0, 1, 1, 1, 1],
    transition: TRANSITION_ENTER
  },
  exit: { ...varBounceOutRight.animate, transition: TRANSITION_EXIT }
};
