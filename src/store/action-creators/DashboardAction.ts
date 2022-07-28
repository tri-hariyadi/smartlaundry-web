import { AxiosError } from 'axios';
import httpService from '@configs/axios.config';
import Constants from '@configs/constans';

class DashboardAction {
  public getTodayTransaction = async (id_merchant?: string) => {
    let response: Partial<{ result: any; message: string; status: number }> = {};
    await httpService.get(`transaction/todays/${id_merchant}`, { headers: Constants.API_HEADERS })
      .then(res => (response = res.data))
      .catch((error) => {
        const err = error as AxiosError;
        if (err?.response?.data) {
          response = { result: null, message: err.response.data.message, status: err.response.status };
        } else {
          response = { result: null, message: err?.message || 'Terjadi kesalahan', status: 500 };
        }
      });
    return response;
  };

  public getMonthlyTransaction = async (id_merchant?: string) => {
    let response: Partial<{ result: any; message: string; status: number }> = {};
    await httpService.get(`transaction/monthly/${id_merchant}`, { headers: Constants.API_HEADERS })
      .then(res => (response = res.data))
      .catch((error) => {
        const err = error as AxiosError;
        if (err?.response?.data) {
          response = { result: null, message: err.response.data.message, status: err.response.status };
        } else {
          response = { result: null, message: err?.message || 'Terjadi kesalahan', status: 500 };
        }
      });
    return response;
  };

  public getYearTransaction = async (id_merchant?: string) => {
    let response: Partial<{ result: any; message: string; status: number }> = {};
    await httpService.get(`transaction/year/${id_merchant}`, { headers: Constants.API_HEADERS })
      .then(res => (response = res.data))
      .catch((error) => {
        const err = error as AxiosError;
        if (err?.response?.data) {
          response = { result: null, message: err.response.data.message, status: err.response.status };
        } else {
          response = { result: null, message: err?.message || 'Terjadi kesalahan', status: 500 };
        }
      });
    return response;
  };

  public getLaundryProcess = async (id_merchant?: string) => {
    let response: Partial<{ result: any; message: string; status: number }> = {};
    await httpService.get(`transaction/laundry-inprocess/${id_merchant}`, { headers: Constants.API_HEADERS })
      .then(res => (response = res.data))
      .catch((error) => {
        const err = error as AxiosError;
        if (err?.response?.data) {
          response = { result: null, message: err.response.data.message, status: err.response.status };
        } else {
          response = { result: null, message: err?.message || 'Terjadi kesalahan', status: 500 };
        }
      });
    return response;
  };

  public chartMonthly = async (id_merchant?: string, data?: {month: number, year: number}) => {
    let response: Partial<{ result: any; message: string; status: number }> = {};
    await httpService.post(`transaction/chartmothly/${id_merchant}`, data, { headers: Constants.API_HEADERS })
      .then(res => (response = res.data))
      .catch((error) => {
        const err = error as AxiosError;
        if (err?.response?.data) {
          response = { result: null, message: err.response.data.message, status: err.response.status };
        } else {
          response = { result: null, message: err?.message || 'Terjadi kesalahan', status: 500 };
        }
      });
    return response;
  };

  public chartMonthlyExpenses = async (id_laundry?: string, data?: {month: number, year: number}) => {
    let response: Partial<{ result: any; message: string; status: number }> = {};
    await httpService.post(`transaction/chartmothly-expenses/${id_laundry}`, data, { headers: Constants.API_HEADERS })
      .then(res => (response = res.data))
      .catch((error) => {
        const err = error as AxiosError;
        if (err?.response?.data) {
          response = { result: null, message: err.response.data.message, status: err.response.status };
        } else {
          response = { result: null, message: err?.message || 'Terjadi kesalahan', status: 500 };
        }
      });
    return response;
  };

  public incomeExpenseChart = async (
      id_merchant?: string, id_laundry?: string, year?: number
  ) => {
    let response: Partial<{ result: any; message: string; status: number }> = {};
    await httpService.post(`transaction/chartincome-expense/${id_merchant}/${id_laundry}`,
      {year}, { headers: Constants.API_HEADERS })
      .then(res => (response = res.data))
      .catch((error) => {
        const err = error as AxiosError;
        if (err?.response?.data) {
          response = { result: null, message: err.response.data.message, status: err.response.status };
        } else {
          response = { result: null, message: err?.message || 'Terjadi kesalahan', status: 500 };
        }
      });
    return response;
  };

}

export default new DashboardAction();
