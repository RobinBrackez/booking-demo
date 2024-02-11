import axios from "axios";
import {
  FETCH_SETTINGS_FAILURE,
  FETCH_SETTINGS_REQUEST,
  FETCH_SETTINGS_SUCCESS
} from "../types/settingTypes";

export const fetchSettingsRequest = () => {
  return {
    type: FETCH_SETTINGS_REQUEST
  }
}

export const fetchSettingsSuccess = settings => { //db settings
  return {
    type: FETCH_SETTINGS_SUCCESS,
    payload: settings,
  }
}

export const fetchSettingsFailure = error => {
  return {
    type: FETCH_SETTINGS_FAILURE,
    payload: error,
  }
}

export const fetchSettings = () => {
  const apiUrl = process.env.REACT_APP_API_URL;

  return (dispatch) => {
    dispatch(fetchSettingsRequest())
    axios.get(apiUrl + `/settings`)
      .then(response => {
        const settingsData = response.data;
        dispatch(fetchSettingsSuccess(settingsData));
      })
      .catch(error => {
        const errorMsg = error.message;
        dispatch(fetchSettingsFailure(errorMsg));
      })
  }
}
