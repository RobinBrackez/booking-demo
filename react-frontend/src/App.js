import 'bootstrap/dist/css/bootstrap.min.css';
import {connect} from "react-redux";
import {fetchMeetingRooms} from "./redux/actions/meetingRoomActions";
import {useEffect} from "react";
import "react-datepicker/dist/react-datepicker.css";
import {fetchSettings} from "./redux/actions/settingsActions";
import BookingForm from "./components/BookingForm/BookingForm";

const mapStateToProps = (state) => {
  return {
    meetingRoomsMode: state.meetingRooms.mode,
    settingsMode: state.settings.mode,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchMeetingRoomsAction: () => dispatch(fetchMeetingRooms()),
    fetchSettingsAction: () => dispatch(fetchSettings()),
  }
}

const App = (props) => {

  useEffect(() => {
    props.fetchMeetingRoomsAction();
    props.fetchSettingsAction()
  }, []);

  if (props.meetingRoomsMode !== 'success' || props.settingsMode !== 'success') {
    return (
      <div className="App">
        <header className="bg-primary text-white p-5">
          <h1 className="text-center">Loading...</h1>
        </header>
      </div>
    )
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
              <BookingForm/>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(App);