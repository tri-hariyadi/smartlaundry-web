import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { FormText } from 'reactstrap';
import { toast } from 'react-toastify';
import { Form } from 'react-final-form';
import LoginForm from '@parts/member/LoginForm';
import RegisterForm from '@parts/member/RegisterForm';
import Button from '@components/Button';
import IconText from '@components/IconText';
import classNames from '@utils/classNames';
import token from '@utils/token';
import InputField from '@components/fields/InputField';
import AuthAction from '@action/AuthAction';
import AlertDialog from '@components/AlertDialog';

const Login = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [show, setShow] = useState(false);
  const [isAuth, setIsAuth] = useState<boolean>(true);
  let submit: (() => void) | undefined;

  useEffect(() => {
    authCheck();
  }, []);

  const authCheck = () => {
    if (token.isAuth()) {
      setIsAuth(true);
      router.push('/dashboard');
    } else {
      setIsAuth(false);
    }
  };

  const handleClickSignUp = () => {
    const container = document.querySelector('.container-member-page');
    container?.classList.add('signUpMode');
    document.querySelector('nav.navbar')?.classList.add('icon-sigup-mode');
  };

  const handleClickSignIn = () => {
    const container = document.querySelector('.container-member-page');
    container?.classList.remove('signUpMode');
    document.querySelector('nav.navbar')?.classList.remove('icon-sigup-mode');
  };

  return (
    <>
      {!isAuth &&
        <div className='container-member-page'>
          <nav className='navbar navbar-light bg-transparent icon-text-container'>
            <div className='container-fluid'>
              <IconText classContainer='icon-brand1' />
              <IconText classContainer='icon-brand2' />
            </div>
          </nav>
          <div className='formsContainer'>
            <div className='signinSignup'>
              <div className={classNames('formGroup', 'signInForm')}>
                <LoginForm />
                <Button isBtnLink className='mt-2 forgot-pwd' onClick={() => setShow(true)}>Lupa password?</Button>
              </div>
              <div className={classNames('formGroup', 'signUpForm')}>
                <RegisterForm />
              </div>
            </div>
          </div>

          <div className='panelsContainer'>
            <div className={classNames('panel', 'leftPanel')}>
              <div className='content'>
                <h3>Baru di Smart Laundry?</h3>
                <p>
                  Jika kamu belum memiliki akun di Smart Laundry,
                  silahkan daftar dengan mengklik tombol di bawah ini.
                </p>
                <Button onClick={handleClickSignUp} isPrimary={false} className='btn-panel'>
                  Daftar
                </Button>
              </div>
              <div className='image'>
                <Image src={require('@image/log.svg')} alt='' />
              </div>
            </div>
            <div className={classNames('panel', 'rightPanel')}>
              <div className='content'>
                <h3>Sudah terdaftar di Smart Laundry?</h3>
                <p>
                  Selamat datang, untuk tetap terhubung dengan kami, harap masuk dengan akun kamu
                  dengan klik tombol dibawah ini.
                </p>
                <Button onClick={handleClickSignIn} isPrimary={false} className='btn-panel'>
                  Masuk
                </Button>
              </div>
              <div className='image'>
                <Image src={require('@image/register.svg')} alt='' id='panel-img' />
              </div>
            </div>
          </div>
        </div>
      }
      {show &&
        <AlertDialog
          show={show} toggle={() => setShow(v => !v)} title='Lupa Password'
          onClickSubmit={() => submit && submit()}
          isLoading={loading}>
          <Form
            initialValues={{ email: '' }}
            onSubmit={async(v) => {
              setLoading(true);
              document.documentElement.style.setProperty('--toastify-z-index', '10001');
              const response = await AuthAction.recoveryPassword(v.email);
              if (response.status === 200) {
                setShow(false);
                toast.success(response.message);
              } else toast.error(response.message);
              setLoading(false);
            }}
            render={
              ({ handleSubmit }) => {
                submit = handleSubmit;
                return (
                  <div style={{ padding: '0 30px', textAlign: 'left' }}>
                    <InputField name='email' label='Email' formatter={undefined} />
                    <FormText style={{ position: 'relative', top: '-0.8rem', left: '0.3rem' }}>
                      Cek Email Setelah Melakukan Proses Lupa Password
                    </FormText>
                  </div>
                );
              }
            }
          />
        </AlertDialog>
      }
    </>
  );
};

export default Login;
