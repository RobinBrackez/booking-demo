import {combineReducers, compose} from "redux";
import {createStore, applyMiddleware} from "redux";
import { thunk } from 'redux-thunk';
import logger from 'redux-logger';
import {meetingRoomReducers} from "./reducers/meetingRoomReducers";

const composeEnhancers =
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
    }) : compose;


const rootReducer = combineReducers({
    meetingRooms: meetingRoomReducers, // the key is how it is called inside the state
    /* bookings: BookingReducer,*/
});

const configureStore = () => {
  return createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(logger, thunk))
    // Apply other middlewares or enhancers if needed
  );
};

export default configureStore;
