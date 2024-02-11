import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import { thunk } from 'redux-thunk';
import logger from 'redux-logger';
import {meetingRoomReducers} from "./reducers/meetingRoomReducers";
import {bookingReducers} from "./reducers/bookingReducers";
import {settingReducers} from "./reducers/settingsReducers";

const composeEnhancers =
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
    }) : compose;


const rootReducer = combineReducers({
    meetingRooms: meetingRoomReducers,
    bookings: bookingReducers,
    settings: settingReducers,
});

const configureStore = () => {
  return createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(logger, thunk))
    // Apply other middlewares or enhancers if needed
  );
};

export default configureStore;
