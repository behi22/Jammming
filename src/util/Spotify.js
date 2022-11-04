let accessToken;
const CLIENT_ID = "02219c56ad7747cfb3e315aa3ab93980";
const REDIRECT_URI = "http://Behbod-Babai-Jammming.surge.sh";

const Spotify = {
  getAccessToken() {
    if (accessToken) {
      return accessToken;
    }

    const url = window.location.href;

    const accessTokenMatch = url.match(/access_token=([^&]*)/);
    const expiresInMatch = url.match(/expires_in=([^&]*)/);

    if (accessTokenMatch && expiresInMatch) {
      accessToken = accessTokenMatch[1];
      const expiresIn = Number(expiresInMatch[1]);
      window.setTimeout(() => (accessToken = ""), expiresIn * 1000);
      window.history.pushState("Access Token", null, "/");
      return accessToken;
    } else {
      window.location = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&scope=playlist-modify-public&redirect_uri=${REDIRECT_URI}`;
    }
  },

  search(term) {
    const accessToken = Spotify.getAccessToken();
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
      headers: { authorization: `Bearer ${accessToken}` },
    })
      .then((result1) => {
        return result1.json();
      })
      .then((result2) => {
        if (!result2.tracks) {
          return [];
        }
        return result2.tracks.items.map((track) => ({
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          uri: track.uri,
        }));
      });
  },

  savePlaylist(name, URIArray) {
    if (!(name && URIArray.length)) {
      return;
    }
    const accessToken = Spotify.getAccessToken();
    const headers = { authorization: `Bearer ${accessToken}` };
    let userId;
    return fetch("https://api.spotify.com/v1/me", { headers: headers })
      .then((result1) => result1.json())
      .then((response1) => {
        userId = response1.id;
        return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
          headers: headers,
          method: "POST",
          body: JSON.stringify({ name: name }),
        })
          .then((result2) => result2.json())
          .then((response2) => {
            const playlistID = response2.id;
            return fetch(
              `https://api.spotify.com/v1/users/${userId}/playlists/${playlistID}/tracks`,
              {
                headers: headers,
                method: "POST",
                body: JSON.stringify({ uris: URIArray }),
              }
            );
          });
      });
  },
};

export default Spotify;
