/* eslint-disable @typescript-eslint/no-explicit-any */
import IPromo from '@action/interface/promo';
import { ActionType } from '@store/actionTypes';

interface StateType {
  promoListLoading: boolean;
  promoList: any;
  promoListError: boolean | string;

  promoByServiceLoading: boolean;
  promoByServiceData: any;
  promoByServiceError: boolean | string;
}

const initialState: StateType = {
  promoListLoading: false,
  promoList: [],
  promoListError: false,

  promoByServiceLoading: false,
  promoByServiceData: false,
  promoByServiceError: false,
};

const promoReducer = (state: StateType = initialState, action: IPromo): StateType => {
  switch (action.type) {
    case ActionType.PROMO_LIST:
      return {
        ...state,
        promoListLoading: action.payload.loading,
        promoList: action.payload.data,
        promoListError: action.payload.error,
      };
    case ActionType.PROMO_BY_SERVICE:
      return {
        ...state,
        promoByServiceLoading: action.payload.loading,
        promoByServiceData: action.payload.data,
        promoByServiceError: action.payload.error,
      };

    default:
      return state;
  }
};

export default promoReducer;
