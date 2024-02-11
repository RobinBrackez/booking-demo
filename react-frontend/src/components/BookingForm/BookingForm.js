import {connect} from "react-redux";
import {useEffect, useState} from "react";
import MeetingRoom from "../MeetingRoom";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const mapStateToProps = (state, ownProps) => {
  return {
    meetingRoomsMode: state.meetingRooms.mode,
    settingsMode: state.settings.mode,
    meetingRooms: state.meetingRooms.list,
    // bookings: state.bookings.list,
    allowedStartDate: state.settings.allowedStartDate,
    allowedEndDate: state.settings.allowedEndDate,
  }
}

const BookingForm = (props) => {

  const [booking, setBooking] = useState({
    isValid: false,
    selectedDate: null,
    startTime: null,
    endTime: null,
    meetingRoom: null,
    email: ''
  });


  // useEffect(() => {
  //   if (!props.allowedStartDate) {
  //     return;
  //   }
  //   // setBooking({...booking, selectedDate: props.allowedStartDate});
  // }, [props.allowedStartDate]);

  if (props.meetingRoomsMode !== 'success' || props.settingsMode !== 'success') {
    return (
      <div className="App">
        <header className="bg-primary text-white p-5">
          <h1 className="text-center">Loading...</h1>
        </header>
      </div>
    )
  }

  const initialStartTime = new Date(props.allowedStartDate);
  initialStartTime.setHours(8);
  const initialEndTime = new Date(props.allowedStartDate);
  initialEndTime.setHours(17);


  function onStartDateChanged(date) {
    setBooking({...booking, selectedDate: date});
  }

  function onEndTimeChanged(time) {
    setBooking({...booking, endTime: time});
  }

  function onStartTimeChanged(time) {
    setBooking({...booking, startTime: time});
  }

  return (
    <div className="card-body">
      <form>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input type="email" className="form-control" id="email"/>
        </div>
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

          <div>
            <p>Select Start Time:</p>
            <DatePicker
              selected={booking.startTime}
              onChange={time => onStartTimeChanged(time)}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15} // Time selection intervals in minutes
              timeCaption="Start Time"
              dateFormat="h:mm aa" // Format for time display
            />
          </div>
          <div>
            <p>Select End Time:</p>
            <DatePicker
              selected={booking.endTime}
              onChange={time => onEndTimeChanged(time)}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15} // Time selection intervals in minutes
              timeCaption="End Time"
              dateFormat="h:mm aa" // Format for time display
              minTime={booking.startTime} // Ensuring end time is after start time
              maxTime={new Date(booking.startTime).setHours(23, 45)} // Latest selectable time
            />
          </div>
        </div>
        <div className="container text-center">
          <div className="row row-cols-2 g-lg-3">
            {props.meetingRooms.length > 0 &&
              props.meetingRooms.map((room, index) => (
                <div className="col" key={index}>
                  <MeetingRoom {...room} isAvailable={null} statusMessage={null} />
                </div>
              ))
            }
          </div>
        </div>
        <button type="submit" className="btn btn-primary" disabled={!booking.isValid}>Book Now</button>
      </form>
    </div>
  );
}

export default connect(mapStateToProps)(BookingForm);