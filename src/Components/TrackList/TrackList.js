import React from "react";
import "./TrackList.css";
import { Track } from "../Track/Track";

export class TrackList extends React.Component {
  render() {
    const trackComponents = this.props.tracks.map((track) => {
      return (
        <Track
          onRemove={this.props.onRemove}
          isRemoval={this.props.isRemoval}
          onAdd={this.props.onAdd}
          track={track}
          key={track.id}
        />
      );
    });
    return <div className="TrackList">{trackComponents}</div>;
  }
}
