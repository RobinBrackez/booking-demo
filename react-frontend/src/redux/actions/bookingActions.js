import axios from "axios";
import {
  CREATE_BOOKING_FAILURE,
  CREATE_BOOKING_REQUEST,
  CREATE_BOOKING_SUCCESS,
  FETCH_BOOKINGS_FAILURE,
  FETCH_BOOKINGS_REQUEST,
  FETCH_BOOKINGS_SUCCESS
} from "../types/bookingTypes";

export const fetchBookingsRequest = () => {
  return {
    type: FETCH_BOOKINGS_REQUEST
  }
}

export const fetchBookingsSuccess = bookings => { //db bookings
  return {
    type: FETCH_BOOKINGS_SUCCESS,
    payload: bookings,
  }
}

export const fetchBookingsFailure = error => {
  return {
    type: FETCH_BOOKINGS_FAILURE,
    payload: error,
  }
}

export const createBookingRequest = () => {
  return {
    type: CREATE_BOOKING_REQUEST
  }
}

export const createBookingsuccess = booking => { // db booking
  return {
    type: CREATE_BOOKING_SUCCESS,
    payload: booking,
  }
}

export const createBookingFailure = error => {
  return {
    type: CREATE_BOOKING_FAILURE,
    payload: error,
  }
}


export const createBooking = (payload) => {
  return (dispatch) => {
    dispatch(createBookingRequest());
    axios.post(`/api/booking/`,
      payload,
      {
        headers:
          {
            'Content-Type': 'application/json'
          }
      }
    ).then((response) => {
      return dispatch(createBookingsuccess(response.data))
    })
    .catch(error => {
      const errorMsg = error.message;
      dispatch(createBookingFailure(errorMsg));
    })
  }
}

export const fetchBookingsByDate = (startDate, endDate) => {
  return (dispatch) => {
    dispatch(fetchBookingsRequest())
    axios.get(`/api/bookings/${feature.id}/${person.id}`)
      .then(response => {
        const types = response.data;
        dispatch(fetchBookingsSuccess(types));
      })
      .catch(error => {
        const errorMsg = error.message;
        dispatch(fetchBookingsFailure(errorMsg));
      })
  }
}
