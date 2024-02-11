import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {connect} from "react-redux";
import {fetchMeetingRooms} from "./redux/actions/meetingRoomActions";
import {useEffect} from "react";
import MeetingRoom from "./components/MeetingRoom";

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

  useEffect(() => {
    props.fetchMeetingRoomsAction();
  }, []);

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
                    <label htmlFor="meetingRoom" className="form-label">Meeting Room Name</label>
                    {props.meetingRooms.length > 0 && (
                      <div>
                        {props.meetingRooms.map((room, index) => (
                          <MeetingRoom key={index} {...room} />
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="date" className="form-label">Date</label>
                    <input type="date" className="form-control" id="date" />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="startTime" className="form-label">Start Time</label>
                    <input type="time" className="form-control" id="startTime" />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="endTime" className="form-label">End Time</label>
                    <input type="time" className="form-control" id="endTime" />
                  </div>
                  <button type="submit" className="btn btn-primary">Book Now</button>
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