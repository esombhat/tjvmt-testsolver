import pkg from "simple-oauth2";
import { env } from "$env/dynamic/private";

const { AuthorizationCode } = pkg;

const ion_client_id = env.ION_CLIENT_ID;
const ion_client_secret = env.ION_CLIENT_SECRET;
const ion_redirect_uri = env.ION_REDIRECT_URI; // e.g., http://localhost:5173/auth/callback

export const oauth = new AuthorizationCode({
  client: {
    id: ion_client_id,
    secret: ion_client_secret,
  },
  auth: {
    tokenHost: "https://ion.tjhsst.edu/oauth/",
    authorizePath: "https://ion.tjhsst.edu/oauth/authorize",
    tokenPath: "https://ion.tjhsst.edu/oauth/token/",
  },
  options: {
    authorizationMethod: "body",
  },
});

// Build the authorization URL
export const authorizationUri = oauth.authorizeURL({
  scope: "read",
  redirect_uri: ion_redirect_uri,
});
