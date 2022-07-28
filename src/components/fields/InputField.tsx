/* eslint-disable @typescript-eslint/no-explicit-any */
import { Field } from 'react-final-form';
import { FormFeedback, Label, Input, FormGroup } from 'reactstrap';
import { InputType } from 'reactstrap/types/lib/Input';
import getClass from '@utils/classNames';
import currencyFormat from '@utils/currencyFormat';

interface IProps {
  id?: string,
  name: string
  type?: InputType,
  placeholder?: string,
  label?: string,
  disabled?: boolean,
  readOnly?: boolean,
  maxLength?: number | undefined,
  autoComplete?: string
  textTransform?: 'capitalize' | 'uppercase' | 'none';
  style?: React.CSSProperties;
  className?: string;
  hideLabel?: boolean;
  onChange?: (_e: React.ChangeEvent<HTMLInputElement>) => void;
  formatter?: 'currency' | 'number' | 'letter' | 'allchar' | 'percentage';
  // input: FieldInputProps<any, HTMLElement>,
  // meta: FieldMetaState<any>
}

const InputField = ({
  id,
  name,
  type,
  placeholder,
  label,
  disabled,
  readOnly,
  maxLength,
  hideLabel,
  textTransform,
  style,
  autoComplete,
  className,
  onChange,
  formatter,
}: IProps): JSX.Element => {
  const fieldFormatter = (value: any, _name: string) => {
    if (value) {
      switch (formatter) {
        case 'currency':
          return currencyFormat(value);
        case 'number':
          return Number(String(value).replace(/[^\d]/g, ''));
        case 'letter':
          return String(value).replace(/[^a-zA-Z]/g, '');
        case 'allchar':
          return String(value).replace(/[^a-zA-Z0-9 .,-]/g, '');
        case 'percentage':
          return `${String(value).replace(/[^\d]/g, '')} %`;
        default:
          return value;
      }
    }
  };

  const fieldParse = (value: any, _name: string) => {
    if (value) {
      switch (formatter) {
        case 'currency':
          return Number(String(value).replace(/[^\d]/g, ''));
        case 'number':
          return Number(String(value).replace(/[^\d]/g, ''));
        case 'letter':
          return String(value).replace(/[^a-zA-Z]/g, '');
        case 'allchar':
          return String(value).replace(/[^a-zA-Z0-9 .,-]/g, '');
        case 'percentage':
          return Number(String(value).replace(/[^\d]/g, ''));
        default:
          return value;
      }
    }
  };

  return (
    <Field name={name} format={fieldFormatter} parse={fieldParse}>
      {({ input, meta: { touched, error } }) => (
        <FormGroup>
          {label &&
            <Label
              className='ms-1'
              style={hideLabel ? { visibility: 'hidden' } : {}} for={id}>
              {label}
            </Label>
          }
          <Input
            {...input}
            id={id || input.name}
            type={type}
            placeholder={placeholder || label}
            disabled={disabled}
            readOnly={readOnly}
            maxLength={maxLength}
            autoComplete={autoComplete}
            className={getClass(type === 'hidden' ? 'd-none' : 'd-block', 'w-100', className as string)}
            style={Object.assign(
              { marginLeft: 0, minHeight: 40 },
              textTransform ? { textTransform } : {},
              style
            )}
            invalid={error && touched}
            onChange={(e) => onChange ? onChange(e) : input.onChange(e)}
          />
          {error && touched && <FormFeedback className='ms-1'>{error}</FormFeedback>}
        </FormGroup>
      )}
    </Field>
  );
};

InputField.defaultProps = {
  id: undefined,
  type: 'text',
  placeholder: '',
  label:'',
  disabled: false,
  readOnly: false,
  maxLength: undefined,
  autoComplete: 'none',
  textTransform: 'capitalize',
  style: undefined,
  hideLabel: false,
  className: '',
  onChange: undefined,
  formatter: 'allchar'
};

export default InputField;
