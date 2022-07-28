import { combineReducers } from 'redux';
import AuthReducer from './AuthReducer';
import ServicesReducer from './ServicesReducer';
import PromoReducer from './PromoReducer';
import OrderReducer from './OrderReducer';
import StockReducer from './StockReducer';

const rootReducer = combineReducers({
  AuthReducer,
  ServicesReducer,
  PromoReducer,
  OrderReducer,
  StockReducer
});

export default rootReducer;
