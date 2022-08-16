import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { Field } from 'react-final-form';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem, FormFeedback } from 'reactstrap';
import { HiOfficeBuilding } from 'react-icons/hi';
import { MdLocationPin, MdHomeRepairService } from 'react-icons/md';
import { FaLock, FaEnvelope, FaPhoneAlt, FaHome, FaUserAlt, FaUsers } from 'react-icons/fa';
import swal from 'sweetalert';
import Wizard, { Values } from './Wizard';
import FieldRounded from '@components/fields/FieldRounded';
import { step1Validation,step2Validation } from '@validation/register.validaton';
import getGeolocation, { ILocation } from '@utils/getGeolocation';
import getClass from '@utils/classNames';
import AuthAction, { IUserRegister } from '@action/AuthAction';
import IAuthAction from '@action/interface/auth';
import { RootState } from '@store/store';

interface RegisterProps {
  register: (_data: IUserRegister) => (_dispatch: Dispatch<IAuthAction>) => Promise<void>;
  getRoles: () => (_dispatch: Dispatch<IAuthAction>) => Promise<void>;
  registerError: string | boolean;
  registerData: boolean | string | null;
  role: Array<{_id: string, code: number}> | []
}

type wizardProps = {
  children: React.ReactNode;
  validate: (_values: Values) => Partial<Values>
};

const WizardPage: React.FC<wizardProps> = ({ children }) => {
  return <div className='w-100 d-flex align-items-center flex-column'>{children}</div>;
};

const RegisterForm: React.FC<RegisterProps> = ({ register, getRoles, role, registerError, registerData }) => {
  const [show, setShow] = useState(false);
  const [dropdownLabel, setDropdownLabel] = useState('Daftar Sebagai');

  const checkAccessLocation = () => {
    return new Promise((resolve: (_value: ILocation) => void) => {
      navigator.geolocation.getCurrentPosition(
        async () => resolve(await Promise.resolve(getGeolocation())),
        async () => resolve(await Promise.resolve(getGeolocation())));
    });
  };

  const onSubmit = async (values: Values) => {
    const isAllow = await Promise.resolve(checkAccessLocation());
    if (isAllow.error.code === 1)
      return swal('Warning',
        'Tidak dapat melajutkan registrasi, izinkan aplikasi untuk mengakses lokasi anda',
        'warning');
    const param = {
      ...values,
      address: {
        addressName: values.address?.addressName,
        address: values.address?.address,
        detailAddress: values.address?.detailAddress,
        lat: isAllow.coordinates.lat,
        long: isAllow.coordinates.lng
      }
    };
    await Promise.resolve(register(param));
  };

  useEffect(() => {
    getRoles();
  }, []);

  useEffect(() => {
    if (registerError) {
      swal('Error', registerError as string, 'error');
    } else if (registerData) {
      swal('Berhasil', 'Registrasi akun berhasil, silahkan login kembali dengan akun anda', 'success')
        .then(() => {
          window.form.reset();
          document.querySelector('.container-member-page')?.classList.remove('signUpMode');
        });
    }
  }, [registerError, registerData]);

  return (
    <div className='w-100 d-flex align-items-center justify-content-center flex-column'>
      <h2 className='title'>Daftar Akun</h2>
      <Wizard
        // initialValues={{
        //   email: 'tri.hariyadi@gmail.com',
        //   fullName: 'tri hariyadi',
        //   password: 'dewitri1996',
        //   phoneNumber: '009324893849',
        //   address: {
        //     addressName: 'Ruko Pelangi',
        //     address: 'Blok Mekar No.8 RT 08/09',
        //     detailAddress: 'Ruko Pelangi Nomor.16'
        //   }
        // }}
        onSubmit={onSubmit}>
        <WizardPage
          validate={step1Validation}>
          <Field name='role'>
            {({ meta }) => (
              <Dropdown isOpen={show} toggle={() => setShow(v => !v)} className='field-role-container'>
                <div className='field-role-wrapp'>
                  <DropdownToggle caret
                    style={dropdownLabel !== 'Daftar Sebagai' ? { color: '#333' } : {}}
                    className={getClass('field-role', meta.error && meta.touched ? 'error-field' : '')}>
                    <FaUsers className='icon' />
                    <span>{dropdownLabel}</span>
                  </DropdownToggle>
                  <FormFeedback
                    className={meta.error && meta.touched ? 'd-block' : ''}
                    style={{ marginLeft: 25 }}>
                    {meta.error}
                  </FormFeedback>
                </div>
                <DropdownMenu>
                  {!role.length &&
                    <DropdownItem>
                      <p className='text-center mb-0'>Data tidak ditemukan</p>
                    </DropdownItem>
                  }
                  {role.length ?
                    <DropdownItem onClick={() => {
                      if (role.length) {
                        setDropdownLabel('Pengguna Lundry');
                        window.form.mutators.setRole(role.filter(({ code }) => code === 2)[0]._id);
                      }
                    }}>
                      <FaUserAlt style={{ marginRight: '0.25rem' }} /> Pengguna Laundry
                    </DropdownItem> : null
                  }
                  {role.length ?
                    <DropdownItem onClick={() => {
                      if (role.length) {
                        setDropdownLabel('Pengusaha Lundry');
                        window.form.mutators.setRole(role.filter(({ code }) => code === 1)[0]._id);
                      }
                    }}>
                      <HiOfficeBuilding style={{ marginRight: '0.25rem' }} /> Pengusaha Laundry
                    </DropdownItem> : null
                  }
                </DropdownMenu>
              </Dropdown>
            )}
          </Field>
          <Field name='fullName'>
            {(props) => (
              <FieldRounded
                {...props}
                placeholder='Nama Lengkap'
                textTransform='capitalize'
              />
            )}
          </Field>
          <Field name='email'>
            {(props) => (
              <FieldRounded
                {...props}
                placeholder='Email'
                FieldIcon={FaEnvelope}
              />
            )}
          </Field>
          <Field name='password'>
            {(props) => (
              <FieldRounded
                {...props}
                secureTextEntry
                placeholder='Password'
                classContainer='mb-2'
                FieldIcon={FaLock}
              />
            )}
          </Field>
        </WizardPage>
        <WizardPage validate={step2Validation}>
          <Field name='phoneNumber'>
            {(props) => (
              <FieldRounded
                {...props}
                placeholder='No Hp'
                FieldIcon={FaPhoneAlt}
              />
            )}
          </Field>
          <Field name='address.addressName'>
            {(props) => (
              <FieldRounded
                {...props}
                placeholder='Nama Alamat'
                FieldIcon={MdLocationPin}
                textTransform='capitalize'
              />
            )}
          </Field>
          <Field name='address.address'>
            {(props) => (
              <FieldRounded
                {...props}
                placeholder='Alamat'
                FieldIcon={FaHome}
                textTransform='capitalize'
              />
            )}
          </Field>
          <Field name='address.detailAddress'>
            {(props) => (
              <FieldRounded
                {...props}
                placeholder='Detail Alamat'
                FieldIcon={MdHomeRepairService}
                textTransform='capitalize'
              />
            )}
          </Field>
        </WizardPage>
      </Wizard>
    </div>
  );
};

const mapDispatchToProps = (dispatch: Dispatch<IAuthAction>) => {
  return bindActionCreators({
    register: AuthAction.userRegister,
    getRoles: AuthAction.getRoles
  }, dispatch);
};

const mapStateToProps = (state: RootState) => ({
  registerError: state.AuthReducer.registerError,
  registerData: state.AuthReducer.registerData,
  role: state.AuthReducer.role,
});

export default connect(mapStateToProps, mapDispatchToProps)(RegisterForm);
