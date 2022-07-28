import { ActionType } from '../actionTypes';

export interface IDetailService {
  _id: string,
  name: string,
  desc: string,
  banner: Array<string>,
  price: number,
  quantityType: string,
  subServices: Array<{
    name: string,
    price: number,
    banner: string,
    type: string,
    _id: string
  }>,
  createdAt: string,
  updatedAt: string,
  promo: {
    start: string,
    end: string,
    diskon: {
      typeDiskon: string,
      valueDiskon: number
    },
    minOrder: {
      typeMinOrder: string,
      valueMinOrder: number
    }
  },
  ratingAverage: number
}

export interface IServiceReview {
  name: string;
  rating: number;
  comment: string;
  id_service: {
      _id: string;
      name: string;
  };
  sub_service: string;
  createdAt: string;
  updatedAt: string;
}

type typeService = ActionType.SERVICES_DATA | ActionType.SERVICE_LAUNDRY | ActionType.SERVICE_REVIEW;

interface IService {
  type: typeService,
  payload: {
    loading: boolean,
    error: boolean | string,
    data: unknown
  }
}

export default IService;
