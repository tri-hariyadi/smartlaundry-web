/* eslint-disable @typescript-eslint/no-explicit-any */
import { ActionType } from '../actionTypes';
import IServices from '@store/action-interface/services';

interface StateType {
  servicesLoading: boolean;
  serviceError: boolean | string,
  serviceData: any,

  serviceLaundryLoading: boolean,
  serviceLaundryError: boolean | string,
  serviceLaundryData: any,

  serviceReviewLoading: boolean,
  serviceReviewError: boolean | string,
  serviceReviewData: any,
}

const initialState: StateType = {
  servicesLoading: false,
  serviceError: false,
  serviceData: [],

  serviceLaundryLoading: false,
  serviceLaundryError: false,
  serviceLaundryData: false,

  serviceReviewLoading: false,
  serviceReviewError: false,
  serviceReviewData: [],
};

const serviceReducer = (state: StateType = initialState, action: IServices): StateType => {
  switch (action.type) {
    case ActionType.SERVICES_DATA:
      return {
        ...state,
        servicesLoading: action.payload.loading,
        serviceError: action.payload.error,
        serviceData: action.payload.data
      };
    case ActionType.SERVICE_LAUNDRY:
      return {
        ...state,
        serviceLaundryLoading: action.payload.loading,
        serviceLaundryError: action.payload.error,
        serviceLaundryData: action.payload.data,
      };
    case ActionType.SERVICE_REVIEW:
      return {
        ...state,
        serviceReviewLoading: action.payload.loading,
        serviceReviewError: action.payload.error,
        serviceReviewData: action.payload.data,
      };

    default:
      return state;
  }
};

export default serviceReducer;
