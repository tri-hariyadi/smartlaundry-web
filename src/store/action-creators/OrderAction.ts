import { Dispatch } from 'redux';
import { AxiosError } from 'axios';
import IOrder from '@action/interface/order';
import { errorDispatch, loadingDispatch, successDispatch } from '@store/dispatches';
import { ActionType } from '@store/actionTypes';
import httpService from '@configs/axios.config';
import constants from '@configs/constans';

class OrderAction {

  public getAllOrder = (idLaundry: string, data?: {startDate: Date; endDate: Date; }) =>
    async (dispatch: Dispatch<IOrder>) => {
      loadingDispatch(dispatch, ActionType.ORDER_LIST);
      await httpService.post(`orders/getall/${idLaundry}`, data, { headers: constants.authHeader() })
        .then(res => {
          if (res.data && res.status === 200) successDispatch(dispatch, ActionType.ORDER_LIST, res.data.result);
          else errorDispatch(dispatch, ActionType.ORDER_LIST, res.data.message);
        })
        .catch(error => {
          const err = error as AxiosError;
          if (err?.response) return errorDispatch(dispatch, ActionType.ORDER_LIST, err.response.data.message);
          errorDispatch(dispatch, ActionType.ORDER_LIST, err?.message || 'Gagal mendapatkan data order');
        });
    };

  public updateProgress = async (idOrder: string, values: {status: string; name: string; desc: string}) => {
    let response: Partial<{ result: null; message: string; status: number }> = {};
    await httpService.put(`orders/progress/${idOrder}`, values, { headers: constants.authHeader() })
      .then(res => (response = res.data))
      .catch((error) => {
        const err = error as AxiosError;
        if (err?.response) {
          response = { result: null, message: err.response.data.message, status: err.response.status };
        } else {
          response = { result: null, message: err?.message || 'Gagal mengupdate progress', status: 500 };
        }
      });
    return response;
  };

  public confirmOrder = async (data: any) => {
    let response: Partial<{ result: null; message: string; status: number }> = {};
    await httpService.post('orders/create', data, { headers: constants.authHeader() })
      .then(res => (response = res.data))
      .catch((error) => {
        const err = error as AxiosError;
        if (err?.response) {
          response = { result: null, message: err.response.data.message, status: err.response.status };
        } else {
          response = { result: null, message: err?.message || 'Gagal confirmasi order', status: 500 };
        }
      });
    return response;
  };

  public rejectOrder = async (idcust: string) => {
    let response: Partial<{ result: null; message: string; status: number }> = {};
    await httpService.post(`orders/reject/${idcust}`, {}, { headers: constants.authHeader() })
      .then(res => (response = res.data))
      .catch((error) => {
        const err = error as AxiosError;
        if (err?.response) {
          response = { result: null, message: err.response.data.message, status: err.response.status };
        } else {
          response = { result: null, message: err?.message || 'Gagal confirmasi order', status: 500 };
        }
      });
    return response;
  };

}

export default new OrderAction();
