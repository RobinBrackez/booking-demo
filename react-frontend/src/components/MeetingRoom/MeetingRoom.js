
const MeetingRoom = (props) => {

  const backgroundColor = props.isAvailable === null ? 'light' : props.isAvailable ? 'success' : 'danger';

  return (
    <div className={"card text-bg-" + backgroundColor}>
      <div className="card-body">
        <h5 className="card-title">{props.name}</h5>
        <p className="card-text">{props.statusMessage}</p>
        <button className={"btn btn-" + backgroundColor} onClick={() => props.onSelect()} disabled={!props.isAvailable}>Select</button>
      </div>
    </div>

  );
};

export default MeetingRoom;