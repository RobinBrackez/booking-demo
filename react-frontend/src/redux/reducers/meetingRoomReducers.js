import {
  FETCH_MEETINGROOMS_FAILURE,
  FETCH_MEETINGROOMS_REQUEST,
  FETCH_MEETINGROOMS_SUCCESS
} from "../types/meetingRoomTypes";

const initialState = {
  list: [],
  error: '',
  mode: 'initial',
}

export const meetingRoomReducers = (state = initialState, meetingRoom) => {
  switch (meetingRoom.type) {
    case FETCH_MEETINGROOMS_REQUEST:
      return {
        ...state,
        mode: 'requested',
      }
    case FETCH_MEETINGROOMS_SUCCESS:
      return {
        list: meetingRoom.payload,
        error: '',
        mode: 'success',
      }
    case FETCH_MEETINGROOMS_FAILURE:
      return {
        list: [],
        error: meetingRoom.payload,
        mode: 'failure',
      }
    default: return state;
  }
}
