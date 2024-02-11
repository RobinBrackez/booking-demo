
const MeetingRoom = (props) => {
  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">{props.name}</h5>
        <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
        <button className="btn btn-primary" onClick={() => props.onSelect()} disabled={!props.isAvailable}>Select</button>
      </div>
    </div>

  );
};

export default MeetingRoom;