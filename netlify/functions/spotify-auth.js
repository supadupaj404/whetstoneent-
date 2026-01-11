// Spotify Client Credentials Authentication
// Returns an access token for API requests (no user login required)

let cachedToken = null;
let tokenExpiry = 0;

exports.handler = async (event, context) => {
  // CORS headers
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
    // Return cached token if still valid
    if (cachedToken && Date.now() < tokenExpiry) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          access_token: cachedToken,
          expires_in: Math.floor((tokenExpiry - Date.now()) / 1000)
        })
      };
    }

    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Spotify credentials not configured' })
      };
    }

    // Request new token using Client Credentials flow
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64')
      },
      body: 'grant_type=client_credentials'
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Spotify auth error:', error);
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({ error: 'Failed to authenticate with Spotify' })
      };
    }

    const data = await response.json();

    // Cache the token (with 60 second buffer)
    cachedToken = data.access_token;
    tokenExpiry = Date.now() + (data.expires_in - 60) * 1000;

    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Cache-Control': `public, max-age=${data.expires_in - 60}`
      },
      body: JSON.stringify({
        access_token: data.access_token,
        expires_in: data.expires_in
      })
    };

  } catch (error) {
    console.error('Auth function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
