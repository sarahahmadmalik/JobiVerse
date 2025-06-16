import axios from 'axios';

let zoomToken = null;
let tokenExpiry = null;

export async function getZoomToken() {
  if (zoomToken && Date.now() < tokenExpiry) {
    return zoomToken;
  }

  const response = await axios.post('https://zoom.us/oauth/token', null, {
    params: {
      grant_type: 'account_credentials',
      account_id: process.env.ZOOM_ACCOUNT_ID,
    },
    auth: {
      username: process.env.ZOOM_CLIENT_ID,
      password: process.env.ZOOM_CLIENT_SECRET,
    },
  });

  zoomToken = response.data.access_token;
  tokenExpiry = Date.now() + (response.data.expires_in * 1000);
  return zoomToken;
}