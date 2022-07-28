import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form } from 'react-final-form';
import swal from 'sweetalert';
import { toast } from 'react-toastify';
import { RootState } from '@store/store';
import InputField from '@components/fields/InputField';
import Button from '@components/Button';
import Dashboards from '@parts/Dashboard';
import token from '@utils/token';
import AuthAction from '@action/AuthAction';
import httpService from '@configs/axios.config';
import Constants from '@configs/constans';

const Dashboard = () => {
  const dispatch = useDispatch();
  const dataUser = useSelector((state: RootState) => state.AuthReducer.userData);
  const [show, setShow] = useState(false);

  const fetchData = async () => {
    const response = await httpService.get(`users/pengusaha/${token.tokenDecode().aud}`,
      { headers: Constants.authHeader() });
    // if (!response.data.result || response.data.status !== 200) {
    //   swal('Warning', 'Buat nama laundry dulu, biar bisa online', 'warning')
    //     .then(() => setShow(true));
    // }
  };

  useEffect(() => {
    fetchData();
  }, [dataUser]);

  return (
    <div>
      <Dashboards />
      {show &&
        <div className='swal-overlay swal-overlay--show-modal' style={{zIndex: 9999}}>
          <div className='swal-modal' role='dialog' aria-modal='true'>
            <div className='swal-title'>Buat nama laundry</div>
            <Form
              initialValues={{
                name: '',
                user_id: token.tokenDecode().aud
              }}
              onSubmit={async(v) => {
                const response = await AuthAction.createLaundry(v);
                if (response.status === 200) {
                  await Promise.resolve(await AuthAction.getDataUser(token.tokenDecode().aud as string)(dispatch));
                  setShow(false);
                  toast.success('Berhasil membuat laundry, kini kamu bisa online');
                } else {
                  toast.error(`Gagal membuat laundry, ${response.message}`);
                }
              }}
              render={
                ({ handleSubmit, submitting }) => (
                  <span>
                    <div style={{ padding: '0 30px' }}>
                      <InputField name='name' label='Nama Laundry' />
                    </div>
                    <div className='swal-footer' style={{ paddingTop: 0 }}>
                      <div className='swal-button-container'>
                        <Button className='swal-button swal-button--confirm'
                          isLoading={submitting} onClick={handleSubmit}>
                          OK
                        </Button>
                      </div>
                    </div>
                  </span>
                )
              }
            />
          </div>
        </div>
      }
    </div>
  );
};

export default Dashboard;
