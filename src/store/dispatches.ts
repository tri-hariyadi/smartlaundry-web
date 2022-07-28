import { Dispatch } from 'redux';
import { ActionType } from './actionTypes';

export const loadingDispatch = (dispatch: Dispatch, type: ActionType) => {
  return dispatch({
    type: type,
    payload: {
      loading: true,
      data: false,
      error: false,
    },
  });
};

export const successDispatch = <T>(dispatch: Dispatch, type: ActionType, data: T) => {
  return dispatch({
    type: type,
    payload: {
      loading: false,
      data: data,
      error: false,
    },
  });
};

export const errorDispatch = (dispatch: Dispatch, type: ActionType, error: string) => {
  return dispatch({
    type: type,
    payload: {
      loading: false,
      data: false,
      error: error,
    },
  });
};
