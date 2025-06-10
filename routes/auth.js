const express = require('express');
const router = express.Router();
const SpotifyWebApi = require('spotify-web-api-node');

// Scopes for Spotify API access
const SPOTIFY_SCOPES = [
  'user-read-private',
  'user-read-email',
  'playlist-read-private',
  'playlist-read-collaborative',
  'playlist-modify-public',
  'playlist-modify-private',
  'user-library-read',
  'user-library-modify',
  'user-follow-read',
  'user-follow-modify',
  'user-top-read',
  'ugc-image-upload'
];

// Single Spotify app configuration
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID || process.env.SOURCE_CLIENT_ID, // Fallback per compatibilità
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET || process.env.SOURCE_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI || process.env.SOURCE_REDIRECT_URI
});

// Configurazione per account destinazione (usando la stessa app ma redirect diverso)
const destRedirectUri = process.env.DEST_REDIRECT_URI || `${process.env.SPOTIFY_REDIRECT_URI}/destination` || 'http://localhost:5000/api/auth/destination/callback';

console.log('Spotify app configuration:', {
  clientId: spotifyApi.getClientId() ? `${spotifyApi.getClientId().substring(0, 5)}...` : 'Not set',
  redirectUri: spotifyApi.getRedirectURI(),
  destRedirectUri: destRedirectUri
});

// Login route for source account
router.get('/source/login', (req, res) => {
  // Pulisci la sessione precedente
  req.session.sourceTokens = null;
  req.session.sourceUser = null;
  
  const state = 'source-' + Math.random().toString(36).substring(7);
  req.session.authState = state; // Salviamo lo state in sessione per verificarlo
  
  const authorizeURL = spotifyApi.createAuthorizeURL(SPOTIFY_SCOPES, state, {
    showDialog: true // Forza il popup di autorizzazione
  });
  console.log('Source login redirect URL:', authorizeURL);
  res.redirect(authorizeURL);
});

// Callback route for source account
router.get('/source/callback', async (req, res) => {
  const { code, error, error_description, state } = req.query;
  
  // Log completo dei parametri di callback per debug
  console.log('Source callback received with params:', {
    code: code ? `${code.substring(0, 5)}...` : 'No code',
    error: error || 'None',
    error_description: error_description || 'None',
    state: state || 'None',
    expectedState: req.session.authState || 'None'
  });
  
  // Log error information if present in the callback
  if (error) {
    console.error('Spotify auth error:', { error, error_description });
    return res.redirect(`/error?message=Spotify authentication error: ${encodeURIComponent(error_description || error)}&debug=true`);
  }
  
  // Verifica che il codice di autorizzazione sia presente
  if (!code) {
    console.error('No authorization code received from Spotify');
    return res.redirect('/error?message=Failed to authenticate source account: No authorization code received&debug=true');
  }
  
  // Verifica state per sicurezza (opzionale ma consigliato)
  if (state && req.session.authState && state !== req.session.authState) {
    console.error('State mismatch in OAuth callback');
    return res.redirect('/error?message=Security error: state mismatch&debug=true');
  }
  
  try {
    console.log('Attempting source authorization code grant...');
    
    const data = await spotifyApi.authorizationCodeGrant(code);
    console.log('Source authorization successful, received tokens');
    console.log('Granted scopes:', data.body.scope || 'No scope information');
    
    // Save tokens to session with timestamp
    req.session.sourceTokens = {
      accessToken: data.body.access_token,
      refreshToken: data.body.refresh_token,
      expiresIn: data.body.expires_in,
      scope: data.body.scope,
      timestamp: Date.now()
    };
    
    // Create a separate API instance for source account
    const sourceApiInstance = new SpotifyWebApi({
      clientId: spotifyApi.getClientId(),
      clientSecret: spotifyApi.getClientSecret(),
      redirectUri: spotifyApi.getRedirectURI()
    });
    sourceApiInstance.setAccessToken(data.body.access_token);
    sourceApiInstance.setRefreshToken(data.body.refresh_token);
    
    // Get user profile
    console.log('Fetching source user profile...');
    const userProfile = await sourceApiInstance.getMe();
    req.session.sourceUser = userProfile.body;
    console.log('Source user authenticated:', userProfile.body.id, '(' + userProfile.body.display_name + ')');
    
    // Clear auth state
    req.session.authState = null;
    
    // Redirect to frontend or destination login
    if (req.session.destUser) {
      console.log('Both accounts authenticated, redirecting to preview');
      res.redirect('/preview');
    } else {
      console.log('Only source account authenticated, redirecting to destination page');
      res.redirect('/auth/destination');
    }
  } catch (error) {
    console.error('Error authenticating source account:', error);
    
    let errorMessage = 'Unknown error';
    
    if (error.body) {
      try {
        if (typeof error.body === 'string') {
          const parsedBody = JSON.parse(error.body);
          errorMessage = parsedBody.error_description || parsedBody.error || JSON.stringify(parsedBody);
        } else if (typeof error.body === 'object') {
          errorMessage = error.body.error_description || error.body.error || JSON.stringify(error.body);
        }
      } catch (e) {
        errorMessage = String(error.body);
      }
    } else if (error.message) {
      errorMessage = error.message;
    } else if (error.statusCode) {
      errorMessage = `HTTP Error: ${error.statusCode}`;
    } else {
      errorMessage = String(error);
    }
    
    // Gestione specifica per errore 403 Forbidden
    if (error.statusCode === 403) {
      errorMessage = 'Accesso negato (403 Forbidden). Verifica che l\'account sia aggiunto come utente di test nel Developer Dashboard di Spotify, oppure che l\'app sia in modalità estesa.';
    }
    
    res.redirect(`/error?message=Failed to authenticate source account: ${encodeURIComponent(errorMessage)}&debug=true`);
  }
});

// Login route for destination account
router.get('/destination/login', (req, res) => {
  // Pulisci la sessione precedente
  req.session.destTokens = null;
  req.session.destUser = null;
  
  const state = 'dest-' + Math.random().toString(36).substring(7);
  req.session.authState = state;
  
  // Temporarily change redirect URI for destination account
  const tempSpotifyApi = new SpotifyWebApi({
    clientId: spotifyApi.getClientId(),
    clientSecret: spotifyApi.getClientSecret(),
    redirectUri: destRedirectUri
  });
  
  const authorizeURL = tempSpotifyApi.createAuthorizeURL(SPOTIFY_SCOPES, state, {
    showDialog: true // Forza il popup di autorizzazione per cambiare account
  });
  console.log('Destination login redirect URL:', authorizeURL);
  res.redirect(authorizeURL);
});

// Callback route for destination account
router.get('/destination/callback', async (req, res) => {
  const { code, error, error_description, state } = req.query;
  
  console.log('Destination callback received with params:', {
    code: code ? `${code.substring(0, 5)}...` : 'No code',
    error: error || 'None',
    error_description: error_description || 'None',
    state: state || 'None',
    expectedState: req.session.authState || 'None'
  });
  
  if (error) {
    console.error('Spotify auth error for destination:', { error, error_description });
    return res.redirect(`/error?message=Destination authentication error: ${encodeURIComponent(error_description || error)}&debug=true`);
  }
  
  if (!code) {
    console.error('No authorization code received for destination account');
    return res.redirect('/error?message=Failed to authenticate destination account: No authorization code received&debug=true');
  }
  
  if (state && req.session.authState && state !== req.session.authState) {
    console.error('State mismatch in destination OAuth callback');
    return res.redirect('/error?message=Security error: state mismatch&debug=true');
  }
  
  try {
    console.log('Attempting destination authorization code grant...');
    
    // Use temporary API instance with destination redirect URI
    const tempSpotifyApi = new SpotifyWebApi({
      clientId: spotifyApi.getClientId(),
      clientSecret: spotifyApi.getClientSecret(),
      redirectUri: destRedirectUri
    });
    
    const data = await tempSpotifyApi.authorizationCodeGrant(code);
    console.log('Destination authorization successful, received tokens');
    console.log('Granted scopes:', data.body.scope || 'No scope information');
    
    // Save tokens to session
    req.session.destTokens = {
      accessToken: data.body.access_token,
      refreshToken: data.body.refresh_token,
      expiresIn: data.body.expires_in,
      scope: data.body.scope,
      timestamp: Date.now()
    };
    
    // Create a separate API instance for destination account
    const destApiInstance = new SpotifyWebApi({
      clientId: spotifyApi.getClientId(),
      clientSecret: spotifyApi.getClientSecret(),
      redirectUri: destRedirectUri
    });
    destApiInstance.setAccessToken(data.body.access_token);
    destApiInstance.setRefreshToken(data.body.refresh_token);
    
    // Get user profile
    console.log('Fetching destination user profile...');
    const userProfile = await destApiInstance.getMe();
    req.session.destUser = userProfile.body;
    console.log('Destination user authenticated:', userProfile.body.id, '(' + userProfile.body.display_name + ')');
    
    // Verifica che non sia lo stesso account
    if (req.session.sourceUser && req.session.sourceUser.id === userProfile.body.id) {
      console.warn('Warning: Source and destination accounts are the same user!');
      // Non blocchiamo, ma avvertiamo
    }
    
    // Clear auth state
    req.session.authState = null;
    
    console.log('Both accounts authenticated, redirecting to preview');
    res.redirect('/preview');
    
  } catch (error) {
    console.error('Error authenticating destination account:', error);
    
    let errorMessage = 'Unknown error';
    
    if (error.body) {
      try {
        if (typeof error.body === 'string') {
          const parsedBody = JSON.parse(error.body);
          errorMessage = parsedBody.error_description || parsedBody.error || JSON.stringify(parsedBody);
        } else if (typeof error.body === 'object') {
          errorMessage = error.body.error_description || error.body.error || JSON.stringify(error.body);
        }
      } catch (e) {
        errorMessage = String(error.body);
      }
    } else if (error.message) {
      errorMessage = error.message;
    } else if (error.statusCode) {
      errorMessage = `HTTP Error: ${error.statusCode}`;
    } else {
      errorMessage = String(error);
    }
    
    if (error.statusCode === 403) {
      errorMessage = 'Accesso negato (403 Forbidden). Verifica che l\'account destinazione sia aggiunto come utente di test nel Developer Dashboard di Spotify.';
    }
    
    res.redirect(`/error?message=Failed to authenticate destination account: ${encodeURIComponent(errorMessage)}&debug=true`);
  }
});

// Helper function to create API instance for account
const createApiInstance = (tokens, redirectUri = null) => {
  const apiInstance = new SpotifyWebApi({
    clientId: spotifyApi.getClientId(),
    clientSecret: spotifyApi.getClientSecret(),
    redirectUri: redirectUri || spotifyApi.getRedirectURI()
  });
  
  if (tokens) {
    apiInstance.setAccessToken(tokens.accessToken);
    if (tokens.refreshToken) {
      apiInstance.setRefreshToken(tokens.refreshToken);
    }
  }
  
  return apiInstance;
};

// Auth status route
router.get('/status', (req, res) => {
  const sourceAuthenticated = !!(req.session.sourceTokens && req.session.sourceUser);
  const destAuthenticated = !!(req.session.destTokens && req.session.destUser);
  
  console.log('Auth status check:', {
    sourceAuthenticated,
    destAuthenticated,
    sourceUser: req.session.sourceUser?.id,
    destUser: req.session.destUser?.id
  });
  
  res.json({
    sourceAuthenticated,
    destAuthenticated,
    sourceUser: req.session.sourceUser || null,
    destUser: req.session.destUser || null
  });
});

// Logout routes
router.post('/logout/source', (req, res) => {
  req.session.sourceTokens = null;
  req.session.sourceUser = null;
  console.log('Source account logged out');
  res.json({ success: true });
});

router.post('/logout/destination', (req, res) => {
  req.session.destTokens = null;
  req.session.destUser = null;
  console.log('Destination account logged out');
  res.json({ success: true });
});

router.post('/logout', (req, res) => {
  req.session.sourceTokens = null;
  req.session.sourceUser = null;
  req.session.destTokens = null;
  req.session.destUser = null;
  req.session.authState = null;
  console.log('Both accounts logged out');
  res.json({ success: true });
});

// Token refresh functionality
const refreshSourceToken = async (req, res, next) => {
  if (!req.session.sourceTokens) {
    return res.status(401).json({ error: 'Source account not authenticated' });
  }

  const tokens = req.session.sourceTokens;
  const now = Date.now();
  const tokenAge = now - tokens.timestamp;
  const tokenExpiry = tokens.expiresIn * 1000; // Convert to milliseconds

  // Refresh if token is expired or will expire in the next 5 minutes
  if (tokenAge > (tokenExpiry - 300000)) {
    try {
      console.log('Refreshing source access token...');
      const sourceApi = createApiInstance(tokens);
      const data = await sourceApi.refreshAccessToken();
      
      // Update tokens in session
      req.session.sourceTokens = {
        ...tokens,
        accessToken: data.body.access_token,
        expiresIn: data.body.expires_in,
        timestamp: now
      };
      
      console.log('Source token refreshed successfully');
    } catch (error) {
      console.error('Error refreshing source token:', error);
      return res.status(401).json({ error: 'Failed to refresh source token' });
    }
  }
  
  next();
};

const refreshDestToken = async (req, res, next) => {
  if (!req.session.destTokens) {
    return res.status(401).json({ error: 'Destination account not authenticated' });
  }

  const tokens = req.session.destTokens;
  const now = Date.now();
  const tokenAge = now - tokens.timestamp;
  const tokenExpiry = tokens.expiresIn * 1000;

  if (tokenAge > (tokenExpiry - 300000)) {
    try {
      console.log('Refreshing destination access token...');
      const destApi = createApiInstance(tokens, destRedirectUri);
      const data = await destApi.refreshAccessToken();
      
      req.session.destTokens = {
        ...tokens,
        accessToken: data.body.access_token,
        expiresIn: data.body.expires_in,
        timestamp: now
      };
      
      console.log('Destination token refreshed successfully');
    } catch (error) {
      console.error('Error refreshing destination token:', error);
      return res.status(401).json({ error: 'Failed to refresh destination token' });
    }
  }
  
  next();
};

// Export helper functions for use in other routes
router.createSourceApi = (req) => {
  return createApiInstance(req.session.sourceTokens);
};

router.createDestApi = (req) => {
  return createApiInstance(req.session.destTokens, destRedirectUri);
};

router.refreshSourceToken = refreshSourceToken;
router.refreshDestToken = refreshDestToken;

module.exports = router;