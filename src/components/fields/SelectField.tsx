import { Field } from 'react-final-form';
import { memo, ReactNode, useEffect } from 'react';
import Select from 'react-select';
import { FormFeedback, Label, FormGroup, Spinner } from 'reactstrap';
import getClass from '@utils/classNames';
import compare from '@utils/compare';

interface IProps {
  id?: string;
  name: string;
  label?: string;
  hideLabel?: boolean;
  isLoading?: boolean;
  menuPortalTarget?: HTMLElement | null;
  options: Array<unknown>;
  disabled?: boolean;
  placeholder?: string;
  isSearchable?: boolean;
  noOptionsMessage?: ((_obj: { inputValue: string; }) => ReactNode) | undefined;
}

const SelectField: React.FC<IProps> = ({
  name,
  label,
  hideLabel,
  isLoading,
  menuPortalTarget,
  options,
  disabled,
  placeholder,
  isSearchable,
  noOptionsMessage,
}) => {
  useEffect(() => {
    const elParent = document.querySelectorAll('div.select-field');
    elParent.forEach(el => el?.children.item(2)?.setAttribute('id', 'select-container'));
    const elContainer = document.querySelectorAll('#select-container');
    elContainer.forEach(el => el?.lastElementChild?.setAttribute('id', 'select-indicator'));
  }, []);

  const onFocus = () => {
    const el = document.querySelector(`#${name}`);
    if (el) el.ariaLabel = 'is-focus';
    const elIndicator = document.querySelector(`#${name} #select-container`);
    elIndicator?.lastElementChild?.removeAttribute('id');
  };

  const onBlur = () => {
    const el = document.querySelector(`#${name}`);
    if (el) el.ariaLabel = '';
    const elIndicator = document.querySelector(`#${name} #select-container`);
    elIndicator?.lastElementChild?.setAttribute('id', 'select-indicator');
  };

  const loadingMsg = () => (
    <div>
      <Spinner color='secondary' size='sm' className='me-2' />
      <span className='mt-n1'>Loading...</span>
    </div>
  );

  return (
    <Field name={name}>
      {({ input, meta: { error, touched } }) => (
        <FormGroup>
          {label &&
            <Label className={getClass('ms-1', hideLabel ? 'invisible' : '')} for={`select-${input.name}`}>
              {label}
            </Label>
          }
          <Select
            {...input}
            id={input.name}
            inputId={`select-${input.name}`}
            loadingMessage={loadingMsg}
            isLoading={isLoading}
            onChange={(value) => input.onChange(value)}
            onBlur={event => {
              event.preventDefault();
              input.onBlur();
              onBlur();
            }}
            onFocus={onFocus}
            menuPortalTarget={menuPortalTarget}
            options={options || []}
            isDisabled={disabled}
            placeholder={placeholder}
            className={getClass('select-field', touched && error && 'is-invalid')}
            isSearchable={isSearchable}
            noOptionsMessage={noOptionsMessage}
          />
          {error && touched && <FormFeedback className='ms-1'>{error}</FormFeedback>}
        </FormGroup>
      )}
    </Field>
  );
};

SelectField.defaultProps = {
  id: undefined,
  label: undefined,
  hideLabel: false,
  isLoading: false,
  menuPortalTarget: null,
  disabled: false,
  placeholder: 'Silahkan Pilih',
  isSearchable: true,
  noOptionsMessage: () => <span>Data tidak ditemukan</span>,
};

export default memo(SelectField, compare);
