import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper, Grid, Button, Checkbox, List, ListItem, ListItemText, ListItemIcon, Divider, CircularProgress, FormControlLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import LogViewer from '../components/LogViewer';

const Preview = ({ authStatus }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    playlists: [],
    savedTracks: [],
    followedArtists: [],
    followedUsers: []
  });
  
  // Let's add states for pagination
  const [pagination, setPagination] = useState({
    savedTracks: { page: 1, perPage: 50, total: 0 },
    followedArtists: { page: 1, perPage: 50, total: 0 }
  });
  
  const initialSelectionState = {
    playlists: [],
    savedTracks: false,
    savedTrackIds: [],
    followedArtists: false,
    followedArtistIds: [],
    followedUsers: false,
    playlistTracks: {},
    expandedTracks: false,
    expandedArtists: false
  };
  
  const [selected, setSelected] = useState(initialSelectionState);
  
  // Status to track expanded playlists
  const [expandedPlaylists, setExpandedPlaylists] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch playlists
        const playlistsRes = await axios.get('/api/migration/playlists');
        
        // Fetch saved tracks with pagination
        const savedTracksRes = await axios.get('/api/migration/saved-tracks', {
          params: {
            page: pagination.savedTracks.page,
            perPage: pagination.savedTracks.perPage
          }
        });
        
        // Fetch followed artists with pagination
        const followedArtistsRes = await axios.get('/api/migration/followed-artists', {
          params: {
            page: pagination.followedArtists.page,
            perPage: pagination.followedArtists.perPage
          }
        });
        
        setData(prev => ({
          playlists: playlistsRes.data.playlists || [],
          savedTracks: [...prev.savedTracks, ...(savedTracksRes.data.tracks || [])],
          followedArtists: [...prev.followedArtists, ...(followedArtistsRes.data.artists || [])],
          followedUsers: []
        }));

        // Update totals for pagination
        setPagination(prev => ({
          savedTracks: { ...prev.savedTracks, total: savedTracksRes.data.total || 0 },
          followedArtists: { ...prev.followedArtists, total: followedArtistsRes.data.total || 0 }
        }));
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load data from your Spotify account');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [pagination.savedTracks.page, pagination.followedArtists.page]);

  // We remove log management as it is no longer needed
  const addLog = (message, type = 'info') => {
    // Function kept for compatibility but does nothing
    console.log(`[${type}] ${message}`);
  };

  const handlePlaylistToggle = (playlistId) => {
    const playlist = data.playlists.find(p => p.id === playlistId);
    setSelected(prev => {
      const newPlaylists = [...prev.playlists];
      
      if (newPlaylists.includes(playlistId)) {
        addLog(`Deselected playlist: ${playlist?.name || playlistId}`);
        return {
          ...prev,
          playlists: newPlaylists.filter(id => id !== playlistId)
        };
      } else {
        addLog(`Selected playlist: ${playlist?.name || playlistId}`);
        return {
          ...prev,
          playlists: [...newPlaylists, playlistId]
        };
      }
    });
  };
  
  // Function to manage the expansion of a playlist
  const handleExpandPlaylist = async (playlistId) => {
    // Reverse expansion state
    setExpandedPlaylists(prev => ({
      ...prev,
      [playlistId]: !prev[playlistId]
    }));
    
    // If we are expanding and we haven't uploaded the tracks yet
    if (!expandedPlaylists[playlistId]) {
      try {
        // Load playlist tracks
        const response = await axios.get(`/api/migration/playlist-tracks/${playlistId}`);
        const tracks = response.data.tracks || [];
        
        // Update playlist data with tracks
        setData(prev => ({
          ...prev,
          playlists: prev.playlists.map(p => 
            p.id === playlistId ? { ...p, loadedTracks: tracks } : p
          )
        }));
      } catch (error) {
        console.error(`Error loading tracks for playlist ${playlistId}:`, error);
        toast.error('Failed to load playlist tracks');
      }
    }
  };
  
  // Function to manage the selection/deselection of a track
  const handleTrackToggle = (playlistId, trackId) => {
    setSelected(prev => {
      // Get the current list of unselected tracks for this playlist
      const playlistDeselectedTracks = prev.playlistTracks[playlistId] || [];
      
      // Check if the track is already deselected
      if (playlistDeselectedTracks.includes(trackId)) {
        // Remove the track from the unselected list
        const updatedTracks = playlistDeselectedTracks.filter(id => id !== trackId);
        addLog(`Reselected track in playlist`);
        return {
          ...prev,
          playlistTracks: {
            ...prev.playlistTracks,
            [playlistId]: updatedTracks
          }
        };
      } else {
        // Add the track to the unselected list
        addLog(`Deselected track in playlist`);
        return {
          ...prev,
          playlistTracks: {
            ...prev.playlistTracks,
            [playlistId]: [...playlistDeselectedTracks, trackId]
          }
        };
      }
    });
  };

  // Function to manage the selection/deselection of a favorite song
  const handleSavedTrackToggle = (trackId) => {
    setSelected(prev => {
      // Check if the song is already selected
      if (prev.savedTrackIds.includes(trackId)) {
        // Remove song from selected list
        addLog(`Deselected saved track`);
        return {
          ...prev,
          savedTrackIds: prev.savedTrackIds.filter(id => id !== trackId)
        };
      } else {
        // Add song to selected list
        addLog(`Selected saved track`);
        return {
          ...prev,
          savedTrackIds: [...prev.savedTrackIds, trackId]
        };
      }
    });
  };

  // Function to manage the selection/deselection of a followed artist
  const handleFollowedArtistToggle = (artistId) => {
    setSelected(prev => {
      // Check if the artist is already selected
      if (prev.followedArtistIds.includes(artistId)) {
        // Remove the artist from the selected list
        addLog(`Deselected followed artist`);
        return {
          ...prev,
          followedArtistIds: prev.followedArtistIds.filter(id => id !== artistId)
        };
      } else {
        // Add the artist to the selected list
        addLog(`Selected followed artist`);
        return {
          ...prev,
          followedArtistIds: [...prev.followedArtistIds, artistId]
        };
      }
    });
  };

  const handleToggleAll = (type) => {
    if (type === 'playlists') {
      setSelected(prev => {
        if (prev.playlists.length === data.playlists.length) {
          addLog('Deselected all playlists');
          return { ...prev, playlists: [] };
        } else {
          addLog(`Selected all playlists (${data.playlists.length} playlists)`);
          return { ...prev, playlists: data.playlists.map(playlist => playlist.id) };
        }
      });
    } else {
      setSelected(prev => {
        const newValue = !prev[type];
        const typeLabel = 
          type === 'savedTracks' ? 'Liked Songs' :
          type === 'followedArtists' ? 'Followed Artists' :
          'Followed Users';
        addLog(`${newValue ? 'Selected' : 'Deselected'} ${typeLabel}`);
        
        // If we are selecting all favorite songs or followed artists,
        // we also update the selected ID arrays
        if (type === 'savedTracks') {
          return {
            ...prev,
            [type]: newValue,
            savedTrackIds: newValue ? data.savedTracks.map(item => item.track.id) : []
          };
        } else if (type === 'followedArtists') {
          return {
            ...prev,
            [type]: newValue,
            followedArtistIds: newValue ? data.followedArtists.map(artist => artist.id) : []
          };
        } else {
          return {
            ...prev,
            [type]: newValue
          };
        }
      });
    }
  };

  const handleProceed = () => {
    try {
      console.log("Selection status before saving:", {
        playlists: selected.playlists.length,
        savedTracks: selected.savedTracks,
        savedTrackIds: selected.savedTrackIds.length,
        followedArtists: selected.followedArtists,
        followedArtistIds: selected.followedArtistIds.length
      });

      // Save selections to localStorage
      localStorage.setItem('selectedPlaylists', JSON.stringify(selected.playlists));
      
      // Save favorite songs
      // Whether the entire card is selected or whether individual songs are selected
      const migrateSelectedTracks = selected.savedTracks || selected.savedTrackIds.length > 0;
      localStorage.setItem('selectedSavedTracks', JSON.stringify(migrateSelectedTracks));
      
      if (migrateSelectedTracks) {
        // If the entire card is selected, save all songs
        if (selected.savedTracks && data.savedTracks && data.savedTracks.length > 0) {
          const trackIds = data.savedTracks.map(item => item.track.id);
          localStorage.setItem('selectedSavedTrackIds', JSON.stringify(trackIds));
          console.log(`Selected ${trackIds.length} Favorite songs (full selection) for migration`);
        } 
        // Otherwise save only the individually selected ones
        else if (selected.savedTrackIds.length > 0) {
          localStorage.setItem('selectedSavedTrackIds', JSON.stringify(selected.savedTrackIds));
          console.log(`Selected ${selected.savedTrackIds.length} Favorite songs (individual selection) for migration`);
        } else {
          localStorage.setItem('selectedSavedTrackIds', JSON.stringify([]));
          console.log("No favorite songs to migrate");
        }
      } else {
        localStorage.setItem('selectedSavedTrackIds', JSON.stringify([]));
      }
      
      // Save followed artists
      // If the entire card is selected or if there are individual artists selected
      const migrateSelectedArtists = selected.followedArtists || selected.followedArtistIds.length > 0;
      localStorage.setItem('selectedFollowedArtists', JSON.stringify(migrateSelectedArtists));
      
      if (migrateSelectedArtists) {
        // If the entire card is selected, save all artists
        if (selected.followedArtists && data.followedArtists && data.followedArtists.length > 0) {
          const artistIds = data.followedArtists.map(artist => artist.id);
          localStorage.setItem('selectedFollowedArtistIds', JSON.stringify(artistIds));
          console.log(`Selected ${artistIds.length} artists followed (full selection) for migration`);
        } 
        // Altrimenti salva solo quelli selezionati individualmente
        else if (selected.followedArtistIds.length > 0) {
          localStorage.setItem('selectedFollowedArtistIds', JSON.stringify(selected.followedArtistIds));
          console.log(`Selected ${selected.followedArtistIds.length} artists followed (individual selection) for migration`);
        } else {
          localStorage.setItem('selectedFollowedArtistIds', JSON.stringify([]));
          console.log("No artists followed to migrate");
        }
      } else {
        localStorage.setItem('selectedFollowedArtistIds', JSON.stringify([]));
      }
      
      navigate('/migration');
    } catch (error) {
      console.error('Error saving selection:', error);
      toast.error('Error saving selections');
    }
  };

  // Function to load more data
  const loadMore = (type) => {
    setPagination(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        page: prev[type].page + 1
      }
    }));
  };

  // Function to check if there is more data to load
  const hasMore = (type) => {
    return data[type].length < pagination[type].total;
  };

  if (loading) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading your Spotify data...
        </Typography>
      </Container>
    );
  }

  // Style for selected cards
  const getCardStyle = (isSelected) => ({
    border: isSelected ? '2px solid #1DB954' : '2px solid transparent',
    borderRadius: '16px',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
    }
  });

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Log section removed as requested */}
      <Typography variant="h4" component="h1" gutterBottom>
        Preview and select items to migrate
      </Typography>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body1">
            Select the items you want to migrate from {authStatus.sourceUser?.display_name} to {authStatus.destUser?.display_name}.
          </Typography>
          
          <Button 
            variant="text" 
            color="primary"
            onClick={() => {
              // Check if all items are already selected
              const allSelected = 
                selected.playlists.length === data.playlists.length && 
                selected.savedTracks && 
                selected.followedArtists;
              
              if (allSelected) {
                // Deselect all
                setSelected(prev => ({
                  ...prev,
                  playlists: [],
                  savedTracks: false,
                  savedTrackIds: [], // Make sure the song ID array is empty
                  followedArtists: false,
                  followedArtistIds: [], // Make sure the artist ID array is empty
                  followedUsers: false
                }));
                addLog('Deselect all items');
              } else {
                // Select all
                setSelected(prev => ({
                  ...prev,
                  playlists: data.playlists.map(p => p.id),
                  savedTracks: true,
                  savedTrackIds: data.savedTracks.map(item => item.track.id), // Select all songs individually
                  followedArtists: true,
                  followedArtistIds: data.followedArtists.map(artist => artist.id) // Select all artists individually
                }));
                addLog('Select all available items');
              }
            }}
          >
            {selected.playlists.length === data.playlists.length && 
             selected.savedTracks && 
             selected.followedArtists
              ? 'Deselect All' 
              : 'Select All'}
          </Button>
        </Box>
        
        <Box> {/* Empty box to keep space between elements */}
        </Box>
      </Box>
      
      <Grid container spacing={3}>
        {/* Playlists */}
        <Grid item xs={12} md={6} lg={4}>
          <Paper 
            elevation={3} 
            sx={{
              p: 3, 
              height: '100%',
              cursor: 'pointer',
              ...getCardStyle(selected.playlists.length > 0)
            }}
            onClick={() => handleToggleAll('playlists')}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Playlist ({data.playlists.length})</Typography>
              <Checkbox
                checked={selected.playlists.length === data.playlists.length && data.playlists.length > 0}
                indeterminate={selected.playlists.length > 0 && selected.playlists.length < data.playlists.length}
              />
            </Box>
            
            <Divider sx={{ mb: 2 }} />
            
            <List sx={{ maxHeight: 300, overflow: 'auto' }}>
              {data.playlists.map((playlist) => (
                <React.Fragment key={playlist.id}>
                  <ListItem dense>
                    <ListItemText 
                      primary={playlist.name} 
                      secondary={`${playlist.tracks.total} tracks`} 
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlaylistToggle(playlist.id);
                      }}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Button 
                        size="small" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleExpandPlaylist(playlist.id);
                        }}
                      >
                        {expandedPlaylists[playlist.id] ? 'Close' : 'Expand'}
                      </Button>
                      <Checkbox
                        edge="end"
                        checked={selected.playlists.includes(playlist.id)}
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlaylistToggle(playlist.id);
                        }}
                      />
                    </Box>
                  </ListItem>
                  
                  {/* Expandable menu with tracks */}
                  {expandedPlaylists[playlist.id] && (
                    <Box sx={{ pl: 4, pr: 2, pb: 1 }}>
                      {playlist.loadedTracks ? (
                        playlist.loadedTracks.length > 0 ? (
                          <List dense disablePadding>
                            {playlist.loadedTracks.map((track) => (
                              <ListItem key={track.id} dense sx={{ py: 0.5 }}>
                                <ListItemText 
                                  primary={track.name} 
                                  secondary={track.artists.map(a => a.name).join(', ')}
                                  primaryTypographyProps={{ variant: 'body2' }}
                                  secondaryTypographyProps={{ variant: 'caption' }}
                                />
                                <Checkbox
                                  size="small"
                                  edge="end"
                                  checked={!selected.playlistTracks[playlist.id]?.includes(track.id)}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleTrackToggle(playlist.id, track.id);
                                  }}
                                />
                              </ListItem>
                            ))}
                          </List>
                        ) : (
                          <Typography variant="body2" sx={{ py: 1, textAlign: 'center' }}>
                            No tracks in this playlist
                          </Typography>
                        )
                      ) : (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                          <CircularProgress size={24} />
                        </Box>
                      )}
                    </Box>
                  )}
                  <Divider />
                </React.Fragment>
              ))}
              {data.playlists.length === 0 && (
                <ListItem>
                  <ListItemText primary="No playlist found" />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>
        
        {/* Brani Preferiti */}
        <Grid item xs={12} md={6} lg={4}>
          <Paper 
            elevation={3} 
            sx={{
              p: 3, 
              height: '100%',
              cursor: 'pointer',
              ...getCardStyle(selected.savedTracks)
            }}
            onClick={(e) => {
              // Prevent clicking on entire Paper from activating toggleAll when expanded
              if (!selected.expandedTracks) {
                handleToggleAll('savedTracks');
              }
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Favorite Tracks ({data.savedTracks.length})</Typography>
              <Checkbox
                checked={selected.savedTracks}
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleAll('savedTracks');
                }}
              />
            </Box>
            
            <Divider sx={{ mb: 2 }} />
            
            {/* Compact view when not expanded */}
            {!selected.expandedTracks ? (
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#1DB954' }}>
                  {data.savedTracks.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  songs to migrate
                </Typography>
                <Button 
                  variant="outlined" 
                  size="small" 
                  sx={{ mt: 2 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelected(prev => ({ ...prev, expandedTracks: true }));
                  }}
                >
                  Show Tracks
                </Button>
              </Box>
            ) : (
              <Box onClick={(e) => e.stopPropagation()}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Select songs to migrate
                  </Typography>
                  <Button 
                    variant="outlined" 
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelected(prev => ({ ...prev, expandedTracks: false }));
                    }}
                  >
                    Close
                  </Button>
                </Box>
                
                <List sx={{ maxHeight: 300, overflow: 'auto' }}>
                  {data.savedTracks.slice(0, pagination.savedTracks.page * pagination.savedTracks.perPage).map((item) => (
                    <ListItem key={item.track.id} dense>
                      <ListItemText 
                        primary={item.track.name} 
                        secondary={item.track.artists.map(a => a.name).join(', ')} 
                        primaryTypographyProps={{ variant: 'body2' }}
                        secondaryTypographyProps={{ variant: 'caption' }}
                      />
                      <Checkbox
                        edge="end"
                        checked={selected.savedTrackIds.includes(item.track.id)}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSavedTrackToggle(item.track.id);
                        }}
                      />
                    </ListItem>
                  ))}
                  {hasMore('savedTracks') && (
                    <Button
                      fullWidth
                      onClick={(e) => {
                        e.stopPropagation();
                        loadMore('savedTracks');
                      }}
                      disabled={loading}
                    >
                      {loading ? 'Loading...' : 'Load more songs'}
                    </Button>
                  )}
                </List>
              </Box>
            )}
          </Paper>
        </Grid>
        
        {/* Artists Followed */}
        <Grid item xs={12} md={6} lg={4}>
          <Paper 
            elevation={3} 
            sx={{
              p: 3, 
              height: '100%',
              cursor: 'pointer',
              ...getCardStyle(selected.followedArtists)
            }}
            onClick={(e) => {
              // Prevent clicking on entire Paper from activating toggleAll when expanded
              if (!selected.expandedArtists) {
                handleToggleAll('followedArtists');
              }
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Artists Followed ({data.followedArtists.length})</Typography>
              <Checkbox
                checked={selected.followedArtists}
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleAll('followedArtists');
                }}
              />
            </Box>
            
            <Divider sx={{ mb: 2 }} />
            
            {/* Compact view when not expanded */}
            {!selected.expandedArtists ? (
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#1DB954' }}>
                  {data.followedArtists.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  artists to migrate
                </Typography>
                <Button 
                  variant="outlined" 
                  size="small" 
                  sx={{ mt: 2 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelected(prev => ({ ...prev, expandedArtists: true }));
                  }}
                >
                  Artists Show
                </Button>
              </Box>
            ) : (
              <Box onClick={(e) => e.stopPropagation()}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Select artists to migrate
                  </Typography>
                  <Button 
                    variant="outlined" 
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelected(prev => ({ ...prev, expandedArtists: false }));
                    }}
                  >
                    Close
                  </Button>
                </Box>
                
                <List sx={{ maxHeight: 300, overflow: 'auto' }}>
                  {data.followedArtists.slice(0, pagination.followedArtists.page * pagination.followedArtists.perPage).map((artist) => (
                    <ListItem key={artist.id} dense>
                      <ListItemText 
                        primary={artist.name} 
                        secondary={artist.genres?.join(', ')} 
                        primaryTypographyProps={{ variant: 'body2' }}
                        secondaryTypographyProps={{ variant: 'caption' }}
                      />
                      <Checkbox
                        edge="end"
                        checked={selected.followedArtistIds.includes(artist.id)}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFollowedArtistToggle(artist.id);
                        }}
                      />
                    </ListItem>
                  ))}
                  {hasMore('followedArtists') && (
                    <Button
                      fullWidth
                      onClick={(e) => {
                        e.stopPropagation();
                        loadMore('followedArtists');
                      }}
                      disabled={loading}
                    >
                      {loading ? 'Loading...' : 'Load more artists'}
                    </Button>
                  )}
                </List>
              </Box>
            )}
          </Paper>
        </Grid>
        
        {/* Friends Followed */}
        {data.followedUsers.length > 0 && (
          <Grid item xs={12} md={6} lg={4}>
            <Paper 
              elevation={3} 
              sx={{
                p: 3, 
                height: '100%',
                cursor: 'pointer',
                ...getCardStyle(selected.followedUsers)
              }}
              onClick={() => handleToggleAll('followedUsers')}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Friends Followed</Typography>
              </Box>
              
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#1DB954' }}>
                  {data.followedUsers.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  friends to migrate
                </Typography>
              </Box>
            </Paper>
          </Grid>
        )}
      </Grid>
      
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Button 
          variant="contained" 
          color="primary" 
          size="large"
          onClick={handleProceed}
          disabled={
            selected.playlists.length === 0 && 
            !selected.savedTracks && 
            selected.savedTrackIds.length === 0 && 
            !selected.followedArtists && 
            selected.followedArtistIds.length === 0 && 
            !selected.followedUsers
          }
        >
          Start Migration
        </Button>
      </Box>
    </Container>
  );
};

export default Preview;
