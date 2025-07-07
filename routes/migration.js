//Developed by tomzdev, Translated by gomgo-github

const express = require('express');
const router = express.Router();
const auth = require('./auth');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const writeFileAsync = promisify(fs.writeFile);
const unlinkAsync = promisify(fs.unlink);
const mkdirAsync = promisify(fs.mkdir);

// Middleware to ensure both accounts are authenticated
const ensureAuthenticated = (req, res, next) => {
  if (!req.session.sourceUser || !req.session.destUser) {
    return res.status(401).json({ error: 'Both accounts must be authenticated' });
  }
  next();
};

// Helper function to get API instances with current tokens
const getApiInstances = (req) => {
  const sourceApi = auth.createSourceApi(req);
  const destApi = auth.createDestApi(req);
  return { sourceApi, destApi };
};

// 🔒 SECURITY: Function to perform granular checks for existing tracks
const checkExistingTracksInBatch = async (trackIds, req) => {
  try {
    const { destApi } = getApiInstances(req);
    const checkResult = await destApi.containsMySavedTracks(trackIds);
    
    // Filter only unsaved tracks
    const newTracks = trackIds.filter((trackId, index) => !checkResult.body[index]);
    
    return {
      newTracks,
      alreadyExisting: trackIds.length - newTracks.length,
      total: trackIds.length
    };
  } catch (error) {
    console.error('Error checking existing tracks:', error);
    // In case of error, we assume all tracks are new for safety.
    return {
      newTracks: trackIds,
      alreadyExisting: 0,
      total: trackIds.length
    };
  }
};

// 🔒 SECURITY: Function to verify artists already followed in a granular way
const checkExistingArtistsInBatch = async (artistIds, req) => {
  try {
    const { destApi } = getApiInstances(req);
    const checkResult = await destApi.isFollowingArtists(artistIds);
    
    // Filter only artists you haven't followed yet
    const newArtists = artistIds.filter((artistId, index) => !checkResult.body[index]);
    
    return {
      newArtists,
      alreadyFollowing: artistIds.length - newArtists.length,
      total: artistIds.length
    };
  } catch (error) {
    console.error('Error checking existing artists:', error);
    // In case of error, we assume all artists are new for safety.
    return {
      newArtists: artistIds,
      alreadyFollowing: 0,
      total: artistIds.length
    };
  }
};

// Function to check if a playlist already exists in the target account
const checkPlaylistExists = async (playlistName, req) => {
  try {
    const { destApi } = getApiInstances(req);
    
    // Get all playlists of target user
    let playlists = [];
    let offset = 0;
    const limit = 50;
    let total = 1;
    
    while (offset < total) {
      const response = await destApi.getUserPlaylists(req.session.destUser.id, { limit, offset });
      total = response.body.total;
      playlists = playlists.concat(response.body.items);
      offset += limit;
      
      if (playlists.length >= total || offset >= 200) {
        break;
      }
    }
    
    // Search for a playlist with the same name
    const existingPlaylist = playlists.find(playlist => 
      playlist.name.toLowerCase() === playlistName.toLowerCase());
    
    return existingPlaylist || null;
  } catch (error) {
    console.error(`Error checking if playlist exists: ${error.message}`);
    return null;
  }
};

// Function to check if an artist is already followed in the target account
const checkArtistFollowed = async (artistId, req) => {
  try {
    const { destApi } = getApiInstances(req);
    
      // Check if the artist is already followed
    const response = await destApi.isFollowingArtists([artistId]);
    return response.body[0];
  } catch (error) {
    console.error(`Error checking if artist is followed: ${error.message}`);
    return false;
  }
};

// Function to check if a song is already saved in the destination account
const checkTrackSaved = async (trackId, req) => {
  try {
    const { destApi } = getApiInstances(req);
    
    // Check if the song is already saved
    const response = await destApi.containsMySavedTracks([trackId]);
    return response.body[0];
  } catch (error) {
    console.error(`Error checking if track is saved: ${error.message}`);
    return false;
  }
};

// Get source account playlists
router.get('/playlists', [auth.refreshSourceToken, ensureAuthenticated], async (req, res) => {
  try {
    const { sourceApi } = getApiInstances(req);
    const data = await sourceApi.getUserPlaylists(req.session.sourceUser.id, { limit: 50 });
    res.json({ playlists: data.body.items });
  } catch (error) {
    console.error('Error fetching playlists:', error);
    res.status(500).json({ error: 'Failed to fetch playlists' });
  }
});

// Get source account saved tracks (liked songs)
router.get('/saved-tracks', [auth.refreshSourceToken, ensureAuthenticated], async (req, res) => {
  try {
    const { sourceApi } = getApiInstances(req);
    
    // Get all saved tracks from source account with pagination
    let tracks = [];
    let offset = 0;
    const limit = 50;
    let total = 1; // Initial value to enter the loop
    
    while (offset < total) {
      const tracksResponse = await sourceApi.getMySavedTracks({
        offset,
        limit
      });
      
      total = tracksResponse.body.total;
      tracks = tracks.concat(tracksResponse.body.items);
      offset += limit;
      
      // Break if we've fetched all tracks or reached a reasonable limit
      if (tracks.length >= total || offset >= 2000) {
        break;
      }
    }
    
    res.json({ tracks: tracks });
  } catch (error) {
    console.error('Error fetching saved tracks:', error);
    res.status(500).json({ error: 'Failed to fetch saved tracks' });
  }
});

// Get source account followed artists
router.get('/followed-artists', [auth.refreshSourceToken, ensureAuthenticated], async (req, res) => {
  try {
    const { sourceApi } = getApiInstances(req);
    
    // Get all followed artists from source account with pagination
    let artists = [];
    let after = null;
    const limit = 50;
    
    do {
      const artistsResponse = await sourceApi.getFollowedArtists({
        limit,
        after
      });
      
      const newArtists = artistsResponse.body.artists.items;
      artists = artists.concat(newArtists);
      
      // Update the after parameter for pagination
      after = newArtists.length > 0 ? newArtists[newArtists.length - 1].id : null;
      
      // Break if we got fewer artists than the limit (last page)
      if (newArtists.length < limit) {
        break;
      }
    } while (after);
    
    res.json({ artists: artists });
  } catch (error) {
    console.error('Error fetching followed artists:', error);
    res.status(500).json({ error: 'Failed to fetch followed artists' });
  }
});

// Function to transfer the image of a playlist
const transferPlaylistImage = async (sourcePlaylistId, destPlaylistId, req) => {
  try {
    const { sourceApi, destApi } = getApiInstances(req);
    
    // Get source playlist details
    const sourcePlaylist = await sourceApi.getPlaylist(sourcePlaylistId);
    
    // Check if playlist has an image
    if (!sourcePlaylist.body.images || sourcePlaylist.body.images.length === 0) {
      return false;
    }
    
    // Obtain playlist image URL
    const imageUrl = sourcePlaylist.body.images[0].url;
    
    // Create a temporary folder if it doesnt exist
    const tempDir = path.join(__dirname, '../temp');
    try {
      await mkdirAsync(tempDir, { recursive: true });
    } catch (err) {
      //Directory already exists, error creating it
      if (err.code !== 'EEXIST') {
        console.error('Error creating temp directory:', err);
        return false;
      }
    }
    
    // Download the image
    const imagePath = path.join(tempDir, `playlist_${sourcePlaylistId}.jpg`);
    const response = await axios({
      method: 'get',
      url: imageUrl,
      responseType: 'stream'
    });
    
    const writer = fs.createWriteStream(imagePath);
    response.data.pipe(writer);
    
    return new Promise((resolve, reject) => {
      writer.on('finish', async () => {
        try {
          // Read image as base64
          const imageBuffer = fs.readFileSync(imagePath);
          const base64Image = imageBuffer.toString('base64');
          
          // Upload the image to the destination playlist
          await destApi.uploadCustomPlaylistCoverImage(destPlaylistId, base64Image);
          
          // Clean up the temporary file
          await unlinkAsync(imagePath);
          
          resolve(true);
        } catch (uploadError) {
          console.error('Error uploading playlist image:', uploadError);
          // Clean temporary file even if error occurs
          try {
            await unlinkAsync(imagePath);
          } catch (cleanupError) {
            console.error('Error cleaning up temp file:', cleanupError);
          }
          resolve(false);
        }
      });
      
      writer.on('error', (error) => {
        console.error('Error downloading playlist image:', error);
        resolve(false);
      });
    });
  } catch (error) {
    console.error('Error transferring playlist image:', error);
    return false;
  }
};

// Function to get all tracks of a playlist
const getAllPlaylistTracks = async (playlistId, req) => {
  let tracks = [];
  let offset = 0;
  const limit = 100; // Maximum possible per call
  let total = 1;
  let skippedLocalTracks = [];
  
  try {
    const { sourceApi } = getApiInstances(req);
    
    while (offset < total) {
      // Use getPlaylistTracks with fields to limit the data returned and save bandwidth
      const tracksResponse = await sourceApi.getPlaylistTracks(playlistId, {
        offset,
        limit,
        fields: 'items(track(uri,id,name)),total'
      });
      
      total = tracksResponse.body.total;
      
      // Filter valid (not null) tracks and remove local tracks
      const validTracks = [];
      
      tracksResponse.body.items.forEach(item => {
        if (item.track && item.track.uri) {
          // Check if it's a local track (starts with "spotify:local:")
          if (item.track.uri.startsWith('spotify:local:')) {
            // Save information about skipped local track for log
            skippedLocalTracks.push({
              uri: item.track.uri,
              name: item.track.name || 'Traccia locale senza nome'
            });
          } else {
            validTracks.push(item.track);
          }
        }
      });
      
      tracks = tracks.concat(validTracks);
      offset += limit;
      
      // Longer pause between requests to avoid rate limiting
      if (offset < total) {
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }
    
    // Remove any duplicates (can happen in playlists)
    const uniqueTracks = [];
    const seenUris = new Set();
    
    for (const track of tracks) {
      if (!seenUris.has(track.uri)) {
        seenUris.add(track.uri);
        uniqueTracks.push(track);
      }
    }
    
    // Returns both valid tracks and information about skipped local tracks
    return {
      tracks: uniqueTracks,
      skippedLocalTracks: skippedLocalTracks
    };
  } catch (error) {
    console.error(`Error retrieving tracks for playlist ${playlistId}:`, error);
    throw error;
  }
};

// Function to add tracks to a playlist in batch
const addTracksToPlaylist = async (playlistId, tracks, playlistName, req) => {
  const batchSize = 50; // Ridotto per maggiore stabilità
  const trackUris = tracks.map(track => track.uri);
  let addedCount = 0;
  let skippedTracks = [];
  
  try {
    const { destApi } = getApiInstances(req);
    // Add tracks in batch
    for (let i = 0; i < trackUris.length; i += batchSize) {
      const batch = trackUris.slice(i, i + batchSize);
      let retryCount = 0;
      const maxRetries = 5; // Increased number of attempts
      let success = false;
      
      while (!success && retryCount < maxRetries) {
        try {
          await destApi.addTracksToPlaylist(playlistId, batch);
          success = true;
          addedCount += batch.length;
        } catch (error) {
          retryCount++;
          console.error(`Error adding batch ${i/batchSize + 1}/${Math.ceil(trackUris.length/batchSize)} to playlist ${playlistName} (attempt ${retryCount}/${maxRetries}):`, error.message);
          
          // Check if the error is related to an invalid base62 ID (local traces)
          if (error.message && error.message.includes('Invalid base62 id')) {
            console.log(`Il batch contiene probabilmente tracce locali non migrabili. Provo ad aggiungere i brani singolarmente.`);
            break; // Exit the while loop and try the single track approach
          }
          
          if (retryCount >= maxRetries) {
            // If all batch attempts fail, try adding songs one at a time.
            console.log(`Trying to add tracks one by one for batch ${i/batchSize + 1}`);
            break; // Exit the while loop and try the single track approach
          } else {
            // Exponential wait with jitter
            const baseWait = 2000; // 2 seconds of base
            const jitter = Math.random() * 1000; // Random jitter up to 1 second
            const waitTime = (baseWait * Math.pow(2, retryCount - 1)) + jitter;
            console.log(`Waiting ${Math.round(waitTime)}ms before retry...`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
          }
        }
      }
      
      // If we were unable to add the entire batch, try adding the songs one at a time
      if (!success) {
        for (const trackUri of batch) {
          try {
            // Check if it is a local track before trying to add it
            if (trackUri.startsWith('spotify:local:')) {
              console.log(`Salto traccia locale: ${trackUri}`);
              skippedTracks.push(trackUri);
              continue;
            }
            
            await destApi.addTracksToPlaylist(playlistId, [trackUri]);
            addedCount++;
            // Shorter pause between individual songs
            await new Promise(resolve => setTimeout(resolve, 200));
          } catch (singleError) {
            console.error(`Failed to add track ${trackUri} to playlist:`, singleError.message);
            if (singleError.message && singleError.message.includes('Invalid base62 id')) {
              skippedTracks.push(trackUri);
            }
          }
        }
      }
      
      // Shorter pause between batches to balance speed and rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    return {
      addedCount,
      skippedTracks
    };
  } catch (error) {
    console.error(`Error in addTracksToPlaylist for playlist ${playlistName}:`, error);
    throw error;
  }
};

// Function to process a single playlist
const processPlaylist = async (playlistId, index, total, res, migrationLog, errors, followNonUserPlaylists, transferImages, req) => {
  try {
    const { sourceApi, destApi } = getApiInstances(req);
    
    // Get source playlist details
    let sourcePlaylist;
    try {
      sourcePlaylist = await sourceApi.getPlaylist(playlistId);
    } catch (error) {
      console.error(`Error fetching playlist ${playlistId}:`, error.message);
      return {
        success: false,
        playlistId,
        error: `Failed to fetch playlist details: ${error.message}`
      };
    }
    
    const playlistData = sourcePlaylist.body;
    const playlistName = playlistData.name || `Playlist ${playlistId}`;
    
    // Check if the playlist was created by the user
    const isUserPlaylist = playlistData.owner.id === req.session.sourceUser.id;
    
    // Manage playlists not created by the user
    if (!isUserPlaylist) {
      if (followNonUserPlaylists) {
        migrationLog.push(`Seguendo playlist esistente: ${playlistName} (creata da ${playlistData.owner.display_name})`);
        
        try {
          await destApi.followPlaylist(playlistId, { public: playlistData.public });
          migrationLog.push(`Successfully followed playlist: ${playlistName}`);
          return {
            success: true,
            playlistId,
            message: `Followed playlist: ${playlistName}`
          };
        } catch (followError) {
          console.error(`Error following playlist ${playlistName}:`, followError.message);
          return {
            success: false,
            playlistId,
            error: `Failed to follow playlist: ${followError.message}`
          };
        }
      } else {
        migrationLog.push(`Skipped playlist '${playlistName}' (not created by user)`);
        return {
          success: true,
          playlistId,
          skipped: true,
          message: `Skipped playlist: ${playlistName}`
        };
      }
    }
    
    // Check if the playlist already exists in the target account
    const existingPlaylist = await checkPlaylistExists(playlistName, req);
    if (existingPlaylist) {
      migrationLog.push(`Playlist '${playlistName}' già esistente nell'account di destinazione. Migrazione saltata.`);
      return {
        success: true,
        playlistId,
        existingPlaylistId: existingPlaylist.id,
        skipped: true,
        message: `Skipped duplicate playlist: ${playlistName}`
      };
    }
    
    // If the playlist was created by the user and does not already exist, we recreate it
    migrationLog.push(`Creazione nuova playlist: ${playlistName}`);
    
    // Check if the playlist is private
    const wasPrivate = !playlistData.public;
    
    // Step 1: Make the playlist public if it was private
    if (wasPrivate) {
      try {
        await sourceApi.changePlaylistDetails(playlistId, { public: true });
        migrationLog.push(`Made playlist '${playlistName}' public temporarily.`);
      } catch (error) {
        console.error(`Error making playlist ${playlistName} public:`, error.message);
      }
    }
    
    // Step 2: Clone the playlist in the destination account
    let newPlaylist;
    try {
      newPlaylist = await destApi.createPlaylist(req.session.destUser.id, {
        name: playlistData.name,
        public: playlistData.public,
        collaborative: playlistData.collaborative,
        description: playlistData.description || ''
      });
    } catch (createError) {
      console.error(`Error creating new playlist for ${playlistName}:`, createError.message);
      
      if (wasPrivate) {
        try {
          await sourceApi.changePlaylistDetails(playlistId, { public: false });
          migrationLog.push(`Reverted playlist '${playlistName}' to private.`);
        } catch (error) {
          console.error(`Error reverting playlist ${playlistName} to private:`, error.message);
        }
      }
      
      return {
        success: false,
        playlistId,
        error: `Failed to create new playlist: ${createError.message}`
      };
    }
    
    // Step 3: Get all tracks from source playlist
    let tracks = [];
    let skippedLocalTracks = [];
    try {
      const result = await getAllPlaylistTracks(playlistId, req);
      tracks = result.tracks;
      skippedLocalTracks = result.skippedLocalTracks;
      
      migrationLog.push(`Fetched ${tracks.length} tracks from playlist '${playlistName}'.`);
      
      if (skippedLocalTracks.length > 0) {
        migrationLog.push(`Saltate ${skippedLocalTracks.length} tracce locali non migrabili dalla playlist '${playlistName}'.`);
        // Record details of skipped local tracks for reference
        for (const localTrack of skippedLocalTracks) {
          migrationLog.push(`  - Traccia locale saltata: ${localTrack.name}`);
        }
      }
    } catch (tracksError) {
      console.error(`Error fetching tracks for playlist ${playlistName}:`, tracksError.message);
      tracks = [];
      migrationLog.push(`Warning: Failed to fetch tracks for playlist '${playlistName}': ${tracksError.message}`);
    }
    
    // Step 4: Add tracks to the new playlist
    let addedTracksCount = 0;
    let skippedTracks = [];
    if (tracks.length > 0) {
      try {
        const result = await addTracksToPlaylist(newPlaylist.body.id, tracks, playlistName, req);
        addedTracksCount = result.addedCount;
        skippedTracks = result.skippedTracks;
        
        migrationLog.push(`Added ${addedTracksCount} of ${tracks.length} tracks to playlist '${playlistName}'.`);
        
        if (skippedTracks.length > 0) {
          migrationLog.push(`Non è stato possibile aggiungere ${skippedTracks.length} tracce alla playlist '${playlistName}' (probabilmente tracce locali).`);
        }
      } catch (addTracksError) {
        console.error(`Error adding tracks to playlist ${playlistName}:`, addTracksError.message);
        migrationLog.push(`Warning: Failed to add all tracks to playlist '${playlistName}': ${addTracksError.message}`);
      }
    }
    
    // Step 5: Transfer playlist image if requested
    let imageTransferred = false;
    if (transferImages && isUserPlaylist) {
      migrationLog.push(`Tentativo di trasferimento dell'immagine per la playlist '${playlistName}'...`);
      try {
        imageTransferred = await transferPlaylistImage(playlistId, newPlaylist.body.id, req);
        if (imageTransferred) {
          migrationLog.push(`Immagine trasferita con successo per la playlist '${playlistName}'`);
        }
      } catch (imageError) {
        console.error(`Error transferring image for playlist ${playlistName}:`, imageError.message);
        errors.push(`Failed to transfer image for playlist '${playlistName}': ${imageError.message}`);
      }
    }
    
    // Step 6: Revert the playlist to private if it was private originally
    if (wasPrivate) {
      try {
        await sourceApi.changePlaylistDetails(playlistId, { public: false });
        migrationLog.push(`Reverted playlist '${playlistName}' to private.`);
      } catch (revertError) {
        console.error(`Error reverting playlist ${playlistName} to private:`, revertError.message);
        errors.push(`Failed to revert playlist '${playlistName}' to private: ${revertError.message}`);
      }
    }
    
    // Check if the migration is partially completed
    const totalTracksToMigrate = tracks.length;
    const partialSuccess = addedTracksCount > 0 && addedTracksCount < totalTracksToMigrate;
    
    if (partialSuccess) {
      migrationLog.push(`Partially cloned playlist '${playlistName}' with ${addedTracksCount}/${totalTracksToMigrate} tracks.`);
    } else if (addedTracksCount === totalTracksToMigrate) {
      migrationLog.push(`Cloned playlist '${playlistName}' successfully with ${totalTracksToMigrate} tracks.`);
    } else {
      migrationLog.push(`Created empty playlist '${playlistName}' but failed to add any tracks.`);
    }
    
    const totalLocalTracks = skippedLocalTracks.length + (skippedTracks ? skippedTracks.length : 0);
    
    return {
      success: true,
      playlistId,
      newPlaylistId: newPlaylist.body.id,
      trackCount: totalTracksToMigrate,
      addedTracks: addedTracksCount,
      localTracksSkipped: totalLocalTracks,
      imageTransferred,
      partialSuccess,
      message: partialSuccess ? 
        `Partially cloned playlist: ${playlistName} (${addedTracksCount}/${totalTracksToMigrate} tracks)` : 
        `Successfully cloned playlist: ${playlistName}`
    };
  } catch (error) {
    console.error(`Error processing playlist ${playlistId}:`, error);
    errors.push(`Failed to migrate playlist ID ${playlistId}: ${error.message}`);
    return {
      success: false,
      playlistId,
      error: error.message
    };
  }
};

// Migrate saved tracks
router.post('/migrate/saved-tracks', [auth.refreshSourceToken, auth.refreshDestToken, ensureAuthenticated], async (req, res) => {
  const { savedTrackIds } = req.body;
  const migrationLog = [];
  const errors = [];
  
  try {
    if (!savedTrackIds || !Array.isArray(savedTrackIds) || savedTrackIds.length === 0) {
      return res.json({
        success: false,
        error: 'Nessun brano selezionato da migrare',
        migrationLog: ['Nessun brano selezionato da migrare'],
        errors: ['Nessun brano selezionato da migrare']
      });
    }
    
    // Make sure your tokens are set up correctly
    console.log('Migrazione brani preferiti: impostazione token');
    // Use tokens from session tokens instead of sourceUser/destUser
    if (req.session.sourceTokens && req.session.sourceTokens.accessToken) {
      auth.createSourceApi(req).setAccessToken(req.session.sourceTokens.accessToken);
    } else {
      auth.createSourceApi(req).setAccessToken(req.session.sourceUser.accessToken);
    }
    
    if (req.session.destTokens && req.session.destTokens.accessToken) {
      auth.createDestApi(req).setAccessToken(req.session.destTokens.accessToken);
    } else {
      auth.createDestApi(req).setAccessToken(req.session.destUser.accessToken);
    }
    
    migrationLog.push(`Inizio migrazione di ${savedTrackIds.length} brani preferiti...`);
    
    // Check which songs are already saved in the destination account
    const batchCheckSize = 50;
    let alreadySavedTracks = [];
    
    for (let i = 0; i < savedTrackIds.length; i += batchCheckSize) {
      const batchToCheck = savedTrackIds.slice(i, i + batchCheckSize);
      try {
        const checkResult = await auth.createDestApi(req).containsMySavedTracks(batchToCheck);
        
        // Add the IDs of already saved songs to the array
        batchToCheck.forEach((trackId, index) => {
          if (checkResult.body[index]) {
            alreadySavedTracks.push(trackId);
          }
        });
      } catch (error) {
        console.error(`Error checking saved tracks:`, error);
        // If an error occurs, continue with normal migration.
      }
      
      // Short break to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    if (alreadySavedTracks.length > 0) {
      migrationLog.push(`Trovati ${alreadySavedTracks.length} brani già salvati nell'account di destinazione. Questi brani verranno saltati.`);
    }
    
    // Filter the songs to migrate, excluding those already saved
    const tracksToMigrate = savedTrackIds.filter(trackId => !alreadySavedTracks.includes(trackId));
    
    if (tracksToMigrate.length === 0) {
      migrationLog.push(`Tutti i brani selezionati sono già presenti nell'account di destinazione. Nessun brano da migrare.`);
      return res.json({
        success: true,
        migrationLog,
        errors
      });
    }
    
    migrationLog.push(`Migrazione di ${tracksToMigrate.length} brani non ancora salvati...`);
    
    // Add songs in batch
    const batchSize = 50;
    let migratedCount = 0;
    
    for (let i = 0; i < tracksToMigrate.length; i += batchSize) {
      const batch = tracksToMigrate.slice(i, i + batchSize);
      
      try {
        console.log(`Aggiunta batch ${i/batchSize + 1} di brani preferiti (${batch.length} brani)`);
        await auth.createDestApi(req).addToMySavedTracks(batch);
        migratedCount += batch.length;
        migrationLog.push(`Aggiunti ${batch.length} brani ai preferiti (${migratedCount}/${tracksToMigrate.length})`);
      } catch (error) {
        console.error(`Error adding batch of tracks to saved tracks:`, error);
        
        // Detailed error handling
        if (error.statusCode === 401) {
          console.log('Errore di autenticazione 401, aggiornamento token');
          await new Promise((resolve) => {
            auth.refreshDestToken(req, res, () => {
              auth.createDestApi(req).setAccessToken(req.session.destUser.accessToken);
              resolve();
            });
          });
          
          // Try again with the updated token
          try {
            await auth.createDestApi(req).addToMySavedTracks(batch);
            migratedCount += batch.length;
            migrationLog.push(`Aggiunti ${batch.length} brani ai preferiti dopo aggiornamento token (${migratedCount}/${tracksToMigrate.length})`);
          } catch (retryError) {
            errors.push(`Errore nell'aggiunta di brani ai preferiti anche dopo aggiornamento token: ${retryError.message}`);
          }
        } else if (error.statusCode === 429) {
          // Rate limiting - wait longer
          const retryAfter = error.headers['retry-after'] ? parseInt(error.headers['retry-after']) * 1000 : 5000;
          migrationLog.push(`Rate limit raggiunto, attendo ${retryAfter/1000} secondi prima di riprovare...`);
          await new Promise(resolve => setTimeout(resolve, retryAfter));
          // Decrement i to retry the same batch
          i -= batchSize;
          continue;
        } else {
          errors.push(`Errore nell'aggiunta di alcuni brani ai preferiti: ${error.message}`);
        }
      }
      
      // Decrement i to retry the same batch
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    migrationLog.push(`Migrazione brani preferiti completata: ${migratedCount}/${savedTrackIds.length} brani migrati`);
    
    res.json({
      success: migratedCount > 0,
      migrationLog,
      errors
    });
  } catch (error) {
    console.error('Error during saved tracks migration:', error);
    res.json({
      success: false,
      error: 'Failed to complete saved tracks migration',
      migrationLog,
      errors: [...errors, error.message]
    });
  }
});

// Migrate followed artists
router.post('/migrate/followed-artists', [auth.refreshSourceToken, auth.refreshDestToken, ensureAuthenticated], async (req, res) => {
  const { followedArtistIds } = req.body;
  const migrationLog = [];
  const errors = [];
  
  try {
    if (!followedArtistIds || !Array.isArray(followedArtistIds) || followedArtistIds.length === 0) {
      return res.json({
        success: false,
        error: 'Nessun artista selezionato da migrare',
        migrationLog: ['Nessun artista selezionato da migrare'],
        errors: ['Nessun artista selezionato da migrare']
      });
    }
    
    // Make sure your tokens are set up correctly
    console.log('Migrazione artisti seguiti: impostazione token');
    // Use tokens from session tokens instead of sourceUser/destUser
    if (req.session.sourceTokens && req.session.sourceTokens.accessToken) {
      auth.createSourceApi(req).setAccessToken(req.session.sourceTokens.accessToken);
    } else {
      auth.createSourceApi(req).setAccessToken(req.session.sourceUser.accessToken);
    }
    
    if (req.session.destTokens && req.session.destTokens.accessToken) {
      auth.createDestApi(req).setAccessToken(req.session.destTokens.accessToken);
    } else {
      auth.createDestApi(req).setAccessToken(req.session.destUser.accessToken);
    }
    
    migrationLog.push(`Inizio migrazione di ${followedArtistIds.length} artisti...`);
    
    // Check which artists are already followed on the target account
    const batchCheckSize = 50;
    let alreadyFollowedArtists = [];
    
    for (let i = 0; i < followedArtistIds.length; i += batchCheckSize) {
      const batchToCheck = followedArtistIds.slice(i, i + batchCheckSize);
      try {
        const checkResult = await auth.createDestApi(req).isFollowingArtists(batchToCheck);
        
        // Add the IDs of the artists you already followed to the array
        batchToCheck.forEach((artistId, index) => {
          if (checkResult.body[index]) {
            alreadyFollowedArtists.push(artistId);
          }
        });
      } catch (error) {
        console.error(`Error checking followed artists:`, error);
        // If an error occurs, continue with normal migration.
      }
      
      // Short break to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    if (alreadyFollowedArtists.length > 0) {
      migrationLog.push(`Trovati ${alreadyFollowedArtists.length} artisti già seguiti nell'account di destinazione. Questi artisti verranno saltati.`);
    }
    
    // Filter the artists to follow, excluding those already followed
    const artistsToFollow = followedArtistIds.filter(artistId => !alreadyFollowedArtists.includes(artistId));
    
    if (artistsToFollow.length === 0) {
      migrationLog.push(`Tutti gli artisti selezionati sono già seguiti nell'account di destinazione. Nessun artista da seguire.`);
      return res.json({
        success: true,
        migrationLog,
        errors
      });
    }
    
    migrationLog.push(`Seguendo ${artistsToFollow.length} artisti non ancora seguiti...`);
    
    // Follow artists in batch
    const batchSize = 50;
    let migratedCount = 0;
    
    for (let i = 0; i < artistsToFollow.length; i += batchSize) {
      const batch = artistsToFollow.slice(i, i + batchSize);
      
      try {
        console.log(`Seguendo batch ${i/batchSize + 1} di artisti (${batch.length} artisti)`);
        await auth.createDestApi(req).followArtists(batch);
        migratedCount += batch.length;
        migrationLog.push(`Seguiti ${batch.length} artisti (${migratedCount}/${artistsToFollow.length})`);
      } catch (error) {
        console.error(`Error following batch of artists:`, error);
        
        // Gestione dettagliata degli errori
        if (error.statusCode === 401) {
          console.log('Errore di autenticazione 401, aggiornamento token');
          await new Promise((resolve) => {
            auth.refreshDestToken(req, res, () => {
              auth.createDestApi(req).setAccessToken(req.session.destUser.accessToken);
              resolve();
            });
          });
          
          // Try again with the updated token
          try {
            await auth.createDestApi(req).followArtists(batch);
            migratedCount += batch.length;
            migrationLog.push(`Seguiti ${batch.length} artisti dopo aggiornamento token (${migratedCount}/${artistsToFollow.length})`);
          } catch (retryError) {
            errors.push(`Errore nel seguire artisti anche dopo aggiornamento token: ${retryError.message}`);
          }
        } else if (error.statusCode === 429) {
          // Rate limiting - wait longer
          const retryAfter = error.headers['retry-after'] ? parseInt(error.headers['retry-after']) * 1000 : 5000;
          migrationLog.push(`Rate limit raggiunto, attendo ${retryAfter/1000} secondi prima di riprovare...`);
          await new Promise(resolve => setTimeout(resolve, retryAfter));
          // Decrement i to retry the same batch
          i -= batchSize;
          continue;
        } else {
          errors.push(`Errore nel seguire alcuni artisti: ${error.message}`);
        }
      }
      
      // Pause to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    migrationLog.push(`Migrazione artisti completata: ${migratedCount}/${followedArtistIds.length} artisti seguiti`);
    
    res.json({
      success: migratedCount > 0,
      migrationLog,
      errors
    });
  } catch (error) {
    console.error('Error during artist following migration:', error);
    res.json({
      success: false,
      error: 'Failed to complete artist following migration',
      migrationLog,
      errors: [...errors, error.message]
    });
  }
});

// Main migration function
router.post('/migrate', [auth.refreshSourceToken, auth.refreshDestToken, ensureAuthenticated], async (req, res) => {
  try {
    const { 
      playlists, 
      savedTracks, 
      savedTrackIds,
      followedArtists,
      followedArtistIds,
      followNonUserPlaylists,
      transferImages 
    } = req.body;
    
    console.log('Dati ricevuti per la migrazione:', {
      playlists: playlists?.length || 0,
      savedTracks: savedTracks,
      savedTrackIds: savedTrackIds?.length || 0,
      followedArtists: followedArtists,
      followedArtistIds: followedArtistIds?.length || 0,
      followNonUserPlaylists,
      transferImages
    });
    
    if (!req.session.sourceUser || !req.session.destUser) {
      return res.status(401).json({ error: 'Sessione non valida' });
    }
    
    // Initialize Spotify APIs
    auth.createSourceApi(req).setAccessToken(req.session.sourceUser.accessToken);
    auth.createDestApi(req).setAccessToken(req.session.destUser.accessToken);
    
    const migrationLog = [];
    const errors = [];
    
    try {
      // Migrate the playlist
      if (playlists && playlists.length > 0) {
        migrationLog.push(`Inizio migrazione di ${playlists.length} playlist...`);
        
        // Split playlists into batches to manage them in parallel
        const MAX_CONCURRENT = 3;
        const batches = [];
        for (let i = 0; i < playlists.length; i += MAX_CONCURRENT) {
          batches.push(playlists.slice(i, i + MAX_CONCURRENT));
        }
        
        for (const batch of batches) {
          // Make sure your tokens are always up to date
          auth.createSourceApi(req).setAccessToken(req.session.sourceUser.accessToken);
          auth.createDestApi(req).setAccessToken(req.session.destUser.accessToken);
          
          const results = await Promise.all(
            batch.map((playlistId, index) => 
              processPlaylist(
                playlistId, 
                index, 
                playlists.length, 
                res, 
                migrationLog, 
                errors, 
                followNonUserPlaylists, 
                transferImages,
                req
              )
            )
          );
          
          // Pause between batches to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        migrationLog.push('Migrazione playlist completata');
      }
    } catch (playlistError) {
      console.error('Errore durante la migrazione delle playlist:', playlistError);
      errors.push(`Errore durante la migrazione delle playlist: ${playlistError.message}`);
    }
    
    try {
      // Migrate your favorite songs
      if (savedTracks === true && savedTrackIds && savedTrackIds.length > 0) {
        // Make the call to saved-tracks as a separate request
        try {
          // Refresh tokens before calling
          await new Promise((resolve) => auth.refreshSourceToken(req, res, resolve));
          await new Promise((resolve) => auth.refreshDestToken(req, res, resolve));
          
          // Make sure tokens are updated in session
          req.session.sourceUser = {
            ...req.session.sourceUser,
            accessToken: req.session.sourceTokens.accessToken
          };
          
          req.session.destUser = {
            ...req.session.destUser,
            accessToken: req.session.destTokens.accessToken
          };
          
          // Set up updated tokens in APIs
          auth.createSourceApi(req).setAccessToken(req.session.sourceTokens.accessToken);
          auth.createDestApi(req).setAccessToken(req.session.destTokens.accessToken);
          
          const savedTracksResult = await axios.post('http://localhost:' + (process.env.PORT || 5000) + '/api/migration/migrate/saved-tracks', 
            { savedTrackIds },
            { 
              headers: { 
                Cookie: req.headers.cookie 
              }
            }
          );
          
          if (savedTracksResult.data.migrationLog) {
            migrationLog.push(...savedTracksResult.data.migrationLog);
          }
          
          if (savedTracksResult.data.errors) {
            errors.push(...savedTracksResult.data.errors);
          }
        } catch (axiosError) {
          console.error('Errore durante la chiamata alla route dei brani preferiti:', axiosError);
          errors.push(`Errore durante la chiamata alla route dei brani preferiti: ${axiosError.message}`);
        }
      } else if (savedTracks) {
        console.log('Brani preferiti impostati su true ma nessun ID fornito');
        migrationLog.push('Non sono stati forniti brani preferiti da migrare');
      }
    } catch (savedTracksError) {
      console.error('Errore durante la migrazione dei brani preferiti:', savedTracksError);
      errors.push(`Errore durante la migrazione dei brani preferiti: ${savedTracksError.message}`);
    }
    
    try {
      // Migrate the artists followed
      if (followedArtists === true && followedArtistIds && followedArtistIds.length > 0) {
        // Effettua la chiamata a followed-artists come richiesta separata
        try {
          // Refresh tokens before calling
          await new Promise((resolve) => auth.refreshSourceToken(req, res, resolve));
          await new Promise((resolve) => auth.refreshDestToken(req, res, resolve));
          
          // Make sure tokens are updated in session
          req.session.sourceUser = {
            ...req.session.sourceUser,
            accessToken: req.session.sourceTokens.accessToken
          };
          
          req.session.destUser = {
            ...req.session.destUser,
            accessToken: req.session.destTokens.accessToken
          };
          
          // Set up updated tokens in APIs
          auth.createSourceApi(req).setAccessToken(req.session.sourceTokens.accessToken);
          auth.createDestApi(req).setAccessToken(req.session.destTokens.accessToken);
          
          const followedArtistsResult = await axios.post('http://localhost:' + (process.env.PORT || 5000) + '/api/migration/migrate/followed-artists', 
            { followedArtistIds },
            { 
              headers: { 
                Cookie: req.headers.cookie 
              }
            }
          );
          
          if (followedArtistsResult.data.migrationLog) {
            migrationLog.push(...followedArtistsResult.data.migrationLog);
          }
          
          if (followedArtistsResult.data.errors) {
            errors.push(...followedArtistsResult.data.errors);
          }
        } catch (axiosError) {
          console.error('Errore durante la chiamata alla route degli artisti seguiti:', axiosError);
          errors.push(`Errore durante la chiamata alla route degli artisti seguiti: ${axiosError.message}`);
        }
      } else if (followedArtists) {
        console.log('Artisti seguiti impostati su true ma nessun ID fornito');
        migrationLog.push('Non sono stati forniti artisti da seguire');
      }
    } catch (followedArtistsError) {
      console.error('Errore durante la migrazione degli artisti seguiti:', followedArtistsError);
      errors.push(`Errore durante la migrazione degli artisti seguiti: ${followedArtistsError.message}`);
    }
    
    // Submit the final result
    res.json({
      success: errors.length === 0,
      log: migrationLog,
      errors: errors
    });
    
  } catch (error) {
    console.error('Error in migration route:', error);
    res.status(500).json({ 
      error: 'Errore durante la migrazione',
      details: error.message 
    });
  }
});

// Migration status endpoint
router.get('/migration/status', ensureAuthenticated, (req, res) => {
  // This would typically connect to a database or in-memory store
  // to retrieve the status of ongoing migrations
  res.json({
    status: 'No active migrations',
    completedTasks: [],
    pendingTasks: [],
    errors: []
  });
});

module.exports = router;
