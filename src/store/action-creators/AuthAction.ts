import { Dispatch } from 'redux';
import swal from 'sweetalert';
import { AxiosError } from 'axios';
import httpService from '@configs/axios.config';
import IAuthAction from '@action/interface/auth';
import { ActionType } from '@store/actionTypes';
import { successDispatch, errorDispatch, loadingDispatch } from '@store/dispatches';
import Constants from '@configs/constans';
import token from '@utils/token';

export interface IUserRegister {
  fullName?: string,
  email?: string,
  phoneNumber?: string,
  address?: {
    city?: string,
    street?: string,
    lat?: number,
    long?: number
  },
  password?: string,
  role?: string
}

export interface IUserLogin {
  email?: string,
  password?: string,
}

class AuthAction {
  public userRegister = (data: IUserRegister) => async (dispatch: Dispatch<IAuthAction>) => {
    loadingDispatch(dispatch, ActionType.USER_REGISTER);
    await httpService.post('users/register', data, { headers: Constants.API_HEADERS })
      .then(res => {
        if (res.data && res.status === 200) successDispatch(dispatch, ActionType.USER_REGISTER, res.data);
        else errorDispatch(dispatch, ActionType.USER_REGISTER, res.data.message);
      })
      .catch(err =>
        errorDispatch(dispatch, ActionType.USER_REGISTER, err?.message));
  };

  public userLogin = (data: IUserLogin) => async (dispatch: Dispatch<IAuthAction>) => {
    loadingDispatch(dispatch, ActionType.USER_LOGIN);
    await httpService.post('users/login', data, { headers: Constants.API_HEADERS })
      .then(res => {
        if (res.data && res.status === 200)
          successDispatch(dispatch, ActionType.USER_LOGIN, res.data);
        else errorDispatch(dispatch, ActionType.USER_LOGIN, res.data.message);
      })
      .catch(err =>
        errorDispatch(dispatch, ActionType.USER_LOGIN, err?.message));
  };

  public refreshToken = () => {
    return httpService.get('users/token/refreshtoken', { headers: Constants.authHeader() });
  };

  public logOut = (dataToken: {accessToken: string; refreshToken: string}) =>
    async (dispatch: Dispatch<IAuthAction>) => {
      const headers = {...Constants.authHeader()};
      token.removeToken();
      loadingDispatch(dispatch, ActionType.USER_LOGOUT);
      await httpService.post('users/logout', {dataToken: dataToken}, {headers: headers})
        .then(res => {
          if (res.data && res.status === 200) {
            swal('Success', 'Berhasil Logout', 'success');
            successDispatch(dispatch, ActionType.USER_LOGOUT, null);
          } else errorDispatch(dispatch, ActionType.USER_LOGOUT, res.data.message);
        })
        .catch(() => swal('Error', 'Gagal Logout', 'error'));
    };

  public getDataUser = (id: string) => async (dispatch: Dispatch<IAuthAction>) => {
    loadingDispatch(dispatch, ActionType.USER_DATA);
    await httpService.get(`users/pengusaha/${id}`, { headers: Constants.authHeader() })
      .then(res => {
        if (res.data && res.status === 200)
          successDispatch(dispatch, ActionType.USER_DATA, res.data.result);
        else errorDispatch(dispatch, ActionType.USER_DATA, res.data.message);
      })
      .catch((error) => {
        const err = error as AxiosError;
        if (err?.response?.data) {
          errorDispatch(dispatch, ActionType.USER_DATA, err.response.data.message);
        } else {
          errorDispatch(dispatch, ActionType.USER_DATA, err?.message || 'Gagal mendapatkan data');
        }
      });
  };

  public getRoles = () => async (dispatch: Dispatch<IAuthAction>) => {
    loadingDispatch(dispatch, ActionType.USER_ROLE);
    await httpService.get('roles', { headers: Constants.API_HEADERS })
      .then(res => {
        if (res.data && res.status === 200)
          successDispatch(dispatch, ActionType.USER_ROLE, res.data.result);
        else errorDispatch(dispatch, ActionType.USER_ROLE, res.data.message);
      })
      .catch((error) => {
        const err = error as AxiosError;
        if (err?.response?.data) {
          errorDispatch(dispatch, ActionType.USER_ROLE, err.response.data.message);
        } else {
          errorDispatch(dispatch, ActionType.USER_ROLE, err?.message || 'Gagal mendapatkan data');
        }
      });
  };

  public changeUserFcmToken = async (userId?: string, fcmToken?: string) => {
    let response: Partial<{ data: null; message: string; status: number }> = {};
    await httpService.post('users/changefcmtoken', {userId, fcmToken}, { headers: Constants.API_HEADERS })
      .then(res => (response = res.data))
      .catch((error) => {
        const err = error as AxiosError;
        if (err?.response?.data) {
          response = { data: null, message: err.response.data.message, status: err.response.status };
        } else {
          response = { data: null, message: err?.message || 'Gagal mengupdate progress', status: 500 };
        }
      });
    return response;
  };

  public goOnline =async (status: boolean, idLaundry: string | undefined) => {
    let response: Partial<{ data: null; message: string; status: number }> = {};
    await httpService.post('laundry/online', {status, idLaundry}, { headers: Constants.authHeader() })
      .then(res => (response = res.data))
      .catch((error) => {
        const err = error as AxiosError;
        if (err?.response?.data) {
          response = { data: null, message: err.response.data.message, status: err.response.status };
        } else {
          response = { data: null, message: err?.message || 'Gagal Terjadi Kesalahan', status: 500 };
        }
      });
    return response;
  };

  public createLaundry = async (data: any) => {
    let response: Partial<{ data: null; message: string; status: number }> = {};
    await httpService.post('laundry/add', data, { headers: Constants.authHeader() })
      .then(res => (response = res.data))
      .catch((error) => {
        const err = error as AxiosError;
        if (err?.response?.data) {
          response = { data: null, message: err.response.data.message, status: err.response.status };
        } else {
          response = { data: null, message: err?.message || 'Gagal Terjadi Kesalahan', status: 500 };
        }
      });
    return response;
  };

  public recoveryPassword = async (email: string) => {
    let response: Partial<{ data: null; message: string; status: number }> = {};
    await httpService.post('users/recoverypassword', {email}, { headers: Constants.API_HEADERS })
      .then(res => (response = res.data))
      .catch((error) => {
        const err = error as AxiosError;
        if (err?.response?.data) {
          response = { data: null, message: err.response.data.message, status: err.response.status };
        } else {
          response = { data: null, message: err?.message || 'Gagal Terjadi Kesalahan', status: 500 };
        }
      });
    return response;
  };

}

export default new AuthAction();
