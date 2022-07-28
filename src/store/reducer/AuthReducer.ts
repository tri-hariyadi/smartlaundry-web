import { ActionType } from '../actionTypes';
import TypeAuthAction from '@action/interface/auth';

interface StateType {
  loginLoading: boolean,
  loginError: string | boolean,
  token: {
    accessToken: string,
    refreshToken: string
  },
  registerLoading: boolean,
  registerData: boolean | string | null,
  registerError: boolean | string
  logoutLoading: boolean,
  userData: {
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
        user_id?: string;
        name: string,
        domain: string
    }
	} | null;
	userLoading: boolean;
	userError: string | boolean;

  swalLoading: boolean;
  swalTitle: string;
  swalText: string;

  role: Array<{
    _id: string,
    code: number,
    name: string,
    description: string
  }> | [],
}

const initialState: StateType = {
  loginLoading: false,
  loginError: false,
  token: {
    accessToken: '',
    refreshToken: ''
  },

  registerLoading: false,
  registerData: false,
  registerError: false,

  logoutLoading: false,

  userData: null,
  userLoading: false,
  userError: false,

  swalLoading: false,
  swalTitle: '',
  swalText: '',

  role: [],
};

const authReducer = (state: StateType = initialState, action: TypeAuthAction): StateType => {
  switch(action.type) {
    case ActionType.SWAL_LOADING:
      return {
        ...state,
        swalLoading: action.payload.swalLoading,
        swalTitle: action.payload.swalTitle,
        swalText: action.payload.swalText
      };
    case ActionType.USER_LOGIN:
      return {
        ...state,
        loginLoading: action.payload.loading,
        loginError: action.payload.error,
        token: action.payload.data.result
      };
    case ActionType.USER_REGISTER:
      return {
        ...state,
        registerLoading: action.payload.loading,
        registerData: action.payload.data,
        registerError: action.payload.error
      };
    case ActionType.USER_LOGOUT:
      return {
        ...initialState,
        logoutLoading: action.payload.loading
      };
    case ActionType.USER_DATA:
      return {
        ...state,
        userData: action.payload.data,
        userLoading: action.payload.loading,
        userError: action.payload.error
      };
    case ActionType.USER_ROLE:
      return {
        ...state,
        role: action.payload.data,
      };
    default:
      return state;
  }

};

export default authReducer;
