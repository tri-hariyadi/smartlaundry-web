import { connect, useDispatch } from 'react-redux';
import React, {useState } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { GoThreeBars } from 'react-icons/go';
import { BsPersonCircle } from 'react-icons/bs';
import { MdOutlineNotifications, MdOutlineOnlinePrediction } from 'react-icons/md';
import { IoMdLogOut } from 'react-icons/io';
import { bindActionCreators, Dispatch } from 'redux';
import { useRouter } from 'next/router';
import swal from 'sweetalert';
import IconText from '@components/IconText';
import compare from '@utils/compare';
import authAction from '@action/AuthAction';
import SwalLoading from '@action/Swal';
import IAuthAction from '@action/interface/auth';
import token from '@utils/token';
import { RootState } from '@store/store';

interface IHeader {
  onBarsClick: () => void;
  logout: (_dataToken: {accessToken: string; refreshToken: string}) =>
    (_dispatch: Dispatch<IAuthAction>) => Promise<void>;
  dataUser: {
    laundry: {
      _id: string,
      name: string,
      domain: string
    }
  } | null;
}

const Header: React.FC<IHeader> = ({ onBarsClick, logout, dataUser }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [show, setShow] = useState({ profile: false, notif: false });

  const logOut = async () => {
    const dataToken = token.getToken();
    await Promise.resolve(logout(dataToken as {accessToken: string; refreshToken: string}));
    router.replace('/member');
    token.removeToken();
    window.localStorage.removeItem('status');
  };

  const onLine = async (status: string | null) => {
    SwalLoading.show('Mengupdate status', '')(dispatch);
    const response = await authAction.goOnline(status === 'online' ? false : true, dataUser?.laundry._id);
    if (response.status === 200) {
      window.localStorage.setItem('status', status === 'online' ? 'offline' : 'online');
      await SwalLoading.close(dispatch);
      swal(
        status === 'online' ? 'Offline' : 'Online',
        status === 'online' ? 'Status offline, tidak akan menerima order' : 'Status online, dapat menerima order',
        status === 'online' ? 'warning' : 'success'
      );
    }
  };

  return (
    <header>
      <IconText className='header-icon-text' classContainer='container-icon-text' />
      <div className='btn-menu-header'>
        <button className='btn-bars' onClick={onBarsClick}>
          <GoThreeBars />
        </button>
        <span className='icon-sm-show'>
          <IconText />
        </span>
        <div className='btn-menu-header-wrapper'>
          <Dropdown isOpen={show.notif} toggle={() => setShow(v => ({ ...v, notif: !v.notif }))}>
            <DropdownToggle nav>
              <MdOutlineNotifications />
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem>
                Orderan Baru
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <Dropdown isOpen={show.profile} toggle={() => setShow(v => ({ ...v, profile: !v.profile }))}>
            <DropdownToggle nav>
              <BsPersonCircle />
            </DropdownToggle>
            <DropdownMenu>
              {dataUser &&
                <DropdownItem onClick={() => onLine(window.localStorage.getItem('status'))}>
                  <MdOutlineOnlinePrediction style={{fontSize: 20, marginRight: 5}} />
                  {window.localStorage.getItem('status') === 'online' ? 'Go Offline' : 'Go Online'}
                </DropdownItem>
              }
              <DropdownItem onClick={logOut} className='mt-2'>
                <IoMdLogOut style={{fontSize: 20, marginRight: 5}} /> Logout
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </header>
  );
};

const mapDispatchToProps = (dispatch: Dispatch<IAuthAction>) => (
  bindActionCreators({
    logout: authAction.logOut
  }, dispatch)
);

const mapStateToProps = (state: RootState) => ({
  dataUser: state.AuthReducer.userData,
});

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Header, compare));
