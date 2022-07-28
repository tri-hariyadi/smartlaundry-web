import React, { useState } from 'react';
import { Form } from 'react-final-form';
import { FormApi } from 'final-form';
import { FaChevronCircleRight, FaChevronCircleLeft, FaSave } from 'react-icons/fa';
import Button from '@components/Button';

declare global {
  interface Window { form: FormApi<Values, Partial<Values>>; }
}

type Wizard = {
  onSubmit: (_values: Values) => void;
  children: React.ReactNode,
  initialValues?: Values
};

export interface Values {
  fullName?: string
  email?: string;
  role?: string;
  phoneNumber?: string;
  address?: {
    addressName?: string;
    address?: string;
    detailAddress?: string;
  };
  password?:string;
}

const Wizard: React.FC<Wizard> = ({ onSubmit, children, initialValues }) => {
  const [page, setPage] = useState(0);
  const [values, setValues] = useState<Values | undefined>(initialValues);
  const activePage = React.Children.toArray(children)[page];
  const isLastPage = page === React.Children.count(children) - 1;

  const next = (values: Values) => {
    setPage(Math.min(page + 1, React.Children.count(children)));
    setValues(values);
  };

  const prev = () => {
    setPage(Math.max(page - 1, 0));
  };

  const validate = (values: Values) => {
    const activePage = React.Children.toArray(children)[page];
    return (activePage as React.ReactPortal).props.validate
      ? (activePage as React.ReactPortal).props.validate(values)
      : {};
  };

  const handleSubmit = (values: Values) => {
    const isLastPage = page === React.Children.count(children) - 1;
    if (isLastPage) return onSubmit(values);
    next(values);
  };

  return (
    <Form
      initialValues={values}
      validate={validate}
      mutators={{
        setRole: (args, state, utils) => {
          utils.changeValue(state, 'role', () => args[0]);
        },
      }}
      onSubmit={handleSubmit}>
      {
        ({ handleSubmit, submitting, form }) => {
          if (typeof window !== 'undefined') window.form = form;
          return (
            <form
              onSubmit={handleSubmit}
              className='w-100 d-flex align-items-center justify-content-center flex-column pb-3'>
              {activePage}
              <div className='w-100 d-flex align-items-center flex-column mt-3'>
                <div
                  className='btn-wizard-conainer'
                  style={page < 1 ? { justifyContent: 'center' } : {}}>
                  {page > 0 && (
                    <Button isDanger hasShadow className='btn-back' onClick={prev}>
                      <span>
                        <FaChevronCircleLeft className='icon' />
                        <span>Kembali</span>
                      </span>
                    </Button>
                  )}
                  {!isLastPage && (
                    <Button type='submit' hasShadow className='btn-signin-signup'>
                      <span>
                        <FaChevronCircleRight className='icon' />
                        <span>Lanjut</span>
                      </span>
                    </Button>
                  )}
                  {isLastPage && (
                    <Button type='submit' hasShadow className='btn-signin-signup' isLoading={submitting}>
                      <span>
                        <FaSave className='icon' />
                        <span>Daftar</span>
                      </span>
                    </Button>
                  )}
                </div>
              </div>
            </form>
          );
        }
      }
    </Form>
  );
};

Wizard.defaultProps = {
  initialValues: undefined
};

export default Wizard;
