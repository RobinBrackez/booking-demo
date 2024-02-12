import axios from "axios";
import {
  CREATE_BOOKING_FAILURE,
  CREATE_BOOKING_REQUEST,
  CREATE_BOOKING_SUCCESS,
  FETCH_BOOKINGS_FAILURE,
  FETCH_BOOKINGS_REQUEST,
  FETCH_BOOKINGS_SUCCESS
} from "../types/bookingTypes";
import {formatDateYMD} from "../../utils/dateUtils";

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
  const apiUrl = process.env.REACT_APP_API_URL;

  return (dispatch) => {
    dispatch(createBookingRequest());
    axios.post(apiUrl + `/bookings`,
      payload,
      {
        headers:
          {
            'Content-Type': 'application/ld+json'
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

/**
 * @todo Error handling doesn't display the detailled error message but a generic one
 */
export const fetchBookingsByDate = (startDate) => {
  const apiUrl = process.env.REACT_APP_API_URL;

  return (dispatch) => {
    dispatch(fetchBookingsRequest())
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);
    axios.get(`${apiUrl}/bookings?startsAt[before]=${formatDateYMD(endDate)}&startsAt[after]=${formatDateYMD(startDate)}&order[startsAt]=asc`)
      .then(response => {
        const bookings = response.data['hydra:member'];
        dispatch(fetchBookingsSuccess(bookings));
      })
      .catch(error => {
        let errorMsg = error.message;
        console.log(error);
        if (error.response && error.response.data && error.response.data.detail) {
          errorMsg = error.response.data.detail;
        }
        dispatch(fetchBookingsFailure(errorMsg));
      })
  }
}
