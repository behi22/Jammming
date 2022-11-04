import React from "react";
import "./Track.css";

export class Track extends React.Component {
  constructor(props) {
    super(props);

    this.renderAction = this.renderAction.bind(this);
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
  }

  renderAction() {
    const sign = this.props.isRemoval ? "-" : "+";
    return sign;
  }

  removeTrack() {
    this.props.onRemove(this.props.track);
  }

  addTrack() {
    if (!this.props.isRemoval) {
      this.props.onAdd(this.props.track);
    } else {
      this.removeTrack();
    }
  }

  render() {
    return (
      <div className="Track">
        <div className="Track-information">
          <h3>{this.props.track.name}</h3>
          <p>
            {this.props.track.artist}{" "}
            {this.props.track.artist && this.props.track.album && "|"}{" "}
            {this.props.track.album}
          </p>
        </div>
        <button
          className="Track-action"
          onClick={this.props.isRemoval ? this.removeTrack : this.addTrack}
        >
          {this.renderAction()}
        </button>
      </div>
    );
  }
}
