import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {connect} from "react-redux";
import {fetchMeetingRooms} from "./redux/actions/meetingRoomActions";
import {useEffect, useState} from "react";
import MeetingRoom from "./components/MeetingRoom";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const mapStateToProps = (state, ownProps) => {
  return {
    meetingRooms: state.meetingRooms.list,
    /*    bookings: state.bookings.list,*/
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    fetchMeetingRoomsAction: () => dispatch(fetchMeetingRooms()),
  }
}

const App = (props) => {
  const initialStartTime = new Date();
  initialStartTime.setHours(8);
  const initialEndTime = new Date();
  initialEndTime.setHours(17);
  const [booking, setBooking] = useState({
    isValid: false,
    selectedDate: null,
    startTime: initialStartTime,
    endTime: initialEndTime,
    meetingRoom: null,
    email: ''
  });

  useEffect(() => {
    props.fetchMeetingRoomsAction();
  }, []);

  const minDate = new Date();
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 7);

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
    <div className="App">
      <header className="bg-primary text-white p-5">
        <h1 className="text-center">Book a Meeting Room</h1>
      </header>
      <main className="container my-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h2 className="h4">Meeting Room Reservation Form</h2>
              </div>
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
                      minDate={minDate}
                      maxDate={new Date(maxDate)}
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
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(App);