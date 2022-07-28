import { Dispatch } from 'redux';
import IAuth from '@action/interface/auth';
import { ActionType } from '@store/actionTypes';

class SwallLoading {

  public show = (title: string, text: string) => (dispatch: Dispatch<IAuth>) => {
    dispatch({
      type: ActionType.SWAL_LOADING,
      payload: {
        swalTitle: title,
        swalText: text,
        swalLoading: true
      },
    });
  };

  public close = async (dispatch: Dispatch<IAuth>) => {
    const pop = () => new Promise(resolve => {
      dispatch({
        type: ActionType.SWAL_LOADING,
        payload: {
          swalTitle: '',
          swalText: '',
          swalLoading: false
        },
      });
      setTimeout(resolve, 2);
    });

    await Promise.resolve(pop());
  };

}

export default new SwallLoading();
