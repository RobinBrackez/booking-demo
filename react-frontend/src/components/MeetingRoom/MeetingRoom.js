import {formatTime} from "../../utils/dateUtils";

const MeetingRoom = (props) => {

  let backgroundColor = props.timeslotAvailable && !props.maxCapacityExceeded ? 'success' : 'light';

  return (
    <div className={"card text-bg-" + backgroundColor}>
      <div className="card-body">
        <h5 className="card-title">{props.name}</h5>
        <p className="card-text">Capacity: {props.capacity}</p>
        {props.maxCapacityExceeded && <p className="card-text">Too many participants for this meeting room</p>}
        {props.bookings.length > 0 && <p className="card-text">Current bookings:</p>}
        <p className="card-text">{props.bookings && (
          props.bookings.map((booking) => (
            <span key={booking.id}>
              {formatTime(booking.startsAt)} -
              {formatTime(booking.endsAt)}<br/>
            </span>
          ))
        )}</p>
        {props.isSelected && <p className="card-text"><strong>Selected</strong></p>}
        {!props.isSelected && props.timeslotAvailable && !props.maxCapacityExceeded && <button className={"btn btn-light"} onClick={() => props.onMeetingRoomChanged()}>Select</button> }
      </div>
    </div>

  );
};

export default MeetingRoom;