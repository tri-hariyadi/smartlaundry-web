import { Dispatch } from 'redux';
import { AxiosError } from 'axios';
import httpService from '@configs/axios.config';
import IServices from '@action/interface/services';
import { ActionType } from '@store/actionTypes';
import { successDispatch, errorDispatch, loadingDispatch } from '@store/dispatches';
import constants from '@configs/constans';
import getValueSelectField from '@utils/getValueSelectField';

//data types
import { IServiceFormValues } from '@parts/services/ModalServiceEdit';
import { ISubServiceForm } from '@parts/services/ModalAddSubService';
import { FileInfo } from '@components/fields/UploadFile';
import { IServiceAddFormValues } from '@parts/services/ModalAddService';

class ServiceAction {
  public getServicesByLaundry = (id: string) => async (dispatch: Dispatch<IServices>) => {
    loadingDispatch(dispatch, ActionType.SERVICES_DATA);
    await httpService.get(`services/${id}`, { headers: constants.authHeader() })
      .then(res => {
        if (res.data && res.status === 200)
          successDispatch(dispatch, ActionType.SERVICES_DATA, res.data.result);
        else errorDispatch(dispatch, ActionType.SERVICES_DATA, res.data.message);
      })
      .catch(err =>
        errorDispatch(dispatch, ActionType.SERVICES_DATA, err?.message));
  };

  public getServiceByID = (id: string) => async (dispatch: Dispatch<IServices>) => {
    loadingDispatch(dispatch, ActionType.SERVICE_LAUNDRY);
    await httpService.post(`services/${id}`, {}, { headers: constants.authHeader() })
      .then(res => {
        if (res.data && res.status === 200)
          successDispatch(dispatch, ActionType.SERVICE_LAUNDRY, res.data.result);
        else errorDispatch(dispatch, ActionType.SERVICE_LAUNDRY, res.data.message);
      })
      .catch(err =>
        errorDispatch(dispatch, ActionType.SERVICE_LAUNDRY, err?.message));
  };

  public getServiceReview = (id: string) => async (dispatch: Dispatch<IServices>) => {
    loadingDispatch(dispatch, ActionType.SERVICE_REVIEW);
    await httpService.get(`services/get/rating/${id}`, { headers: constants.authHeader() })
      .then(res => {
        if (res.data && res.status === 200)
          successDispatch(dispatch, ActionType.SERVICE_REVIEW, res.data.result);
        else errorDispatch(dispatch, ActionType.SERVICE_REVIEW, res.data.message);
      })
      .catch(err =>
        errorDispatch(dispatch, ActionType.SERVICE_REVIEW, err?.message));
  };

  public addService = async (data: IServiceAddFormValues) => {
    let response: Partial<{ data: null; message: string; status: number }> = {};
    const formData = new FormData();
    if (data.image && data.image.length) (data.image as Array<FileInfo>).forEach((item) => {
      formData.append('image', item.file);
    });
    delete data.image;
    getValueSelectField(data);
    const dataParse = JSON.stringify(data);
    formData.set('data', dataParse);
    await httpService.post('services/add', formData, { headers: constants.authHeaderMultiPart() })
      .then(res => (response = res.data))
      .catch((error) => {
        const err = error as AxiosError;
        if (err?.response) {
          response = { data: null, message: err.response.data.message, status: err.response.status };
        } else {
          response = { data: null, message: err?.message || 'Gagal mengupdate data', status: 500 };
        }
      });
    return response;
  };

  public deleteService = async (id: string) => {
    let response: Partial<{ data: null; message: string; status: number }> = {};
    await httpService.delete(`services/${id}`, { headers: constants.authHeader() })
      .then(res => (response = res.data))
      .catch((error) => {
        const err = error as AxiosError;
        if (err?.response) {
          response = { data: null, message: err.response.data.message, status: err.response.status };
        } else {
          response = { data: null, message: err?.message || 'Gagal menghapus sub servis', status: 500 };
        }
      });
    return response;
  };

  public updateService = async (id: string, data: IServiceFormValues) => {
    let response: Partial<{ data: null; message: string; status: number }> = {};
    const formData = new FormData();
    const dataParse = JSON.stringify({
      name: data.name,
      desc: data.desc,
      price: data.price,
      quantityType: (data.quantityType as { value: string, label: string }).value,
      banner: data.banner
    });
    formData.set('data', dataParse);
    if (data.image && data.image.length) data.image.forEach((item) => {
      formData.append('image', item.file);
    });
    await httpService.put(`services/${id}`, formData, { headers: constants.authHeaderMultiPart() })
      .then(res => (response = res.data))
      .catch((error) => {
        const err = error as AxiosError;
        if (err?.response) {
          response = { data: null, message: err.response.data.message, status: err.response.status };
        } else {
          response = { data: null, message: err?.message || 'Gagal mengupdate data', status: 500 };
        }
      });
    return response;
  };

  public addSubService = async (id:string, data: ISubServiceForm) => {
    let response: Partial<{ data: null; message: string; status: number }> = {};
    const formData = new FormData();
    if (data.image && data.image.length) (data.image as Array<FileInfo>).forEach((item) => {
      formData.append('image', item.file);
    });
    delete data.image;
    getValueSelectField(data);
    const dataParse = JSON.stringify({ subServices: data });
    formData.set('data', dataParse);
    await httpService.put(`subservices/${id}`, formData, { headers: constants.authHeaderMultiPart() })
      .then(res => (response = res.data))
      .catch((error) => {
        const err = error as AxiosError;
        if (err?.response) {
          response = { data: null, message: err.response.data.message, status: err.response.status };
        } else {
          response = { data: null, message: err?.message || 'Gagal menambahkan sub servis', status: 500 };
        }
      });
    return response;
  };

  public deleteSubService = async (id: string, idSub: string) => {
    let response: Partial<{ data: null; message: string; status: number }> = {};
    await httpService.put(`subservices/delete/${id}/${idSub}`, {}, { headers: constants.authHeader() })
      .then(res => (response = res.data))
      .catch((error) => {
        const err = error as AxiosError;
        if (err?.response) {
          response = { data: null, message: err.response.data.message, status: err.response.status };
        } else {
          response = { data: null, message: err?.message || 'Gagal menghapus sub servis', status: 500 };
        }
      });
    return response;
  };

  public addPromoService = async (id: string, promo: string) => {
    let response: Partial<{ data: null; message: string; status: number }> = {};
    await httpService.put(`services/addpromo/${id}`, { promo }, { headers: constants.authHeader() })
      .then(res => (response = res.data))
      .catch((error) => {
        const err = error as AxiosError;
        if (err?.response) {
          response = { data: null, message: err.response.data.message, status: err.response.status };
        } else {
          response = { data: null, message: err?.message || 'Gagal menambahkan promo', status: 500 };
        }
      });
    return response;
  };
}

export default new ServiceAction();
