import {
  FETCH_SETTINGS_FAILURE,
  FETCH_SETTINGS_REQUEST,
  FETCH_SETTINGS_SUCCESS
} from "../types/settingTypes";

const initialState = {
  allowedStartDate: null,
  allowedEndDate: null,
  error: '',
  mode: 'initial',
}

export const settingReducers = (state = initialState, settings) => {
  switch (settings.type) {
    case FETCH_SETTINGS_REQUEST:
      return {
        ...state,
        mode: 'requested',
      }
    case FETCH_SETTINGS_SUCCESS:
      return {
        allowedStartDate: new Date(settings.payload.allowedStartDate),
        allowedEndDate: new Date(settings.payload.allowedEndDate),
        error: '',
        mode: 'success',
      }
    case FETCH_SETTINGS_FAILURE:
      return {
        allowedStartDate: null,
        allowedEndDate: null,
        error: settings.payload,
        mode: 'failure',
      }
    default: return state;
  }
}
