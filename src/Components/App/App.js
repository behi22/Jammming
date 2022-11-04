import React from "react";
import "./App.css";

import { SearchBar } from "../SearchBar/SearchBar";
import { SearchResults } from "../SearchResults/SearchResults";
import { Playlist } from "../Playlist/Playlist";

import Spotify from "../../util/Spotify";

import { Alert } from "@mui/material";

export class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      SearchResults: [],
      playlistName: "Give me a cool name!",
      playlistTracks: [],
      connected: false,
      alerted: false,
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
    this.connect = this.connect.bind(this);
  }

  connect(e) {
    Spotify.getAccessToken();
  }

  addTrack(track) {
    if (
      this.state.playlistTracks.find((savedTrack) => savedTrack.id === track.id)
    ) {
      return;
    } else {
      this.setState((prevState) => ({
        playlistTracks: [...prevState.playlistTracks, track],
      }));
    }
  }

  removeTrack(track) {
    let trackToDelete = this.state.playlistTracks.find(
      (selectedTrack) => selectedTrack.id === track.id
    );
    this.state.playlistTracks.splice(
      this.state.playlistTracks.indexOf(trackToDelete),
      1
    );
    this.setState({ playlistTracks: this.state.playlistTracks });
  }

  updatePlaylistName(name) {
    this.setState({ playlistName: name });
  }

  async savePlaylist() {
    const trackURIs = [];
    for (let i = 0; i < this.state.playlistTracks.length; i++) {
      trackURIs.push("spotify:track:" + this.state.playlistTracks[i].id);
    }
    if (await Spotify.savePlaylist(this.state.playlistName, trackURIs)) {
      this.setState({
        playlistName: "Give me a cool name!",
        playlistTracks: [],
      });
    } else {
      alert("Oops, Something went wrong! Please try again.");
    }
  }

  search(term) {
    Spotify.search(term).then((searchResults) => {
      this.setState({ SearchResults: searchResults });
    });
  }

  render() {
    return (
      <div>
        <h1>
          Ja<span className="highlight">mmm</span>ing
        </h1>
        <div className="App">
          {this.state.connected && (
            <Alert
              onClose={() => {
                this.setState({ connected: false });
              }}
              variant="filled"
              color="success"
            >
              Successfully connected to your Spotify account, and it looks
              Awesome!
            </Alert>
          )}
          {!this.state.connected && !this.state.alerted && (
            <React.Fragment>
              <div id="preconnect-info">
                <br />
                <p>
                  Welcome to Jammming by Behbod Babai. This is a solo project
                  that I've been working on, so that I can learn more about
                  React. In this application you can search for songs, make a
                  playlist for yourself, and add it to your Spotify account.
                  Please do note that in order to connect to your spotify
                  account through this app, you will need my approval. You can
                  do that by messaging me on{" "}
                  <a
                    href="https://www.linkedin.com/in/behbod-babai-6573451b0/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    LinkedIn
                  </a>
                  , and letting me know so that I can add you as a user.
                </p>
                <button id="s-connect" onClick={this.connect}>
                  Connect to Spotify <i className="fa-brands fa-spotify"></i>
                </button>
              </div>
              <br />
            </React.Fragment>
          )}
          {(this.state.connected || this.state.alerted) && (
            <SearchBar onSearch={this.search} />
          )}
          <div className="App-playlist">
            <SearchResults
              onAdd={this.addTrack}
              searchResults={this.state.SearchResults}
            />
            <Playlist
              playlistName={this.state.playlistName}
              playlistTracks={this.state.playlistTracks}
              onRemove={this.removeTrack}
              onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist}
            />
          </div>
        </div>
      </div>
    );
  }

  componentDidMount() {
    if (
      window.location.href.match(/access_token=([^&]*)/) &&
      window.location.href.match(/expires_in=([^&]*)/)
    ) {
      this.setState({ connected: true });
      this.setState({ alerted: true });
    } else {
      this.setState({ connected: false });
    }
  }
}
