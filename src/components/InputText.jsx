import React from 'react';
import { InputText } from 'primereact/inputtext';
import PropTypes from 'prop-types';

const CustomInputText = ({ id, value, onChange, className, placeholder }) => {
  return (
    <InputText id={id} value={value} onChange={onChange} className={className} placeholder={placeholder} />
  );
};

CustomInputText.propTypes = {
  id: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
  placeholder: PropTypes.string,
};

export default CustomInputText;