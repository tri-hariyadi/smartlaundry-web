import { Dispatch } from 'redux';
import { AxiosError } from 'axios';
import { errorDispatch, loadingDispatch, successDispatch } from '@store/dispatches';
import { ActionType } from '@store/actionTypes';
import httpService from '@configs/axios.config';
import constants from '@configs/constans';
import IStock, { typeListStock, IInOutStock } from '@action/interface/stock';

class StockAction {
  public create = async (data: typeListStock) => {
    let response: Partial<{ result: null; message: string; status: number }> = {};
    await httpService.post('stocks/create', data, { headers: constants.authHeader() })
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

  public getAllStock = (id_laundry: string) =>
    async (dispatch: Dispatch<IStock>) => {
      loadingDispatch(dispatch, ActionType.OPTION_STOCK_LIST);
      await httpService.get(`stocks/${id_laundry}`, { headers: constants.authHeader() })
        .then(res => {
          if (res.data.result && res.data.status === 200) {
            successDispatch(dispatch, ActionType.OPTION_STOCK_LIST, res.data.result);
          } else errorDispatch(dispatch, ActionType.OPTION_STOCK_LIST, res.data.message);
        })
        .catch((error) => {
          const err = error as AxiosError;
          if (err?.response?.data) {
            errorDispatch(dispatch, ActionType.OPTION_STOCK_LIST, err.response.data.message);
          } else {
            errorDispatch(dispatch, ActionType.OPTION_STOCK_LIST, err?.message || 'Gagal mendapatkan data');
          }
        });
    };

  public getStock = (id_laundry: string, data?: {month?: number, year?: number }) =>
    async (dispatch: Dispatch<IStock>) => {
      loadingDispatch(dispatch, ActionType.STOCK_LIST);
      await httpService.post(`stocks/${id_laundry}`, data, { headers: constants.authHeader() })
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
    await httpService.put(`stocks/${id}`, data, { headers: constants.authHeader() })
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
    await httpService.delete(`stocks/${id}`, { headers: constants.authHeader() })
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


  // IN OUT STOCK ACTION
  public createInOut = async (data: {
    stock_id: string,
    input: number,
    out: number,
    cost: number
  }) => {
    let response: Partial<{ result: null; message: string; status: number }> = {};
    await httpService.post('stocks/inout/create', data, { headers: constants.authHeader() })
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

  public getInOutStock = (id_laundry: string, data?: {month?: number, year?: number, code?: string }) =>
    async (dispatch: Dispatch<IInOutStock>) => {
      loadingDispatch(dispatch, ActionType.IN_OUT_STOCK_LIST);
      await httpService.post(`stocks/inout/${id_laundry}`, data, { headers: constants.authHeader() })
        .then(res => {
          if (res.data.result && res.data.status === 200) {
            successDispatch(dispatch, ActionType.IN_OUT_STOCK_LIST, res.data.result);
          } else errorDispatch(dispatch, ActionType.IN_OUT_STOCK_LIST, res.data.message);
        })
        .catch((error) => {
          const err = error as AxiosError;
          if (err?.response?.data) {
            errorDispatch(dispatch, ActionType.IN_OUT_STOCK_LIST, err.response.data.message);
          } else {
            errorDispatch(dispatch, ActionType.IN_OUT_STOCK_LIST, err?.message || 'Gagal mendapatkan data');
          }
        });
    };

  public updateInOut = async (id: string, data: {
    stock_id: string,
    input: number,
    out: number,
    cost: number
  }) => {
    let response: Partial<{ result: null; message: string; status: number }> = {};
    await httpService.put(`stocks/inout/${id}`, data, { headers: constants.authHeader() })
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

  public deleteInOut = async (id: string) => {
    let response: Partial<{ result: null; message: string; status: number }> = {};
    await httpService.delete(`stocks/inout/${id}`, { headers: constants.authHeader() })
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
