import IStock, { typeListStock, typeInOutStock, IInOutStock } from '@action/interface/stock';
import { ActionType } from '@store/actionTypes';

interface StateType {
  optionsStockLoading: boolean;
  optionsStock: Array<typeListStock> | [];
  optionsStockError: boolean | string;

  stockListLoading: boolean;
  stockList: Array<typeListStock> | [];
  stockListError: boolean | string;

  stockInOutLoading: boolean;
  stockInOut: Array<typeInOutStock> | [];
  stockInOutError: boolean | string;
}

const initialState: StateType = {
  optionsStockLoading: false,
  optionsStock: [],
  optionsStockError: false,

  stockListLoading: false,
  stockList: [],
  stockListError: false,

  stockInOutLoading: false,
  stockInOut: [],
  stockInOutError: false
};

const stockReducer = (state: StateType = initialState, action: IStock | IInOutStock): StateType => {
  switch (action.type) {
    case ActionType.STOCK_LIST:
      return {
        ...state,
        stockListLoading: action.payload.loading,
        stockList: action.payload.data as Array<typeListStock> | [],
        stockListError: action.payload.error
      };
    case ActionType.IN_OUT_STOCK_LIST:
      return {
        ...state,
        stockInOutLoading: action.payload.loading,
        stockInOut: action.payload.data as Array<typeInOutStock> | [],
        stockInOutError: action.payload.error
      };
    case ActionType.OPTION_STOCK_LIST:
      return {
        ...state,
        optionsStockLoading: action.payload.loading,
        optionsStock: action.payload.data as Array<typeListStock> | [],
        optionsStockError: action.payload.error
      };

    default:
      return state;
  }
};

export default stockReducer;
