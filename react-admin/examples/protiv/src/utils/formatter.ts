import numeral from 'numeral';
import { NUMBER } from './Constants/MagicNumber';

export function fPercent(number: number,format: string = '0.0%') {
  return numeral(number / NUMBER.HUNDRED).format(format);
}

export function fCurrency(number: string | number, format: string = '$0,0') {
  return numeral(number).format(format);
}

export function fNumber(number: string | number) {
  return numeral(number).format();
}


export function convertNumToTime(number: number) {
  // Check sign of given number
  var sign = number >= 0 ? 1 : -1;

  // Set positive value of number of sign negative
  number = number * sign;

  // Separate the int from the decimal part
  var hour = Math.floor(number);
  var decpart = number - hour;

  var min = 1 / NUMBER.SIXTEY;
  // Round to nearest minute
  decpart = min * Math.round(decpart / min);

  var minute = Math.floor(decpart * NUMBER.SIXTEY) + '';
  // Add padding if need
  if (minute.length < NUMBER.TWO) {
    minute = '0' + minute;
  }
  var hours = hour.toString()
  if (hours.length < NUMBER.TWO) {
    hours = '0' + hours
  }
  // Concate hours and minutes
  var time = hours + ':' + minute;

  return time;
}
