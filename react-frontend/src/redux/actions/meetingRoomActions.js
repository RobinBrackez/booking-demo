import axios from "axios";
import {
  FETCH_MEETINGROOMS_FAILURE,
  FETCH_MEETINGROOMS_REQUEST,
  FETCH_MEETINGROOMS_SUCCESS
} from "../types/meetingRoomTypes";

export const fetchMeetingRoomsRequest = () => {
  return {
    type: FETCH_MEETINGROOMS_REQUEST
  }
}

export const fetchMeetingRoomsSuccess = meetingRooms => { //db meetingRooms
  return {
    type: FETCH_MEETINGROOMS_SUCCESS,
    payload: meetingRooms,
  }
}

export const fetchMeetingRoomsFailure = error => {
  return {
    type: FETCH_MEETINGROOMS_FAILURE,
    payload: error,
  }
}

export const fetchMeetingRooms = () => {
  const apiUrl = process.env.REACT_APP_API_URL;

  return (dispatch) => {
    dispatch(fetchMeetingRoomsRequest())
    axios.get(apiUrl + `/meeting-rooms`)
      .then(response => {
        const meetingRoomData = response.data['hydra:member'];
        dispatch(fetchMeetingRoomsSuccess(meetingRoomData));
      })
      .catch(error => {
        const errorMsg = error.message;
        dispatch(fetchMeetingRoomsFailure(errorMsg));
      })
  }
}
