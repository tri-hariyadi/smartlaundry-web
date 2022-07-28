import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import LoginForm from '@parts/member/LoginForm';
import RegisterForm from '@parts/member/RegisterForm';
import Button from '@components/Button';
import IconText from '@components/IconText';
import classNames from '@utils/classNames';
import token from '@utils/token';

const Login = () => {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState<boolean>(true);

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
    </>
  );
};

export default Login;
