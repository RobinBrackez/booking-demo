import {
  CREATE_BOOKING_FAILURE,
  CREATE_BOOKING_REQUEST,
  CREATE_BOOKING_SUCCESS,
  FETCH_BOOKINGS_FAILURE,
  FETCH_BOOKINGS_REQUEST,
  FETCH_BOOKINGS_SUCCESS
} from "../types/bookingTypes";

const initialState = {
  list: [],
  error: '',
  mode: 'initial',
  creationMode: 'initial',
}

export const bookingReducers = (state = initialState, booking) => {
  switch (booking.type) {
    case FETCH_BOOKINGS_REQUEST:
      return {
        ...state,
        mode: 'requested',
      }
    case FETCH_BOOKINGS_SUCCESS:
      const updatedList = [
        ...state.list,
        ...booking.payload
          .map(b => ({ ...b, startsAt: new Date(b.startsAt), endsAt: new Date(b.endsAt) }))
          .filter(newBooking => !state.list.some(existing => existing.id === newBooking.id))
      ];
      const sortedBookingList = updatedList.sort((a, b) => {
        return new Date(a.startsAt) - new Date(b.startsAt);
      });
      return {
        list: sortedBookingList,
        error: '',
        mode: 'success',
      }
    case FETCH_BOOKINGS_FAILURE:
      return {
        list: [],
        error: booking.payload,
        mode: 'failure',
      }
    case CREATE_BOOKING_REQUEST:
      return {
        ...state,
        error: '',
        mode: 'requested',
        creationMode: 'requested',
      }
    case CREATE_BOOKING_SUCCESS:
      const updatedBooking = {
        ...booking.payload,
        startsAt: new Date(booking.payload.startsAt),
        endsAt: new Date(booking.payload.endsAt)
      };
      const sortedBookings = [...state.list, updatedBooking].sort((a, b) => {
        return new Date(a.startsAt) - new Date(b.startsAt);
      });
      return {
        list: sortedBookings,
        error: '',
        mode: 'success',
        creationMode: 'success',
      }
    case CREATE_BOOKING_FAILURE:
      return {
        list: [...state.list],
        error: booking.payload,
        mode: 'failure',
        creationMode: 'failure',
      }
    default: return state;
  }

}
