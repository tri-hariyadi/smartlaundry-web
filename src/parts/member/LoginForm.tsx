import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { useRouter } from 'next/router';
import { Form, Field } from 'react-final-form';
import { FaLock, FaSignInAlt } from 'react-icons/fa';
import swal from 'sweetalert';
import { Input, Label } from 'reactstrap';
import FieldRounded from '@components/fields/FieldRounded';
import Button from '@components/Button';
import Token from '@utils/token';
import loginValidation from '@validation/login.validation';
import AuthAction, { IUserLogin } from '@action/AuthAction';
import IAuthAction from '@action/interface/auth';
import { RootState } from '@store/store';

export interface IValues {
  email: string;
  password: string;
}

interface ILogin {
  login: (_data: IUserLogin) => (_dispatch: Dispatch<IAuthAction>) => Promise<void>;
  token: {
    accessToken: string;
    refreshToken: string;
  };
  loginError: string | boolean
}

const LoginForm: React.FC<ILogin> = ({ login, token, loginError }) => {
  const router = useRouter();
  const [rememberMe, setRememberMe] = useState(false);
  const onSubmit = async (values: IValues) => {
    await Promise.resolve(login(values));
  };

  useEffect(() => {
    if (loginError) {
      swal('Error',loginError as string, 'error');
    } else if (token && token.accessToken && token.refreshToken) {
      if (rememberMe) Token.setToken(token, 'local');
      else Token.setToken(token, 'session');
      router.replace('/dashboard');
    }
  }, [loginError, token]);

  return (
    <div className='w-100'>
      <h2 className='title'>Silahkan Masuk</h2>
      <Form
        onSubmit={onSubmit}
        validate={loginValidation}
        render={
          ({ handleSubmit, submitting }) => (
            <form
              onSubmit={handleSubmit}
              className='w-100 d-flex align-items-center justify-content-center flex-column mb-3'>
              <Field name='email'>
                {(props) => (
                  <FieldRounded
                    {...props}
                    id='loginEmail'
                    placeholder='Email'
                  />
                )}
              </Field>
              <Field name='password'>
                {(props) => (
                  <FieldRounded
                    {...props}
                    secureTextEntry
                    id='loginPwd'
                    placeholder='Password'
                    FieldIcon={FaLock}
                  />
                )}
              </Field>
              <div
                className='w-100 d-flex align-items-center mb-4'
                style={{ maxWidth: 330 }}>
                <Input
                  type='checkbox'
                  onChange={(e) => {
                    if (e.target.checked) setRememberMe(true);
                    else setRememberMe(false);
                  }}
                  className='option-input checkbox' />
                <Label className=' mb-0 mt-1'>Biarkan saya tetap masuk</Label>
              </div>
              <Button
                type='submit'
                hasShadow
                isLoading={submitting}
                className='btn-signin-signup'>
                <span>
                  <FaSignInAlt className='icon' />
                  <span>Masuk</span>
                </span>
              </Button>
            </form>
          )
        }
      />
    </div>
  );
};

const mapDispatchToProps = (dispatch: Dispatch<IAuthAction>) => (
  bindActionCreators({
    login: AuthAction.userLogin
  }, dispatch)
);

const mapStateToProps = (state: RootState) => ({
  token: state.AuthReducer.token,
  loginError: state.AuthReducer.loginError
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
