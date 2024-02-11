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

export const settingReducers = (state = initialState, setting) => {
  switch (setting.type) {
    case FETCH_SETTINGS_REQUEST:
      return {
        ...state,
        mode: 'requested',
      }
    case FETCH_SETTINGS_SUCCESS:
      return {
        allowedStartDate: new Date(setting.allowedStartDate),
        allowedEndDate: new Date(setting.allowedEndDate),
        error: '',
        mode: 'success',
      }
    case FETCH_SETTINGS_FAILURE:
      return {
        allowedStartDate: null,
        allowedEndDate: null,
        error: setting.payload,
        mode: 'failure',
      }
    default: return state;
  }
}
