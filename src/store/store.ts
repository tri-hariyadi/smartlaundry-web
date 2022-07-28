import { legacy_createStore as createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createWrapper } from 'next-redux-wrapper';
import RootReducer from '@reducer/index';

const initialState = {};

const store = createStore(
  RootReducer,
  initialState,
  composeWithDevTools(applyMiddleware(thunk))
);

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
// assigning store to next wrapper
const makeStore = () => store;

const wrapper = createWrapper(makeStore);

export {
  store,
  wrapper
};
