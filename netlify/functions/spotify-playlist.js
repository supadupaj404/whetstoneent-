// Fetches Spotify playlist tracks with preview URLs
// Filters out tracks without previews

let cachedToken = null;
let tokenExpiry = 0;

async function getAccessToken() {
  // Return cached token if valid
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64')
    },
    body: 'grant_type=client_credentials'
  });

  if (!response.ok) {
    throw new Error('Failed to get Spotify token');
  }

  const data = await response.json();
  cachedToken = data.access_token;
  tokenExpiry = Date.now() + (data.expires_in - 60) * 1000;

  return cachedToken;
}

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  try {
    const playlistId = event.queryStringParameters?.id;

    if (!playlistId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Playlist ID required' })
      };
    }

    const accessToken = await getAccessToken();

    // Fetch playlist tracks (up to 100)
    const response = await fetch(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks?market=US&limit=100&fields=items(track(id,name,artists,album(name,images),duration_ms,preview_url,external_urls))`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('Spotify API error:', error);
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({ error: 'Failed to fetch playlist' })
      };
    }

    const data = await response.json();

    // Transform and filter tracks (only those with preview URLs)
    const tracks = data.items
      .filter(item => item.track && item.track.preview_url)
      .map((item, index) => ({
        id: item.track.id,
        index: index,
        name: item.track.name,
        artist: item.track.artists.map(a => a.name).join(', '),
        album: item.track.album.name,
        albumArt: item.track.album.images?.[2]?.url || item.track.album.images?.[0]?.url,
        duration: item.track.duration_ms,
        previewUrl: item.track.preview_url,
        spotifyUrl: item.track.external_urls?.spotify
      }));

    const totalTracks = data.items.filter(item => item.track).length;
    const tracksWithPreviews = tracks.length;

    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Cache-Control': 'public, max-age=300' // Cache for 5 minutes
      },
      body: JSON.stringify({
        tracks,
        meta: {
          total: totalTracks,
          withPreviews: tracksWithPreviews,
          withoutPreviews: totalTracks - tracksWithPreviews
        }
      })
    };

  } catch (error) {
    console.error('Playlist function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
