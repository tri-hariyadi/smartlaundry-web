import { ActionType } from '../actionTypes';

interface IUserData {
  _id: string,
  fullName: string,
  email: string,
  phoneNumber: string,
  address: {
      city: string,
      street: string,
      lat: number,
      long: number
  },
  role: {
      _id: string,
      code: number,
      name: string,
      description: string
  },
  createdAt: string,
  updatedAt: string,
  laundry: {
      _id: string,
      name: string,
      domain: string
  }
}

interface LoginAction {
  type: ActionType.USER_LOGIN,
  payload: {
    loading: boolean,
    error: boolean | string,
    data: {result: { accessToken: string, refreshToken: string }}
  }
}

interface RegisterAction {
  type: ActionType.USER_REGISTER,
  payload: {
    loading: boolean,
    error: boolean | string,
    data: boolean | string | null
  }
}

interface LogoutAction {
  type: ActionType.USER_LOGOUT,
  payload: {
    loading: boolean,
    error: boolean | string,
    data: boolean | string | null
  }
}

interface IUser {
  type: ActionType.USER_DATA,
  payload: {
    loading: boolean,
    error: boolean | string,
    data: IUserData,
  }
}

interface IUserRole {
  type: ActionType.USER_ROLE,
  payload: {
    loading: boolean,
    error: boolean | string,
    data: any,
  }
}

interface ISwalLoading {
  type: ActionType.SWAL_LOADING,
  payload: {
    swalTitle: string,
    swalText: string,
    swalLoading: boolean
  }
}

type TypeAuthAction = ISwalLoading | LoginAction | RegisterAction | LogoutAction | IUser | IUserRole;

export default TypeAuthAction;
