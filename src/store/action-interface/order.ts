import { ActionType } from '@store/actionTypes';

type typeOrder = ActionType.ORDER_LIST;

interface IOrder {
  type: typeOrder,
  payload: {
    loading: boolean,
    error: boolean | string,
    data: unknown
  }
}

export default IOrder;
