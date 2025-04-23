import React from 'react';
import { InputNumber } from 'primereact/inputnumber';
import PropTypes from 'prop-types';

const CustomInputNumber = ({ id, value, onValueChange, className, min, max, placeholder }) => {
  return (
    <InputNumber
      id={id}
      value={value}
      onValueChange={onValueChange}
      className={className}
      min={min}
      max={max}
      placeholder={placeholder}
    />
  );
};

CustomInputNumber.propTypes = {
  id: PropTypes.string.isRequired,
  value: PropTypes.number,
  onValueChange: PropTypes.func.isRequired,
  className: PropTypes.string,
  min: PropTypes.number,
  max: PropTypes.number,
  placeholder: PropTypes.string,
};

export default CustomInputNumber;