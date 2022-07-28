// import 'bootstrap/dist/css/bootstrap.css';
import '../styles/globals.scss';

import 'moment/locale/id';
import type { AppProps } from 'next/app';
import { useEffect, useRef, useState } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import jwtDecode from 'jwt-decode';
import Image from 'next/image';
import swal from 'sweetalert';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { RootState, store, wrapper } from '@store/store';
import Layout from '@parts/Layout';
import token from '@utils/token';
import IconText from '@components/IconText';
import AuthAction from '@store/action-creators/AuthAction';
import OrderAct from '@action/OrderAction';
import SwalLoading from '@action/Swal';
import { requestForToken } from 'src/webPush';

interface Props {
  statusCode: number | null | undefined
}

function MyApp({ Component, pageProps, statusCode }: AppProps & Props) {
  const router = useRouter();
  const dispatch = useDispatch();
  const isNotHome = router.pathname.startsWith('/member');
  const isIndex = router.pathname.split('/')[1] === '';
  const [isAuth, setIsAuth] = useState(false);
  const dataUser = useSelector((state: RootState) => state.AuthReducer.userData);
  const swalLoading = useSelector((state: RootState) => ({
    show: state.AuthReducer.swalLoading,
    title: state.AuthReducer.swalTitle,
    text: state.AuthReducer.swalText,
  }));
  const auth = useRef({ isUser: false });

  const authCheck = async (url: string) => {
    const publicPaths = ['/member'];
    if (!auth.current.isUser) await fetchData();
    if (token.isAuth()) {
      setIsAuth(true);
    } else {
      setIsAuth(false);
      if (!publicPaths.includes(url)) {
        router.push('/member');
        window.localStorage.removeItem('status');
      }
    }
  };

  const fetchData = async () => {
    const dataToken = token.getToken()?.accessToken;
    if (dataToken) {
      const tokenDecoded: { aud: string } = jwtDecode(dataToken);
      await Promise.resolve(await AuthAction.getDataUser(tokenDecoded.aud)(dispatch));
      updateFcmToken();
    }
  };

  const updateFcmToken = async () => {
    const fcmToken = await Promise.resolve(requestForToken());
    await AuthAction.changeUserFcmToken(token.tokenDecode().aud as string, fcmToken);
  };

  useEffect(() => {
    fetchData();
    authCheck(router.asPath);
    router.events.on('routeChangeComplete', authCheck);
    typeof document !== undefined ? require('bootstrap/dist/js/bootstrap') : null;

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener(
        'message',
        (event) => {
          swal({
            title: event.data.data.title,
            text: event.data.data.message,
            closeOnEsc: false,
            closeOnClickOutside: false,
            icon: 'warning',
            buttons: {
              Tolak: {
                visible: true,
                value: 'reject',
                className: 'btn-danger',
                closeModal: true
              },
              Terima: {
                visible: true,
                value: 'accept',
                className: 'btn-primary',
                closeModal: true
              }
            },
          }).then(async value => {
            if (value === 'reject' || value === 'accept') SwalLoading.show(
              'Harap Menunggu',
              `Sedang ${value === 'reject' ? 'membatalkan order' : 'mengkonfirmasi order'}`)(dispatch);
            const payload = JSON.parse(event.data.data.payload);
            if (value === 'reject') {
              const response = await OrderAct.rejectOrder(payload.id_customer);
              await SwalLoading.close(dispatch);
              if (response.status === 200) swal('Konfirmasi', 'Order telah ditolak', 'error');
            } else if (value === 'accept') {
              const response = await OrderAct.confirmOrder(payload);
              if (response.status === 200) {
                await Promise.resolve(OrderAct.getAllOrder(dataUser?._id as string)(dispatch));
                await SwalLoading.close(dispatch);
                swal('Success', 'Order telah diterima', 'success');
              }
            }
          });
          setTimeout(() => {
            if (swal.close) swal.close();
          }, 29990);
        }
      );
    }

    return () => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('message', () => null);
      }
      router.events.off('routeChangeComplete', authCheck);
    };
  }, []);

  useEffect(() => {
    if (dataUser) auth.current.isUser = true;
    else auth.current.isUser = false;
  }, [dataUser]);

  if (isNotHome || (statusCode && statusCode !== 200) || isIndex) {
    return (
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    );
  }

  if (!isAuth) return (
    <main className='loading-logo-main'>
      <IconText className='loading-logo' />
      <div className='loading-bar loading-logo-screen'></div>
    </main>
  );

  return (
    <Provider store={store}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
      {swalLoading.show && <div className='swal-overlay swal-overlay--show-modal'>
        <div className='swal-modal' role='dialog' aria-modal='true'>
          <div className='swal-icon swal-icon--custom'>
            <Image src={require('@image/spinner.gif')} layout='fixed' width={100} height={100} alt='swal-loading' />
          </div>
          <div className='swal-title'>{swalLoading.title}</div>
          <div className='swal-text'>{swalLoading.text}</div>
        </div>
      </div>}
      <ToastContainer
        theme='dark'
        position='top-right'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Provider>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
MyApp.getInitialProps = async (props: any) => {
  const statusCode = props.ctx.res
    ? props.ctx.res.statusCode
    : props.ctx.err
      ? props.ctx.err.statusCode
      : null;
  return { statusCode };
};

export default wrapper.withRedux(MyApp);
