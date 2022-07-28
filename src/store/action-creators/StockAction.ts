import { Dispatch } from 'redux';
import { AxiosError } from 'axios';
import { errorDispatch, loadingDispatch, successDispatch } from '@store/dispatches';
import { ActionType } from '@store/actionTypes';
import httpService from '@configs/axios.config';
import constants from '@configs/constans';
import IStock, { typeListStock } from '@action/interface/stock';

class StockAction {
  public create = async (data: typeListStock) => {
    let response: Partial<{ result: null; message: string; status: number }> = {};
    await httpService.post('stock/create', data, { headers: constants.authHeader() })
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

  public getAll = (data?: {starDate?: string, endDate?: string, id_laundry: string }) =>
    async (dispatch: Dispatch<IStock>) => {
      loadingDispatch(dispatch, ActionType.STOCK_LIST);
      await httpService.post('stock', data, { headers: constants.authHeader() })
        .then(res => {
          if (res.data.result && res.data.status === 200) {
            successDispatch(dispatch, ActionType.STOCK_LIST, res.data.result);
          } else errorDispatch(dispatch, ActionType.STOCK_LIST, res.data.message);
        })
        .catch((error) => {
          const err = error as AxiosError;
          if (err?.response?.data) {
            errorDispatch(dispatch, ActionType.STOCK_LIST, err.response.data.message);
          } else {
            errorDispatch(dispatch, ActionType.STOCK_LIST, err?.message || 'Gagal mendapatkan data');
          }
        });
    };

  public update = async (id: string, data: typeListStock) => {
    let response: Partial<{ result: null; message: string; status: number }> = {};
    await httpService.put(`stock/update/${id}`, data, { headers: constants.authHeader() })
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

  public delete = async (id: string) => {
    let response: Partial<{ result: null; message: string; status: number }> = {};
    await httpService.delete(`stock/${id}`, { headers: constants.authHeader() })
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

export default new StockAction();
