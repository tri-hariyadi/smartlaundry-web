import { IValues } from '@parts/member/LoginForm';
import { regexEmail } from '@utils/regexValidate';

const loginValidation = (values: IValues) => {
  const errors: Partial<IValues> = {};

  if (!values.email) {
    errors.email = 'Email harus diisi';
  } else {
    if (regexEmail(values.email))
      errors.email = 'Email minimal 9 digit (ada @ dan .)';
  }

  if (!values.password) {
    errors.password = 'Password harus diisi';
  } else {
    if (values.password.length < 8)
      errors.password = 'Password minimal 8 karakter';
  }

  return errors;
};

export default loginValidation;
