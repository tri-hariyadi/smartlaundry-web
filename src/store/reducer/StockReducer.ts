import IStock, { typeListStock } from '@action/interface/stock';
import { ActionType } from '@store/actionTypes';

interface StateType {
  stockListLoading: boolean;
  stockList: Array<typeListStock> | [];
  stockListError: boolean | string;
}

const initialState: StateType = {
  stockListLoading: false,
  stockList: [],
  stockListError: false
};

const stockReducer = (state: StateType = initialState, action: IStock): StateType => {
  switch (action.type) {
    case ActionType.STOCK_LIST:
      return {
        ...state,
        stockListLoading: action.payload.loading,
        stockList: action.payload.data,
        stockListError: action.payload.error
      };

    default:
      return state;
  }
};

export default stockReducer;
