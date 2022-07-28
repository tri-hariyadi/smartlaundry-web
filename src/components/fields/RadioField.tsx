import React from 'react';
import { FormFeedback } from 'reactstrap';
import propTypes from 'prop-types';
import { Field } from 'react-final-form';
import getClass from '@utils/classNames';

type Option = {
  label: string,
  value: string | number | readonly string[] | undefined | boolean
}

interface RadioProps {
  options: Array<Option>,
  name: string,
  label?: string | undefined,
  style?: React.CSSProperties,
  classLabel?: string
}

const RadioField: React.FC<RadioProps> = ({
  options,
  name,
  label,
  style,
  classLabel,
}) => {
  const Error: React.FC<{ name: string }> = ({ name }) => (
    <Field
      name={name}
      subscribe={{ touched: true, error: true }}
      render={({ meta: { touched, error } }) => (
        <FormFeedback
          className={error && touched ? 'd-block' : ''}>
          {error}
        </FormFeedback>)
      }
    />
  );

  const renderComponent = (value: Option, idx: number) => {
    return (
      <div
        key={`radio-${idx}`}
        className='custom-control-inline custom-control mb-2'>
        <Field
          name={name}
          component='input'
          type='radio'
          value={value.value}
          className='option-input radio'
          id={`${name}-${idx}`}
        />
        <label htmlFor={`${name}-${idx}`}>
          {value.label}
        </label>
      </div>
    );
  };

  return (
    <div style={style}>
      {label && (<div className={getClass('mb-2', classLabel as string)}>{label}</div>)}
      {options.map(renderComponent)}
      <Error name={name} />
    </div>
  );
};

RadioField.propTypes = {
  options: propTypes.array.isRequired,
  name: propTypes.string.isRequired,
  label: propTypes.string,
  classLabel: propTypes.string,
  style: propTypes.object
};

RadioField.defaultProps = {
  label: undefined,
  style: {},
  classLabel: ''
};

export default RadioField;
