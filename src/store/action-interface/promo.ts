import { ActionType } from '@store/actionTypes';

type typePromo = ActionType.PROMO_LIST | ActionType.PROMO_BY_SERVICE;

interface IPromo {
  type: typePromo,
  payload: {
    loading: boolean,
    error: boolean | string,
    data: unknown
  }
}

export default IPromo;
