import React from 'react';
import propTypes from 'prop-types';
import { FormGroup } from 'reactstrap';
import { FieldArrayFieldsProps } from 'redux-form';

interface CheckboxProps {
  fields: FieldArrayFieldsProps
}

const FieldCheckbox = (props) => {
  return (
    <div>FieldCheckbox</div>
  );
};

FieldCheckbox.propTypes = {};

export default FieldCheckbox;
