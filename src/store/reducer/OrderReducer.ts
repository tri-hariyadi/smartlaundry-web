/* eslint-disable @typescript-eslint/no-explicit-any */
import IOrder from '@action/interface/order';
import { ActionType } from '@store/actionTypes';

interface StateType {
  orderListLoading: boolean;
  orderList: any;
  orderListError: boolean | string;
}

const initialState: StateType = {
  orderListLoading: false,
  orderList: [],
  orderListError: false
};

const orderReducer = (state: StateType = initialState, action: IOrder): StateType => {
  switch (action.type) {
    case ActionType.ORDER_LIST:
      return {
        ...state,
        orderListLoading: action.payload.loading,
        orderList: action.payload.data,
        orderListError: action.payload.error
      };

    default:
      return state;
  }
};

export default orderReducer;
