/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { FormFeedback, Input } from 'reactstrap';
import { InputType } from 'reactstrap/types/lib/Input';
import { IconType } from 'react-icons';
import { BsFillEyeFill, BsFillEyeSlashFill } from 'react-icons/bs';
import { FaUserAlt } from 'react-icons/fa';
import { FieldInputProps, FieldMetaState } from 'react-final-form';
import styles from './fieldrounded.module.scss';
import getClass from '@utils/classNames';

interface IProps {
  id?: string;
  input: FieldInputProps<any, HTMLElement>,
  type?: InputType | undefined;
  placeholder?: string;
  disabled?: boolean;
  maxLength?: number;
  FieldIcon?: IconType;
  secureTextEntry?: boolean;
  classContainer?: string;
  autoComplete?: string;
  textTransform?: 'capitalize' | 'uppercase' | 'none';
  style?: React.CSSProperties;
  meta: FieldMetaState<any>
}

const FieldRounded: React.FC<IProps> = ({
  id,
  input,
  type,
  placeholder,
  maxLength,
  FieldIcon,
  classContainer,
  autoComplete,
  textTransform,
  style,
  disabled,
  secureTextEntry,
  meta: { touched, error }
}) => {
  const [secureInput, setSecureInput] = useState('password');

  const handleClick = () => {
    if (secureInput === 'password') {
      setSecureInput('text');
    } else {
      setSecureInput('password');
    }
  };

  return (
    <div className={getClass('w-100 d-flex align-items-center flex-column mb-1', classContainer as string)}>
      <div className='w-100 d-flex align-items-center flex-column' style={{ maxWidth: 380 }}>
        <div className={styles.container} style={{ border: error && touched ? '1px solid red' : 'none' }}>
          {FieldIcon && <FieldIcon className={styles.iconInput} />}
          <Input
            {...input}
            type={secureTextEntry ? secureInput as InputType : type}
            id={id || input.name}
            placeholder={placeholder}
            disabled={disabled}
            autoComplete={autoComplete}
            maxLength={maxLength}
            style={Object.assign(
              { paddingRight: secureTextEntry ? '1.8rem' : '0' },
              textTransform ? { textTransform } : {},
              style
            )}
          />
          {secureTextEntry &&
            <button type='button' className={styles.btnIcon} onClick={handleClick}>
              {secureInput === 'password'
                ? <BsFillEyeFill style={{ fontSize: '1.1rem' }} />
                : <BsFillEyeSlashFill style={{ fontSize: '1.1rem' }} />
              }
            </button>
          }
        </div>
        <FormFeedback
          className={error && touched ? 'd-block' : ''}
          style={{ marginLeft: 50, marginTop: '-5px' }}>
          {error}
        </FormFeedback>
      </div>
    </div>
  );
};

FieldRounded.defaultProps = {
  id: undefined,
  type: 'text',
  placeholder: '',
  disabled: false,
  maxLength: undefined,
  classContainer: '',
  FieldIcon: FaUserAlt,
  autoComplete: 'none',
  textTransform: undefined,
  style: undefined,
  secureTextEntry: false
};

export default FieldRounded;
