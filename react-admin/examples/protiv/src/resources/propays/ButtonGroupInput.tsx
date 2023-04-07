import { Button, ButtonGroup, ButtonGroupProps, FormControl, FormControlProps, FormLabel, RadioGroupProps, Stack, styled } from '@mui/material';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { ChoicesInputProps, FieldTitle, sanitizeInputRestProps, useInput } from 'react-admin';

const ButtonGroupInput = (props: ButtonGroupInputProps) => {
    const {
          choices = [],
          format,
          helperText,
          isFetching,
          isLoading,
          label,
          loaded,
          loading,
          margin = 'dense',
          onBlur,
          onChange,
          onFocus,
          variant,
          disabled,
          options,
          optionText,
          optionValue,
          parse,
          resource,
          className, 
          fullWidth,
          row,
          source,
          translateChoice,
          validate,
          ...rest
    } = props;
    const {
      id,
      isRequired,
      input,
      meta: { error, submitError, touched },
  } = useInput({
      format,
      onBlur,
      onChange,
      onFocus,
      parse,
      resource,
      source,
      type: 'text',
      validate,
      ...rest,
  });    
  const { onChange: inputOnchange, value } = input;
  const [selectedValue, setSelectedValue] = useState(value);

  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  const handleButtonClick = (event, newValue) => {
    setSelectedValue(newValue);
    inputOnchange(newValue);
  };

  return (
      <ButtonGroup
        className={className}
        fullWidth={fullWidth}
        disabled={disabled}
      >
        {choices.map((choice) => (
          <Button
            key={choice[optionValue]}
            variant={selectedValue === choice[optionValue] ? 'contained' : 'outlined'}
            onClick={(event) => handleButtonClick(event, choice[optionValue])}
          >
            {choice[optionText]}
          </Button>
        ))}
      </ButtonGroup>
  );
};

ButtonGroupInput.propTypes = {
  choices: PropTypes.arrayOf(PropTypes.any),
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  options: PropTypes.object,
  optionText: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.func,
      PropTypes.element,
  ]),
  optionValue: PropTypes.string,
  resource: PropTypes.string,
  source: PropTypes.string,
  translateChoice: PropTypes.bool,
};

ButtonGroupInput.defaultProps = {
  options: {},
  optionText: 'name',
  optionValue: 'id',
  row: true,
  translateChoice: true,
};
const PREFIX = 'RaButtonGroupInput';

export const ButtonGroupInputClasses = {
    label: `${PREFIX}-label`,
};

const sanitizeRestProps = ({
  addLabel,
  afterSubmit,
  allowNull,
  beforeSubmit,
  choices,
  className,
  crudGetMatching,
  crudGetOne,
  data,
  filter,
  filterToQuery,
  formatOnBlur,
  isEqual,
  limitChoicesToValue,
  multiple,
  name,
  pagination,
  perPage,
  ref,
  reference,
  refetch,
  render,
  setFilter,
  setPagination,
  setSort,
  sort,
  subscription,
  type,
  validateFields,
  validation,
  value,
  ...rest
}: any) => sanitizeInputRestProps(rest);

export type ButtonGroupInputProps = ChoicesInputProps<ButtonGroupProps> &
    FormControlProps;

export default ButtonGroupInput;
