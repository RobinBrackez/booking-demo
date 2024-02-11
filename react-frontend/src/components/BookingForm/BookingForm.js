import {connect} from "react-redux";
import {useEffect, useState} from "react";
import MeetingRoom from "../MeetingRoom";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import {createBooking, fetchBookingsByDate} from "../../redux/actions/bookingActions";
import {formatDateYMD} from "../../utils/dateUtils";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const mapStateToProps = (state) => {
  return {
    meetingRoomsMode: state.meetingRooms.mode,
    settingsMode: state.settings.mode,
    meetingRooms: state.meetingRooms.list,
    bookings: state.bookings.list,
    allowedStartDate: state.settings.allowedStartDate,
    allowedEndDate: state.settings.allowedEndDate,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchBookingsByDate: (date) => dispatch(fetchBookingsByDate(date)),
    createBooking: (booking) => dispatch(createBooking(booking)),
  }
}


const BookingForm = (props) => {

  const [booking, setBooking] = useState({
    selectedDate: null,
    startTime: null,
    endTime: null,
    meetingRoom: null,
    capacity: 0,
    email: ''
  });

  const[isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!props.allowedStartDate) {
      return;
    }
    const initialStartTime = new Date(props.allowedStartDate.toString());
    initialStartTime.setHours(8);
    const initialEndTime = new Date(props.allowedStartDate.toString());
    initialEndTime.setHours(9);
    setBooking({
      ...booking,
      startTime: initialStartTime,
      endTime: initialEndTime,
      selectedDate: new Date(props.allowedStartDate)
    });
  }, [props.allowedStartDate]);


  useEffect(() => {
    if (booking.selectedDate === null) {
      return;
    }
    props.fetchBookingsByDate(booking.selectedDate);
  }, [booking.selectedDate]);

  useEffect(() => {
    if (booking.meetingRoom === null) {
      return;
    }
    if (!checkRoomAvailability(booking.meetingRoom.id)) {
      setBooking({...booking, meetingRoom: null});
    }
    if (booking.capacity > booking.meetingRoom.capacity) {
      setBooking({...booking, meetingRoom: null});
    }
  }, [booking.startTime, booking.endTime, booking.selectedDate, booking.capacity]);

  if (props.selectedDate === null) {
    return (
      <div className="App">
        <header className="bg-primary text-white p-5">
          <h1 className="text-center">Loading...</h1>
        </header>
      </div>
    )
  }

  function onStartDateChanged(date) {
    const startTime = new Date(date);
    startTime.setHours(booking.startTime.getHours());
    startTime.setMinutes(booking.startTime.getMinutes());

    const endTime = new Date(date);
    endTime.setHours(booking.endTime.getHours());
    endTime.setMinutes(booking.endTime.getMinutes());

    setBooking({...booking, selectedDate: date, startTime: startTime, endTime: endTime, meetingRoom: null});
  }

  function onEndTimeChanged(time) {
    console.log('onEndTimeChanged', time);
    setBooking({...booking, endTime: time});
  }

  function onStartTimeChanged(time) {
    setBooking({...booking, startTime: time});
  }

  function onCapacityChanged(event) {
    setBooking({...booking, capacity: event.target.value});
  }

  function getBookingsForMeetingRoom(meetingRoomId) {
    if (booking.selectedDate === null) {
      return [];
    }

    const selectedDateString = formatDateYMD(booking.selectedDate);

    return props.bookings.filter(
      (registeredBooking) =>
        registeredBooking.meetingRoom.id === meetingRoomId &&
        formatDateYMD(registeredBooking.startsAt) === selectedDateString
    );
  }

  function onMeetingRoomChanged(meetingRoom) {
    setBooking({...booking, meetingRoom: meetingRoom});
  }

  function checkRoomAvailability(meetingRoomId) {
    const requestedBooking = booking;  // Ensure 'booking' is defined in the outer scope
    const bookingsForMeetingRoom = getBookingsForMeetingRoom(meetingRoomId);

    // Room is available if there are no bookings for the meeting room
    if (bookingsForMeetingRoom.length === 0) {
      return true;
    }

    // Check for any overlapping booking
    const isOverlap = bookingsForMeetingRoom.some((registeredBooking) => {
      const startB = new Date(requestedBooking.startTime);

      const endB = new Date(requestedBooking.endTime);

      const startA = registeredBooking.startsAt;
      const endA = registeredBooking.endsAt;

      // Overlap condition
      return startA < endB && startB < endA;
    });

    // Room is available if there's no overlap
    return !isOverlap;
  }

  function onBook() {
    const errors = [];

    if (booking.meetingRoom === null) {
      errors.push('Select an available meeting room');
    }

    if (!booking.capacity) {
      errors.push('Enter the number of participants');
    }

    if (booking.meetingRoom && !checkRoomAvailability(booking.meetingRoom.id)) {
      // this shouldn't happen because it's caught in the useEffect hook
      errors.push('The selected meeting room is unavailable at the selected time');
    }

    if (booking.meetingRoom && booking.capacity > booking.meetingRoom.capacity) {
      // this shouldn't happen because it's caught in the useEffect hook
      errors.push('The selected meeting room is over capacity');
    }

    if (!booking.email) {
      errors.push('Enter your email');
    }

    if (errors.length > 0) {
      errors.forEach(error => {
        toast.error(error);
        console.log(error);
      });
      return;
    }

    setIsSubmitting(true);

    // Dispatch the booking
    const bookingObject = {
      ...booking,
      startsAt: booking.startTime,
      endsAt: booking.endTime,
    };

    props.createBooking(bookingObject);
  }

  function onEmailChanged(event) {
    setBooking({...booking, email: event.target.value});
  }

  return (
    <div className="card-body">
      <div className="mb-3">
        <label htmlFor="startDate" className="form-label">Date</label>
        <DatePicker
          name="startDate"
          selected={booking.selectedDate}
          onChange={(date) => onStartDateChanged(date)}
          minDate={props.allowedStartDate}
          maxDate={props.allowedEndDate}
          dateFormat="yyyy/MM/dd"
        />
      </div>
      <div className="mb-3">
        <label htmlFor="numberOfParticpants" className="form-label">Number Of Participants</label>
        <input type="number" className="form-control" id="numberOfParticpants"
               onChange={(event) => onCapacityChanged(event)}/>
      </div>
      <div className="container text-center">
        <div className="row row-cols-2 g-lg-3">
          {props.meetingRooms.length > 0 &&
            props.meetingRooms.map((meetingRoom, index) => (
              <div className="col" key={index}>
                <MeetingRoom {...meetingRoom}
                             isSelected={booking.meetingRoom && (meetingRoom.id === booking.meetingRoom.id)}
                             onMeetingRoomChanged={() => onMeetingRoomChanged(meetingRoom)}
                             timeslotAvailable={checkRoomAvailability(meetingRoom.id)}
                             maxCapacityExceeded={booking.capacity > meetingRoom.capacity}
                             bookings={getBookingsForMeetingRoom(meetingRoom.id)}/>
              </div>
            ))
          }
        </div>
      </div>
      <div className="mb-3">
        <div>
          <p>Select Start Time:</p>
          <DatePicker
            selected={booking.startTime}
            onChange={time => onStartTimeChanged(time)}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={30} // Time selection intervals in minutes
            timeCaption="Start Time"
            dateFormat="HH:mm" // Format for time display
          />
        </div>
        <div>
          <p>Select End Time:</p>
          <DatePicker
            selected={booking.endTime}
            onChange={time => onEndTimeChanged(time)}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={30} // Time selection intervals in minutes
            timeCaption="End Time"
            dateFormat="HH:mm" // Format for time display
            minTime={booking.startTime} // Ensuring end time is after start time
            maxTime={new Date(booking.endTime).setHours(23, 30)} // Latest selectable time
          />
        </div>
      </div>
      <div className="mb-3">
        <label htmlFor="email" className="form-label">Email</label>
        <input type="email" className="form-control" id="email" onChange={(event) => onEmailChanged(event)}/>
      </div>
      <ToastContainer />
      <button type="submit" className="btn btn-primary" onClick={() => onBook()}>Book Now</button>
    </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(BookingForm);