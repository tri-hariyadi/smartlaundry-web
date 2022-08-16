import { ActionType } from '@store/actionTypes';

type typeStock = ActionType.STOCK_LIST | ActionType.IN_OUT_STOCK_LIST | ActionType.OPTION_STOCK_LIST;

export type typeListStock = {
  _id: string;
  laundry: string;
  code: string;
  itemName: string;
  quantityType: string;
  desc: string;
}

export type typeInOutStock = {
  _id: string;
  code: string;
  itemName: string;
  input: number;
  out: number;
  cost: number;
  stock_id: string;
  createdAt: string;
}

interface IStock {
  type: typeStock,
  payload: {
    loading: boolean,
    error: boolean | string,
    data: Array<typeListStock> | []
  }
}

export interface IInOutStock {
  type: typeStock,
  payload: {
    loading: boolean,
    error: boolean | string,
    data: Array<typeInOutStock> | []
  }
}

export default IStock;
