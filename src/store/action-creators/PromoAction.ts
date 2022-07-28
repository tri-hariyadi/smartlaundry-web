import { Dispatch } from 'redux';
import { AxiosError } from 'axios';
import IPromo from '@action/interface/promo';
import { errorDispatch, loadingDispatch, successDispatch } from '@store/dispatches';
import { ActionType } from '@store/actionTypes';
import httpService from '@configs/axios.config';
import constants from '@configs/constans';
import { IPromoFormValues } from '@parts/promo/ModalPromo';

class PromoAction {

  public getPromo = (id: string) => async (dispatch: Dispatch<IPromo>) => {
    loadingDispatch(dispatch, ActionType.PROMO_LIST);
    await httpService.get(`promos/${id}`, { headers: constants.authHeader() })
      .then(res => {
        if (res.data && res.status === 200) successDispatch(dispatch, ActionType.PROMO_LIST, res.data.result);
        else errorDispatch(dispatch, ActionType.PROMO_LIST, res.data.message);
      })
      .catch(err => errorDispatch(dispatch, ActionType.PROMO_LIST, err?.message));
  };

  public getPromoByService = (id: string) => async (dispatch: Dispatch<IPromo>) => {
    loadingDispatch(dispatch, ActionType.PROMO_BY_SERVICE);
    await httpService.get(`promo/${id}`, { headers: constants.authHeader() })
      .then(res => {
        if (res.data && res.status === 200)
          successDispatch(dispatch, ActionType.PROMO_BY_SERVICE, res.data.result);
        else errorDispatch(dispatch, ActionType.PROMO_BY_SERVICE, res.data.message);
      })
      .catch(error => {
        const err = error as AxiosError;
        if (err?.response) return errorDispatch(dispatch, ActionType.PROMO_LIST, err.response.data.message);
        errorDispatch(dispatch, ActionType.PROMO_LIST, err?.message || 'Gagal mendapatkan data');
      });
  };

  public createPromo = async (values: IPromoFormValues) => {
    const data = {
      ...values,
      diskon: {
        typeDiskon: (values.typeDiskon as { value: string }).value,
        valueDiskon: values.valueDiskon
      },
      minOrder: {
        typeMinOrder: (values.typeMinOrder as { value: string }).value,
        valueMinOrder: values.valueMinOrder
      }
    };

    let response: Partial<{ data: null; message: string; status: number }> = {};
    await httpService.post('promo/add', data, { headers: constants.authHeader() })
      .then(res => (response = res.data))
      .catch((error) => {
        const err = error as AxiosError;
        if (err?.response) {
          response = { data: null, message: err.response.data.message, status: err.response.status };
        } else {
          response = { data: null, message: err?.message || 'Gagal menambah promo', status: 500 };
        }
      });
    return response;
  };

  public updatePromo = async (id: string, values: IPromoFormValues) => {
    const data = {
      ...values,
      diskon: {
        typeDiskon: (values.typeDiskon as { value: string }).value,
        valueDiskon: values.valueDiskon
      },
      minOrder: {
        typeMinOrder: (values.typeMinOrder as { value: string }).value,
        valueMinOrder: values.valueMinOrder
      }
    };

    let response: Partial<{ data: null; message: string; status: number }> = {};
    await httpService.put(`promo/${id}`, data, { headers: constants.authHeader() })
      .then(res => (response = res.data))
      .catch((error) => {
        const err = error as AxiosError;
        if (err?.response) {
          response = { data: null, message: err.response.data.message, status: err.response.status };
        } else {
          response = { data: null, message: err?.message || 'Gagal menambah promo', status: 500 };
        }
      });
    return response;
  };

  public deletePromo = async (id: string) => {
    let response: Partial<{ data: null; message: string; status: number }> = {};
    await httpService.delete(`promo/${id}`, { headers: constants.authHeader() })
      .then(res => (response = res.data))
      .catch((error) => {
        const err = error as AxiosError;
        if (err?.response) {
          response = { data: null, message: err.response.data.message, status: err.response.status };
        } else {
          response = { data: null, message: err?.message || 'Gagal menambah promo', status: 500 };
        }
      });
    return response;
  };

}

export default new PromoAction();
