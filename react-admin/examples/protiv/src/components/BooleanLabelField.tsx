import React from 'react';  
import get from 'lodash/get';
import Label from './Label';
import { sentenceCase } from 'change-case';

export default ({ source, record, yes_value='Yes', no_value='No' }: any) => {
    const value = get(record, source);
    
    return (
    <Label variant="ghost" color={value && 'success' || 'error'}>
      {sentenceCase(value!?yes_value:no_value)}
    </Label>);
  };
  