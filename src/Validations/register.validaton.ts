import { Values } from '@parts/member/Wizard';
import { regexEmail } from '@utils/regexValidate';

export const step1Validation = (values: Values) => {
  const errors: Partial<Values> = {};

  if (!values.role) {
    errors.role = 'Daftar sebagai harus diisi';
  }

  if (!values.fullName) {
    errors.fullName = 'Nama lengkap harus diisi';
  }

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

export const step2Validation = (values: Values) => {
  const errors: Partial<Values> = {
    address: {}
  };

  if (!values.phoneNumber) {
    errors.phoneNumber = 'Nomor handphone harus diisi';
  } else {
    if (isNaN(Number(values.phoneNumber)))
      errors.phoneNumber = 'Nomor handphone harus diisi angka';
    if (values.phoneNumber.length < 9 || values.phoneNumber.length > 15)
      errors.phoneNumber = 'Nomor hanphone minimal 9 karakter dan maksimal 15 karakter';
  }

  if (!values.address) {
    errors.address!.addressName = 'Nama alamat harus diisi';
  }

  if (!values.address?.address) {
    errors.address!.address = 'Alamat harus diisi';
  }

  if (!values.address?.detailAddress) {
    errors.address!.detailAddress = 'Detail alamat harus diisi';
  }

  return errors;
};

