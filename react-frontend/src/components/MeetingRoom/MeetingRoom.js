
const MeetingRoom = (props) => {

  let backgroundColor = props.isAvailable === null ? 'light' : props.isAvailable ? 'success' : 'danger';

  if (props.maxCapacityExceeded){
    backgroundColor = 'danger';
  }

  function getTimeString(date) {
    const hours = String(date.getHours()).padStart(2, '0'); // Ensures two digits
    const minutes = String(date.getMinutes()).padStart(2, '0'); // Ensures two digits
    return `${hours}:${minutes}`;
  }

  return (
    <div className={"card text-bg-" + backgroundColor}>
      <div className="card-body">
        <h5 className="card-title">{props.name}</h5>
        <p className="card-text">{props.statusMessage}</p>
        <p className="card-text">Max number of participants: {props.capacity}</p>
        {props.maxCapacityExceeded && <p className="card-text">Max number of participants has exceeded</p>}
        {props.bookings.length > 0 && <p className="card-text">This room is unavailable at:</p>}
        <p className="card-text">{props.bookings && (
          props.bookings.map((booking) => (
            <span key={booking.id}>
              {getTimeString(booking.startsAt)} -
              {getTimeString(booking.endsAt)}<br/>
            </span>
          ))
        )}</p>
        <button className={"btn btn-" + backgroundColor} onClick={() => props.onSelect()} disabled={!props.isAvailable}>Select</button>
      </div>
    </div>

  );
};

export default MeetingRoom;