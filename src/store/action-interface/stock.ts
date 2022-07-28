import { ActionType } from '@store/actionTypes';

type typeStock = ActionType.STOCK_LIST;

export type typeListStock = {
  laundry: string;
  itemName: string;
  date: Date;
  input: number;
  out: number;
  returnItem: number;
  quantity: number;
  quantityType: string;
  cost: number;
  desc: string;
}

interface IStock {
  type: typeStock,
  payload: {
    loading: boolean,
    error: boolean | string,
    data: Array<typeListStock>
  }
}

export default IStock;
